# Multitenancy Plan

## Overview

Each tenant gets its own isolated PostgreSQL database on the **same Postgres instance**. The database name is prefixed as `tenant_[slug]` (e.g. tenant `acme` → database `tenant_acme`). All tenants share the same API (this backend). TypeORM is used for all database access.

Every request **must** include the `x-tenant` header — it is not optional. For authenticated routes, the JWT `tenantId` claim is a required security double-check: the backend compares the header value against the token claim and rejects any mismatch. This prevents a stolen token issued for tenant A from being used against tenant B.

Multitenancy (separate databases per tenant) can be toggled off via `MULTITENANCY_ENABLED=false`. When disabled, all tenants share the `master` database — the `x-tenant` / JWT validation and the `tenants` table remain active for tenant configuration purposes, but no per-tenant database connections are created.

---

## 1. App Config (`src/config/config.ts`)

All environment variables are centralized in `config.ts`. Update it to expose all database connection fields, the multitenancy flag, and any other app-level config:

```typescript
// src/config/config.ts
export default () => ({
  server: {
    port: process.env.PORT || 3000,
  },
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASS ?? '',
    name: process.env.DB_NAME ?? 'master',
  },
  multitenancy: {
    enabled: process.env.MULTITENANCY_ENABLED !== 'false',
  },
});
```

> `enabled` defaults to `true` — opt out explicitly by setting `MULTITENANCY_ENABLED=false`. Individual DB fields (host, port, username, password) are preferred over a connection string so `datasource.ts` can compose them with a dynamic database name per tenant.

---

## 2. Shared DataSource Config (`src/database/datasource.ts`)

All tenant databases share the same connection options — only the `database` field differs. A base config object is defined once and reused everywhere (tenant provider, migration runner, etc.). It imports from `config.ts` directly so it works both inside NestJS DI and in standalone CLI scripts (e.g. the migration runner).

```
src/
  config/
    config.ts         # env vars and defaults
database/
  datasource.ts     # base DataSourceOptions shared by all tenant connections
```

```typescript
// src/database/datasource.ts
import { DataSourceOptions } from 'typeorm';
import config from '../config/config';

const cfg = config();

export const baseDataSourceOptions: Omit<DataSourceOptions, 'database'> = {
  type: 'postgres',
  host: cfg.database.host,
  port: cfg.database.port,
  username: cfg.database.username,
  password: cfg.database.password,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
};

export const masterDataSourceOptions: DataSourceOptions = {
  ...(baseDataSourceOptions as DataSourceOptions),
  database: cfg.database.name,
};
```

The `master` database uses the exported `masterDataSourceOptions` directly:

```typescript
// AppModule
TypeOrmModule.forRoot(masterDataSourceOptions)
```

---

## 3. Tenant Registry (`master` Database)

A single shared database named **`master`** on the same Postgres instance holds the tenant registry. It is always present regardless of whether multitenancy is enabled.

### Table: `tenants`

| Column        | Type      | Notes                                                        |
|---------------|-----------|--------------------------------------------------------------|
| id            | uuid (PK) |                                                              |
| slug          | varchar   | Unique. Used in `x-tenant` / JWT. DB name is `tenant_[slug]` when multitenancy is enabled |
| name          | varchar   | Display name                                                 |
| configuration | jsonb     | Tenant-specific settings (feature flags, limits, branding, etc.) |
| is_active     | boolean   | Soft-disable a tenant                                        |
| created_at    | timestamp |                                                              |

---

## 4. Tenant Resolution & Validation

These steps apply regardless of whether multitenancy is enabled.

### Step 1 — Require `x-tenant` header

Every request must carry the header. If missing, reject immediately with `400 Bad Request`.

```
POST /api/graphql
x-tenant: acme
Authorization: Bearer <jwt>
```

### Step 2 — Verify JWT claim matches header (authenticated routes)

After the JWT is validated, extract the `tenantId` claim and compare it to the `x-tenant` header value:

```
x-tenant: acme  +  JWT tenantId: acme   →  PASS
x-tenant: acme  +  JWT tenantId: globex →  REJECT 401 (token/tenant mismatch)
```

### Step 3 — Confirm tenant is active

Look up the slug in the `tenants` registry table. If not found or `is_active = false`, reject with `403 Forbidden`.

### Full flow per request

```
Request arrives
  → x-tenant header present?  NO  → 400
  → JWT valid?                 NO  → 401
  → JWT tenantId === x-tenant? NO  → 401
  → tenant exists & active?    NO  → 403
  → resolve DB connection via tenant provider
  → proceed
```

---

## 5. Tenant Context Propagation (NestJS)

### 5a. TenantModule structure

```
src/
  tenant/
    tenant.module.ts
    tenant.middleware.ts    # enforces x-tenant header, attaches slug to req
    tenant.guard.ts         # compares x-tenant with JWT tenantId claim
    tenant.provider.ts      # REQUEST-scoped useFactory → tenant DataSource
    tenant.decorator.ts     # @CurrentTenant() param decorator
```

### 5b. TenantMiddleware

Runs on every request. Enforces the `x-tenant` header and attaches the slug to `req`.

```typescript
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const slug = req.headers['x-tenant'] as string;
    if (!slug) throw new BadRequestException('Missing x-tenant header');
    req['tenantSlug'] = slug;
    next();
  }
}
```

Registered in `TenantModule`:

```typescript
export class TenantModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
```

### 5c. TenantGuard

Applied to all authenticated routes. Runs after `JwtAuthGuard` and compares `x-tenant` against the JWT `tenantId` claim.

```typescript
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    if (req['tenantSlug'] !== req.user?.tenantId) {
      throw new UnauthorizedException('Tenant mismatch');
    }
    return true;
  }
}
```

### 5d. Tenant DataSource Provider (`tenant.provider.ts`)

REQUEST-scoped provider. `useFactory` reads `MULTITENANCY_ENABLED` from config:

- **Enabled** — builds `tenant_${slug}` as the database name and returns a cached or newly initialized `DataSource` for that tenant.
- **Disabled** — skips per-tenant connection lookup and returns the shared `master` `DataSource` directly. All tenants share the same database.

A module-level `Map` holds the connection cache so connections survive across requests.

```typescript
// src/tenant/tenant.provider.ts
import { REQUEST } from '@nestjs/core';
import { Scope } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Request } from 'express';
import { baseDataSourceOptions } from '../database/datasource';
import config from '../config/config';

export const TENANT_DATASOURCE = 'TENANT_DATASOURCE';

const connectionCache = new Map<string, DataSource>();

const masterDs = new DataSource({
  ...baseDataSourceOptions,
  database: 'master',
} as DataSourceOptions);

export const tenantDataSourceProvider = {
  provide: TENANT_DATASOURCE,
  scope: Scope.REQUEST,
  inject: [REQUEST],
  useFactory: async (req: Request): Promise<DataSource> => {
    const { enabled } = config().multitenancy;

    if (!enabled) {
      if (!masterDs.isInitialized) await masterDs.initialize();
      return masterDs;
    }

    const slug = req['tenantSlug'];
    if (!slug) throw new Error('Tenant slug not resolved on request');

    const dbName = `tenant_${slug}`;

    if (connectionCache.has(dbName)) return connectionCache.get(dbName);

    const ds = new DataSource({
      ...baseDataSourceOptions,
      database: dbName,
    } as DataSourceOptions);

    await ds.initialize();
    connectionCache.set(dbName, ds);
    return ds;
  },
};
```

Exported from `TenantModule` so other modules can inject `TENANT_DATASOURCE`:

```typescript
@Module({
  providers: [tenantDataSourceProvider],
  exports: [tenantDataSourceProvider],
})
export class TenantModule implements NestModule { ... }
```

### 5e. Injecting the tenant DataSource in a service

Any service that needs to query a tenant's database injects `TENANT_DATASOURCE`. Because the provider is REQUEST-scoped, the consuming service must also be REQUEST-scoped.

```typescript
@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    @Inject(TENANT_DATASOURCE) private readonly ds: DataSource,
  ) {}

  findAll() {
    return this.ds.getRepository(User).find();
  }
}
```

### 5f. @CurrentTenant() Decorator

```typescript
export const CurrentTenant = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const req = GqlExecutionContext.create(ctx).getContext().req;
    return req['tenantSlug'];
  },
);
```

---

## 6. Tenant Database Schema

When multitenancy is **enabled**, each tenant database (`tenant_acme`, `tenant_globex`, etc.) has the same schema managed by the shared TypeORM migrations. When multitenancy is **disabled**, the `master` database holds all data and the same migrations apply to it directly.

Isolation is always enforced at the connection level — no `tenantId` FK on any row.

### Table: `users`

| Column     | Type      | Notes                        |
|------------|-----------|------------------------------|
| id         | uuid (PK) |                              |
| email      | varchar   | Unique within the tenant     |
| password   | varchar   | Hashed                       |
| role       | enum      | `admin`, `member`, etc.      |
| is_active  | boolean   |                              |
| created_at | timestamp |                              |

---

## 7. JWT Token Design

Tokens are issued per-tenant. The `tenantId` claim must be embedded at sign time and must match the tenant slug exactly:

```typescript
this.jwtService.sign({
  sub: user.id,
  tenantId: tenant.slug,  // must match x-tenant on every request
  role: user.role,
});
```

---

## 8. Migration Strategy

All databases share the same schema. The `baseDataSourceOptions` points to the shared migrations directory so the same migration files apply everywhere.

**When `MULTITENANCY_ENABLED=true` — CLI runner per tenant (deploy pipeline)**

```typescript
import { baseDataSourceOptions } from './src/database/datasource';

const tenants = await registryDs.getRepository(Tenant).findBy({ is_active: true });

for (const tenant of tenants) {
  const ds = new DataSource({ ...baseDataSourceOptions, database: `tenant_${tenant.slug}` } as DataSourceOptions);
  await ds.initialize();
  await ds.runMigrations();
  await ds.destroy();
}
```

**When `MULTITENANCY_ENABLED=false` — run once against `master`**

```typescript
import { baseDataSourceOptions } from './src/database/datasource';

const ds = new DataSource({ ...baseDataSourceOptions, database: 'master' } as DataSourceOptions);
await ds.initialize();
await ds.runMigrations();
await ds.destroy();
```

Run as a step in the deploy pipeline before restarting the API.

---

## 9. Provisioning a New Tenant

**When `MULTITENANCY_ENABLED=true`**

1. Create the database: `CREATE DATABASE tenant_acme;`
2. Run migrations against it via the CLI runner.
3. Insert a row into `tenants`: `{ slug: 'acme', name: 'Acme Corp', is_active: true }`.
4. The running API picks it up on the next request — no restart needed.

**When `MULTITENANCY_ENABLED=false`**

1. Insert a row into `tenants`: `{ slug: 'acme', name: 'Acme Corp', is_active: true }`.
2. No new database or migrations needed — all tenants share `master`.

---

## 10. Security Considerations

- Always compare `x-tenant` header with the JWT `tenantId` claim before executing any query.
- Never log or expose DB credentials or connection strings.
- When multitenancy is enabled, use a dedicated Postgres role per tenant with access only to its own database.
- Rate-limit by `x-tenant` to prevent tenant enumeration.
- Rotate the shared JWT secret independently from tenant DB credentials.
