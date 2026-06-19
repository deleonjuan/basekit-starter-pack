# Settings System Plan

## Overview

Two categories of settings:

- **Global settings** — apply to the entire application. Editable by any user with the `settings.global:write` permission.
- **Personal settings** — per-user preferences. Readable and writable by the owning user only.

Both scopes live in **one table**, distinguished by a `scope` column. Default values for every setting — both global and personal — are defined in a single server-side registry file that is the authoritative source of truth.

---

## Database

### Single `settings` table

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` PK | |
| `key` | `VARCHAR` | Registry key e.g. `app.name`, `ui.theme` |
| `value` | `JSONB` | Stored override value |
| `scope` | `VARCHAR(10)` | `'global'` or `'personal'` |
| `user_id` | `UUID` FK → `users.id` nullable | `NULL` for global rows, required for personal rows |
| `created_at` | `TIMESTAMPTZ` | |
| `updated_at` | `TIMESTAMPTZ` | Auto-updated on write |

```sql
CREATE TABLE settings (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  key        VARCHAR     NOT NULL,
  value      JSONB       NOT NULL,
  scope      VARCHAR(10) NOT NULL CHECK (scope IN ('global', 'personal')),
  user_id    UUID        REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Only one global row per key
  CONSTRAINT chk_user_id_scope CHECK (
    (scope = 'global' AND user_id IS NULL) OR
    (scope = 'personal' AND user_id IS NOT NULL)
  )
);

-- One global row per key
CREATE UNIQUE INDEX settings_global_key_idx
  ON settings (key) WHERE scope = 'global';

-- One personal row per user per key
CREATE UNIQUE INDEX settings_personal_user_key_idx
  ON settings (key, user_id) WHERE scope = 'personal';
```

The DB only stores rows when a value has been explicitly set (overrides). Missing rows resolve to the registry default at query time.

---

## Settings Registry

A single registry file is the **only place** where setting definitions and defaults are declared. It covers both scopes.

```
src/settings/registry/settings.registry.ts
```

```ts
export type SettingType = 'string' | 'boolean' | 'number' | 'select';
export type SettingScope = 'global' | 'personal';

export interface SettingDefinition {
  key: string;
  scope: SettingScope;
  type: SettingType;
  default: unknown;          // used when no DB row exists
  label: string;
  description?: string;
  options?: string[];        // only for type: 'select'
  permission?: string;       // permission required to write (global settings only)
}

export const SETTINGS_REGISTRY: SettingDefinition[] = [

  // ── Global ──────────────────────────────────────────────────────────────
  {
    key: 'app.name',
    scope: 'global',
    type: 'string',
    default: 'BaseKit',
    label: 'App name',
    description: 'Display name shown in the UI and emails.',
    permission: 'settings.global:write',
  },
  {
    key: 'app.registration',
    scope: 'global',
    type: 'boolean',
    default: false,
    label: 'Allow public registration',
    permission: 'settings.global:write',
  },
  {
    key: 'security.session_ttl',
    scope: 'global',
    type: 'number',
    default: 15,
    label: 'Session TTL (minutes)',
    description: 'Access token lifetime. Changing this requires a server restart.',
    permission: 'settings.global:write',
  },
  {
    key: 'security.pwd_min_len',
    scope: 'global',
    type: 'number',
    default: 8,
    label: 'Minimum password length',
    permission: 'settings.global:write',
  },

  // ── Personal ────────────────────────────────────────────────────────────
  {
    key: 'ui.theme',
    scope: 'personal',
    type: 'select',
    default: 'system',
    options: ['light', 'dark', 'system'],
    label: 'Theme',
  },
  {
    key: 'ui.language',
    scope: 'personal',
    type: 'select',
    default: 'es',
    options: ['es', 'en'],
    label: 'Language',
  },
];
```

### How defaults are resolved

```ts
// Service helper — same logic for both scopes
function resolveSettings(
  definitions: SettingDefinition[],
  rows: Setting[],            // DB rows
): ResolvedSetting[] {
  const rowMap = new Map(rows.map(r => [r.key, r]));
  return definitions.map(def => ({
    ...def,
    value: rowMap.has(def.key) ? rowMap.get(def.key)!.value : def.default,
    isDefault: !rowMap.has(def.key),
  }));
}
```

Personal settings for a user who has never changed anything will always return the defaults defined in the registry — no rows needed in the DB.

---

## Backend Module

### Files

```
src/settings/
  settings.module.ts
  settings.resolver.ts
  settings.service.ts
  entities/
    setting.entity.ts
  dto/
    setting.type.ts            # GQL output type
    update-setting.input.ts    # { key, value }
  registry/
    settings.registry.ts       # single registry (all scopes and defaults)
```

### GraphQL API

```graphql
type Setting {
  key:         String!
  value:       JSON!
  scope:       String!    # 'global' | 'personal'
  type:        String!    # 'string' | 'boolean' | 'number' | 'select'
  label:       String!
  description: String
  options:     [String!]
  isDefault:   Boolean!   # true when no DB row exists — value is the registry default
}

type Query {
  globalSettings:   [Setting!]!   # requires settings.global:read or any authenticated user
  personalSettings: [Setting!]!   # current user only
}

type Mutation {
  updateGlobalSetting(key: String!, value: JSON!): Setting!   # requires settings.global:write
  resetGlobalSetting(key: String!): Setting!                  # requires settings.global:write — deletes row, reverts to default
  updatePersonalSetting(key: String!, value: JSON!): Setting! # current user
  resetPersonalSetting(key: String!): Setting!                # current user
}
```

### Service logic

- `getGlobalSettings()` — filter registry by `scope = 'global'`, query DB `WHERE scope = 'global'`, merge
- `updateGlobalSetting(key, value)` — validate key in registry AND scope is `'global'`, validate value type, UPSERT `WHERE scope = 'global' AND key = ?`
- `resetGlobalSetting(key)` — DELETE `WHERE scope = 'global' AND key = ?`, return definition with default
- `getPersonalSettings(userId)` — filter registry by `scope = 'personal'`, query DB `WHERE scope = 'personal' AND user_id = ?`, merge
- `updatePersonalSetting(userId, key, value)` — UPSERT `WHERE scope = 'personal' AND key = ? AND user_id = ?`
- `resetPersonalSetting(userId, key)` — DELETE row

### Access control

| Operation | Guard |
|---|---|
| `globalSettings` query | `@RequirePermissions('settings.global:read')` |
| `updateGlobalSetting` / `resetGlobalSetting` | `@RequirePermissions('settings.global:write')` |
| `personalSettings` query | JWT only (current user) |
| `updatePersonalSetting` / `resetPersonalSetting` | JWT only (current user) |

The `settings.global:read` and `settings.global:write` permissions are seeded into the permissions table and assigned to the appropriate roles via the existing roles system.

---

## Frontend

### Structure

```
src/modules/settings/
  settings.page.tsx             ← tab routing via ?view=
  systemSettings.view.tsx       ← global settings (requires settings.global:read)
  personalSettings.view.tsx     ← personal settings (all authenticated users)
  components/
    SettingsTabs.tsx
    SettingField.tsx             ← renders correct input for setting.type
  queries/
    getGlobalSettings.query.ts
    getPersonalSettings.query.ts
    updateGlobalSetting.mutation.ts
    updatePersonalSetting.mutation.ts
    resetGlobalSetting.mutation.ts
    resetPersonalSetting.mutation.ts
```

### Tabs

| `?view=` | Label | Who sees it |
|---|---|---|
| `system` | Sistema | Users with `settings.global:read` |
| `personal` | Personal | All authenticated users |

### `SettingField` component

| `setting.type` | Rendered as |
|---|---|
| `string` | `<Input>` |
| `boolean` | `<Switch>` |
| `number` | `<Input type="number">` |
| `select` | `<Select>` populated from `setting.options` |

Personal settings save immediately on change. Global settings show a Save button per field (or group) to prevent accidental overwrites.

---

## Key decisions

1. **One table, two scopes** — `scope` column + partial unique indexes keep the schema minimal while enforcing correct uniqueness for both global (`scope = 'global'`, no `user_id`) and personal (`scope = 'personal'`, `user_id` required).
2. **Single registry file** — all defaults, types, labels, and required permissions live in one place. Adding a new setting is a one-line change there.
3. **DB stores overrides only** — missing row = use registry default. No seeding step required; the registry is the seed.
4. **Permission-based editing** — global settings use the existing `permissions` table and role system. No hard-coded super-admin requirement; any role with `settings.global:write` can edit.
5. **UPSERT on write, DELETE on reset** — no sentinel "use-default" values in the DB; absence of a row is unambiguous.
