# Multitenancy Plan

## Overview

Each tenant gets its own isolated PostgreSQL database on the **same Postgres instance**. The database name matches the tenant slug (e.g. tenant `acme` → database `acme`). All tenants share the same API (this backend). TypeORM is used for all database access.

Every request **must** include the `x-tenant` header — it is not optional. For authenticated routes, the JWT `tenantId` claim is a required security double-check: the backend compares the header value against the token claim and rejects any mismatch. This prevents a stolen token issued for tenant A from being used against tenant B.

---

## 1. Tenant Registry (Shared / Public Database)

A single shared database (e.g. named `registry`) on the same Postgres instance holds the tenant registry. This is the only database the app connects to at startup, configured via the standard `TypeOrmModule.forRoot()`.

### Table: `tenants`

| Column       | Type      | Notes                                                      |
|--------------|-----------|------------------------------------------------------------|
| id           | uuid (PK) |                                                            |
| slug         | varchar   | Unique. Used as the database name and in `x-tenant` / JWT  |
| name         | varchar   | Display name                                               |
| is_active    | boolean   | Soft-disable a tenant                                      |
| created_at   | timestamp |                                                            |

> No `db_url` needed — the connection is built at runtime using the shared config + tenant slug as the database name.

---

## 2. Tenant Resolution & Validation

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

This blocks cross-tenant token reuse — a token stolen from a `globex` user cannot be used on the `acme` tenant.

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

## 3. Shared DataSource Config (`datasource.ts`)

All tenant databases share the same connection options — only the `database` field differs. A base config object is defined once and reused everywhere (tenant provider, migration runner, etc.).

```
src/
  database/
    datasource.ts   # base DataSourceOptions shared by all tenant connections
```

```typescript
// src/database/datasource.ts
import { DataSourceOptions } from 'typeorm';

export const baseDataSourceOptions: Omit<DataSourceOptions, 'database'> = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
};
```

The registry database connection also uses this base, just with `database: 'registry'`:

```typescript
// used in AppModule TypeOrmModule.forRoot()
TypeOrmModule.forRoot({
  ...baseDataSourceOptions,
  database: 'registry',
} as DataSourceOptions)
```

---

## 4. Tenant Context Propagation (NestJS)

### 4a. TenantModule structure

```
src/
  tenant/
    tenant.module.ts
    tenant.middleware.ts    # enforces x-tenant header, attaches slug to req
    tenant.guard.ts         # compares x-tenant with JWT tenantId claim
    tenant.provider.ts      # REQUEST-scoped useFactory → tenant DataSource
    tenant.decorator.ts     # @CurrentTenant() param decorator
```

### 4b. TenantMiddleware

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

### 4c. TenantGuard

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

### 4d. Tenant DataSource Provider (`tenant.provider.ts`)

This is the core of the connection-switching mechanism. It is **REQUEST-scoped** so NestJS creates a new instance per request. `useFactory` receives the raw request via the `REQUEST` token, extracts the tenant slug, and returns a cached (or newly initialized) TypeORM `DataSource` for that tenant's database.

A module-level `Map` holds the connection cache so connections survive across requests.

```typescript
// src/tenant/tenant.provider.ts
import { REQUEST } from '@nestjs/core';
import { Scope } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Request } from 'express';
import { baseDataSourceOptions } from '../database/datasource';

export const TENANT_DATASOURCE = 'TENANT_DATASOURCE';

// Cache lives outside the request scope so connections are reused
const connectionCache = new Map<string, DataSource>();

export const tenantDataSourceProvider = {
  provide: TENANT_DATASOURCE,
  scope: Scope.REQUEST,
  inject: [REQUEST],
  useFactory: async (req: Request): Promise<DataSource> => {
    const slug = req['tenantSlug'];
    if (!slug) throw new Error('Tenant slug not resolved on request');

    if (connectionCache.has(slug)) return connectionCache.get(slug);

    const ds = new DataSource({
      ...baseDataSourceOptions,
      database: slug,
    } as DataSourceOptions);

    await ds.initialize();
    connectionCache.set(slug, ds);
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

### 4e. Injecting the tenant DataSource in a service

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

### 4f. @CurrentTenant() Decorator

```typescript
export const CurrentTenant = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const req = GqlExecutionContext.create(ctx).getContext().req;
    return req['tenantSlug'];
  },
);
```

---

## 5. Tenant Database Schema

Each tenant database (`acme`, `globex`, etc.) has the same schema, managed by the shared TypeORM migrations. Isolation is enforced at the connection level — no `tenantId` FK on any row.

### Table: `users` (per-tenant DB)

| Column     | Type      | Notes                        |
|------------|-----------|------------------------------|
| id         | uuid (PK) |                              |
| email      | varchar   | Unique within the tenant     |
| password   | varchar   | Hashed                       |
| role       | enum      | `admin`, `member`, etc.      |
| is_active  | boolean   |                              |
| created_at | timestamp |                              |

---

## 6. JWT Token Design

Tokens are issued per-tenant. The `tenantId` claim must be embedded at sign time and must match the tenant slug exactly:

```typescript
this.jwtService.sign({
  sub: user.id,
  tenantId: tenant.slug,  // must match x-tenant on every request
  role: user.role,
});
```

---

## 7. Migration Strategy

All tenant databases share the same schema. The `baseDataSourceOptions` already points to the shared migrations directory, so the same migration files apply to every tenant.

**Recommended: CLI migration runner (deploy pipeline)**

```typescript
import { baseDataSourceOptions } from './src/database/datasource';

const tenants = await registryDs.getRepository(Tenant).findBy({ is_active: true });

for (const tenant of tenants) {
  const ds = new DataSource({ ...baseDataSourceOptions, database: tenant.slug } as DataSourceOptions);
  await ds.initialize();
  await ds.runMigrations();
  await ds.destroy();
}
```

Run this as a step in the deploy pipeline before restarting the API.

---

## 8. Provisioning a New Tenant

1. Create the database on the Postgres instance: `CREATE DATABASE acme;`
2. Run migrations against it via the CLI runner.
3. Insert a row into the `tenants` registry: `{ slug: 'acme', name: 'Acme Corp', is_active: true }`.
4. The running API picks it up automatically on the next request — no restart needed.

---

## 9. Security Considerations

- Always compare `x-tenant` header with the JWT `tenantId` claim before executing any query.
- Never log or expose DB credentials or connection strings.
- Use a dedicated Postgres role per tenant with access only to its own database.
- Rate-limit by `x-tenant` to prevent tenant enumeration.
- Rotate the shared JWT secret independently from tenant DB credentials.
