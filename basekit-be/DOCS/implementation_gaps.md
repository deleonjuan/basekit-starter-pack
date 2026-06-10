# Implementation Gaps

Cross-reference of `multitenancy_plan.md` and `users_and_auth_plan.md` against the current codebase. Items are ordered by severity.

Legend: ✅ Resolved · ⚠️ Partially addressed · ❌ Open

---

## Critical — Correctness / Security Broken

### ✅ 1. `TenantGuard` was never applied

**Fixed in:** `b9b424f`

`auth.module.ts` now registers `TenantGuard` as `APP_GUARD` between `JwtAuthGuard` and `PermissionsGuard`. `TenantModule` exports `TypeOrmModule` so `Repository<Tenant>` resolves correctly when NestJS instantiates the guard in `AuthModule` scope.

```typescript
{ provide: APP_GUARD, useClass: JwtAuthGuard },
{ provide: APP_GUARD, useClass: TenantGuard },      // added
{ provide: APP_GUARD, useClass: PermissionsGuard },
```

---

### ✅ 2. `TenantGuard` broke `@Public()` routes when applied globally

**Fixed in:** `b9b424f`

`TenantGuard` now injects `Reflector` and reads `IS_PUBLIC_KEY`. On public routes the JWT `tenantId` comparison is skipped; the tenant registry lookup (`isActive: true`) still runs on every route — including public ones — so a disabled tenant cannot reach `login` either.

---

### ✅ 3. Login did not verify the tenant is active

**Fixed in:** `b9b424f`

`AuthService.login()` now calls `tenantService.findById(user.tenantId)` after credential validation and throws `403 Forbidden` if the tenant is inactive. Super admins bypass this check.

---

### ✅ 4. Refresh tokens were stateless — no storage or revocation

**Fixed in:** `b9b424f`

- `src/auth/entities/refresh-token.entity.ts` created (`refresh_tokens` table: `id` = jti UUID, `user_id`, `token_hash`, `expires_at`, `created_at`).
- `buildTokens` generates a UUID `jti`, embeds it in the refresh JWT, and stores a bcrypt hash of the token.
- `refresh` looks up the record by `jti`, verifies the hash, deletes the old row before issuing new tokens (rotation).
- `logout` decodes the refresh cookie and deletes its record by `jti`.

---

### ✅ 5. No database migrations; CLI `dataSource` was broken

**Fixed in:** `9ba58c4`

- `database/datasource.ts` default export fixed to use `masterDataSourceOptions` (was `baseDataSourceOptions` which has no `database` field — TypeORM CLI would fail to connect).
- `package.json` `typeorm` script path fixed from non-existent `db/datasource.ts` to `database/datasource.ts`.
- `database/migrations/1780876800000-InitialSchema.ts` created — covers all tables: `tenants`, `roles`, `permissions`, `users`, `user_roles`, `role_permissions`, `refresh_tokens`.
- `scripts/migrate-tenants.ts` created — connects to master, iterates active tenants, runs migrations against each `tenant_${slug}` database.
- `scripts/create-tenant.ts` created — creates the Postgres database, runs migrations, inserts registry row.
- `scripts/create-user.ts` created — hashes password (bcrypt cost 12), inserts into correct database (master for super admins, tenant DB otherwise).

**Usage:**
```bash
pnpm migration:run                               # master DB
pnpm migration:run:tenants                       # all active tenant DBs
pnpm tenant:create --slug acme --name "Acme"
pnpm user:create --username admin --password secret --super-admin
pnpm user:create --username alice --password secret --tenant acme
```

---

### ✅ Unlisted: JWT `tenantId` claim embedded UUID instead of slug

**Fixed in:** `b9b424f`

The original `buildTokens` set `tenantId: user.tenantId` — the UUID FK from the `users.tenant_id` column — while `TenantGuard` compared it against the `x-tenant` header slug. They could never match, breaking every authenticated request.

`buildTokens` now accepts an explicit `tenantSlug: string | null` parameter. `login` resolves the slug from the `Tenant` record it already fetches for the active check; `refresh` forwards `decoded.tenantId` which is already a slug.

---

## Medium — Missing Features Specified by Plan

### ✅ 6. `AuthPayload` GraphQL type was missing `accessToken` and `refreshToken` fields

**Fixed:** `auth-payload.type.ts` now exposes both fields. `AuthResolver.login` and `AuthResolver.refreshToken` return `{ accessToken, refreshToken, user }`. Tokens are still set as HttpOnly cookies simultaneously — browser clients use the cookie, non-browser clients read the response body.

---

### ✅ 7. JWT transport — cookie-only by design

**Closed as intentional:** JWT is always transported via the `access_token` HttpOnly cookie set by the server. `Authorization: Bearer` header is not supported. `JwtStrategy` extracts the token exclusively from the cookie.

---

### ✅ 8. `baseDataSourceOptions` type is now strict

**Fixed:** `database/datasource.ts` uses `Omit<Extract<DataSourceOptions, { type: 'postgres' }>, 'database'>` as the type for `baseDataSourceOptions`. TypeScript will now reject any attempt to use the base options directly as a `DataSource` without explicitly providing a `database` name.

---

### ✅ 9. `TENANT_DATASOURCE` provider now validates slug format

**Fixed:** `tenant.provider.ts` rejects slugs that do not match `^[a-z0-9_-]+$` before attempting a database connection. Combined with `TenantGuard` validating the slug exists in the registry, the provider has two layers of defense.

---

### ❌ 10. No rate limiting *(deferred)*

**What both plans say:**
- Multitenancy plan: rate-limit by `x-tenant` to prevent tenant enumeration.
- Auth plan: rate-limit `login` by IP and by username to prevent brute-force.

**Fix:** Install `@nestjs/throttler`, configure globally in `AppModule`, and add a tighter limit on the `login` mutation.

---

## Minor — Inconsistencies and Polish

### ✅ 11. `config/` and `database/` location — by design

**Closed as intentional:** `config/`, `database/`, and `src/` all live at the project root as sibling directories. This is the intended layout.

---

### ✅ 12. `Tenant` entity now has `updated_at`

**Fixed:** Added `@UpdateDateColumn({ name: "updated_at", type: "timestamptz" })` to `tenant.entity.ts`. Migration `1780876801000-AddTenantUpdatedAt.ts` adds the column via `ALTER TABLE "tenants" ADD COLUMN "updated_at"`.

---

### ✅ 13. Connection cache now evicts deactivated tenants

**Fixed:**

- `tenant.provider.ts` exports `evictTenantConnection(slug)` — calls `ds.destroy()` and removes the entry from `connectionCache`.
- `tenant.service.ts` adds `deactivate(id)` — sets `is_active = false`, saves, then calls `evictTenantConnection` to immediately release the connection pool.
- `tenant.resolver.ts` exposes a `deactivateTenant(id)` GraphQL mutation restricted to `@SuperAdminOnly()`; the `tenants` query is also now restricted to super admins.

---

## Summary Table

| # | Gap | Status | Fixed in |
|---|-----|--------|----------|
| 1 | `TenantGuard` never applied | ✅ Resolved | `b9b424f` |
| 2 | `TenantGuard` broke `@Public()` routes | ✅ Resolved | `b9b424f` |
| 3 | Login skipped `tenant.isActive` check | ✅ Resolved | `b9b424f` |
| 4 | Refresh tokens not stored / not revocable | ✅ Resolved | `b9b424f` |
| 5 | No migrations; CLI `dataSource` broken | ✅ Resolved | `9ba58c4` |
| — | JWT `tenantId` was UUID, not slug | ✅ Resolved | `b9b424f` |
| 6 | `AuthPayload` missing token fields | ✅ Resolved | — |
| 7 | JWT transport is cookies, not header | ✅ Resolved | — |
| 8 | `baseDataSourceOptions` type not strict | ✅ Resolved | — |
| 9 | Provider connects to unvalidated DB names | ✅ Resolved | — |
| 10 | No rate limiting | ❌ Deferred | — |
| 11 | `config/` and `database/` outside `src/` | ✅ By design | — |
| 12 | `Tenant` entity missing `updated_at` | ✅ Resolved | — |
| 13 | Connection cache never evicts deactivated tenants | ✅ Resolved | — |
