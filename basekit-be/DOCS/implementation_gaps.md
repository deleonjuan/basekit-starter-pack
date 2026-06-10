# Implementation Gaps

Cross-reference of `multitenancy_plan.md` and `users_and_auth_plan.md` against the current codebase. Items are ordered by severity.

---

## Critical — Correctness / Security Broken

### 1. `TenantGuard` is never applied

**What the plan says:** `TenantGuard` runs on every authenticated request after `JwtAuthGuard`, compares `x-tenant` against the JWT `tenantId` claim, and confirms the tenant is active in the registry.

**What exists:** `TenantGuard` is a provider in `TenantModule` and exported, but it is never registered as `APP_GUARD` and never used with `@UseGuards()` on any resolver or controller. The JWT-vs-header comparison and the `tenants` table lookup **never execute**.

**Fix:** Register it as `APP_GUARD` in `AuthModule` between `JwtAuthGuard` and `PermissionsGuard`:

```typescript
// src/auth/auth.module.ts
{ provide: APP_GUARD, useClass: JwtAuthGuard },
{ provide: APP_GUARD, useClass: TenantGuard },      // add this
{ provide: APP_GUARD, useClass: PermissionsGuard },
```

---

### 2. `TenantGuard` breaks `@Public()` routes when applied globally

**What the plan says:** The guard skips its JWT-tenantId check for super admins but has no provision for public routes.

**What exists:** On `@Public()` routes (`login`, `refreshToken`), `JwtAuthGuard` skips JWT validation — so `req.user` is `undefined`. The current guard then reads `user?.tenantId` as `undefined` and throws `UnauthorizedException("Tenant mismatch")`, blocking all public routes.

**Fix:** The guard must read the `IS_PUBLIC_KEY` reflector metadata and skip the JWT comparison while still confirming the tenant exists and is active (needed before the `TENANT_DATASOURCE` provider connects):

```typescript
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(Tenant) private readonly tenantRepo: Repository<Tenant>,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = this.getRequest(ctx);
    const headerSlug: string = req['tenantSlug'];
    const user = req.user;

    // super admins are not bound to a tenant
    if (user?.isSuperAdmin) return true;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    // on authenticated routes, enforce JWT tenantId matches the header
    if (!isPublic) {
      if (!user?.tenantId || headerSlug !== user.tenantId) {
        throw new UnauthorizedException('Tenant mismatch');
      }
    }

    // always confirm the tenant is active (blocks public routes too if tenant is disabled)
    const tenant = await this.tenantRepo.findOneBy({ slug: headerSlug, isActive: true });
    if (!tenant) throw new ForbiddenException('Tenant not found or inactive');

    req['tenant'] = tenant;
    return true;
  }
  // ...
}
```

---

### 3. Login does not verify the tenant is active

**What the plan says:** Login flow step 5 — "Confirm `tenant.isActive = true` (skip for super admins)."

**What exists:** `AuthService.login()` finds the user and checks the bcrypt hash but never queries the `tenants` table. A user belonging to a soft-disabled tenant can still obtain a valid JWT.

**Fix:** After validating credentials, look up the tenant and reject if inactive:

```typescript
async login(username: string, password: string): Promise<TokenResult> {
  const user = await this.ds.getRepository(User).findOneBy({ username, isActive: true });
  if (!user) throw new UnauthorizedException('Invalid credentials');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new UnauthorizedException('Invalid credentials');

  // skip tenant check for super admins
  if (!user.isSuperAdmin) {
    // tenantRepo must be injected from the master DataSource, not TENANT_DATASOURCE
    const tenant = await this.tenantRepo.findOneBy({ slug: user.tenantId, isActive: true });
    if (!tenant) throw new ForbiddenException('Tenant is inactive');
  }

  return this.buildTokens(user);
}
```

Note: `tenantRepo` must come from the master `DataSource` (via `TypeOrmModule.forFeature([Tenant])` in `TenantModule`), not from `TENANT_DATASOURCE`.

---

### 4. Refresh tokens are stateless — no storage or revocation

**What the plan says:** "Refresh tokens are stored hashed in a `refresh_tokens` table with an expiry — revoke on logout by deleting the row."

**What exists:** Refresh tokens are plain JWTs verified in memory. `logout` only clears cookies. A stolen refresh token is valid for 7 days and cannot be revoked.

**What is missing:**

- `RefreshToken` entity and migration (table: `refresh_tokens` with `id`, `user_id`, `token_hash`, `expires_at`, `created_at`)
- On `login`: hash the refresh token with `bcrypt` and insert a row
- On `refreshToken`: look up the hash before issuing new tokens; delete the old row after rotation
- On `logout`: delete the row for the current refresh token

```typescript
// entities/refresh-token.entity.ts
@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'user_id' }) userId: string;
  @Column({ name: 'token_hash' }) tokenHash: string;
  @Column({ name: 'expires_at', type: 'timestamptz' }) expiresAt: Date;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
}
```

---

### 5. No database migrations exist

**What the plan says:** Section 8 describes running migrations per tenant via a CLI runner and against `master` when multitenancy is disabled. `synchronize: false` is explicitly set.

**What exists:** Zero migration files. The app relies on `synchronize: false` but there is nothing to synchronize. Additionally:

- `database/datasource.ts` line 26 exports `const dataSource = new DataSource(baseDataSourceOptions)` — `baseDataSourceOptions` has no `database` field, so the TypeORM CLI will error at connect time.
- No npm scripts: `migration:generate`, `migration:run`, `migration:revert`.

**What is missing:**

**a) Fix the default `dataSource` export** (used by TypeORM CLI):
```typescript
// database/datasource.ts — fix line 26
const dataSource = new DataSource(masterDataSourceOptions);  // was: baseDataSourceOptions
export default dataSource;
```

**b) Add npm scripts** to `package.json`:
```json
"migration:generate": "typeorm-ts-node-commonjs migration:generate -d database/datasource.ts",
"migration:run": "typeorm-ts-node-commonjs migration:run -d database/datasource.ts",
"migration:revert": "typeorm-ts-node-commonjs migration:revert -d database/datasource.ts"
```

**c) Generate and commit the initial migrations** for:
- `master` DB: `tenants` table
- Tenant DB: `users`, `roles`, `permissions`, `user_roles`, `role_permissions` tables

**d) Write the per-tenant migration runner script** (plan section 8):
```typescript
// scripts/migrate-tenants.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { baseDataSourceOptions } from '../database/datasource';
import { masterDataSourceOptions } from '../database/datasource';
import { Tenant } from '../src/tenant/tenant.entity';

const registryDs = new DataSource(masterDataSourceOptions);
await registryDs.initialize();

const tenants = await registryDs.getRepository(Tenant).findBy({ isActive: true });

for (const tenant of tenants) {
  const ds = new DataSource({
    ...baseDataSourceOptions,
    database: `tenant_${tenant.slug}`,
  } as DataSourceOptions);
  await ds.initialize();
  await ds.runMigrations();
  await ds.destroy();
  console.log(`Migrated tenant_${tenant.slug}`);
}

await registryDs.destroy();
```

---

## Medium — Missing Features Specified by Plan

### 6. `AuthPayload` GraphQL type is missing `accessToken` and `refreshToken` fields

**What the plan says:**
```graphql
type AuthPayload {
  accessToken: String!
  refreshToken: String!
  user: User!
}
```

**What exists:** `AuthPayload` only exposes `user`. Tokens are returned exclusively via HttpOnly cookies — clients cannot access them programmatically.

This is a deliberate architectural choice (cookies are more secure for browsers), but it contradicts the plan spec and means mobile or non-browser clients cannot authenticate. The plan should be updated to reflect the cookie-based approach, or the `AuthPayload` type should include the token fields for non-browser clients.

---

### 7. JWT transport differs from plan (header vs cookie)

**What the plan says:** Transport via `Authorization: Bearer <jwt>` HTTP header. The example shows:
```
POST /api/graphql
x-tenant: acme
Authorization: Bearer <jwt>
```

**What exists:** `JwtStrategy` extracts the token exclusively from the `access_token` cookie:
```typescript
jwtFromRequest: ExtractJwt.fromExtractors([
  (req: Request) => req?.cookies?.access_token ?? null,
]),
```

Any client sending `Authorization: Bearer` receives a 401. This must be explicitly documented, and if header-based auth is needed (e.g. for mobile clients or external API consumers), the extractor should fall back to `fromAuthHeaderAsBearerToken()`.

---

### 8. `baseDataSourceOptions` type is not strict

**What the plan says:** `baseDataSourceOptions: Omit<DataSourceOptions, 'database'>` — TypeScript prevents accidentally using the base options as-is without providing a database name.

**What exists:** `baseDataSourceOptions: DataSourceOptions` — TypeScript allows creating a `DataSource` from it without specifying `database`, which silently connects to Postgres with no database selected.

**Fix:**
```typescript
export const baseDataSourceOptions: Omit<DataSourceOptions, 'database'> = {
  type: 'postgres',
  // ...
};
```

---

### 9. `TENANT_DATASOURCE` provider connects to unvalidated database names

**What the plan says:** The tenant provider should only build connections for valid, active tenants.

**What exists:** When multitenancy is enabled, the provider builds `tenant_${slug}` from whatever is in `req['tenantSlug']` with no registry check. If `TenantGuard` runs first on authenticated routes (once gap #1 is fixed), this is safe. But on `@Public()` routes (login, refresh), the provider runs before any tenant validation, allowing arbitrary `tenant_${slug}` database connection attempts against any value in the `x-tenant` header.

**Fix:** Before initializing a new connection in the provider, query the master registry or rely on the guard having set `req['tenant']` before the provider runs. At minimum, add a bounds check in the provider:

```typescript
// in tenantDataSourceProvider.useFactory
if (!connectionCache.has(dbName)) {
  // confirm the slug looks sane before connecting (guard should have run, but defensive check)
  if (!/^[a-z0-9_-]+$/.test(slug)) throw new BadRequestException('Invalid tenant slug');
  // ... initialize
}
```

---

### 10. No tenant provisioning tooling

**What the plan says:** Section 9 describes the steps to provision a new tenant. When multitenancy is enabled, this requires creating the database and running migrations.

**What exists:** No tooling. Each step must be performed manually.

**What is missing:** A `scripts/provision-tenant.ts` script that:
1. Accepts a `--slug` and `--name` argument
2. Creates the `tenant_${slug}` Postgres database
3. Runs migrations against it
4. Inserts the registry row into `master.tenants`

---

### 11. No rate limiting

**What both plans say:**
- Multitenancy plan: "Rate-limit by `x-tenant` to prevent tenant enumeration."
- Auth plan: "Rate-limit the `login` mutation by IP and by username to prevent brute-force."

**What exists:** No throttling configured anywhere. `@nestjs/throttler` is not installed.

**Fix:** Install `@nestjs/throttler`, configure it globally in `AppModule`, and apply stricter limits on the `login` mutation using a custom decorator.

---

## Minor — Inconsistencies and Polish

### 12. `config.ts` and `datasource.ts` are outside `src/`

**What the plan says:**
```
src/
  config/
    config.ts
  database/
    datasource.ts
```

**What exists:** Both files live at the repo root level (`config/config.ts`, `database/datasource.ts`) rather than under `src/`. This works but diverges from the plan's directory layout and means the import path from inside `src/` is `../../config/config` rather than `../config/config`.

---

### 13. `Tenant` entity is missing `updated_at`

**What exists:** The `Tenant` entity only has `created_at`. The `users` and `roles` entities have both `created_at` and `updated_at`. While the plan's table spec doesn't include `updated_at` for tenants, omitting it is inconsistent across entities and makes auditing tenant changes harder.

**Fix:** Add `@UpdateDateColumn` to the `Tenant` entity and include it in the migration.

---

### 14. Connection cache has no eviction for deactivated tenants

**What the plan says:** When a tenant's `is_active` is set to `false`, subsequent requests are rejected by `TenantGuard`. However, the module-level `connectionCache` Map in `tenant.provider.ts` keeps the `DataSource` open indefinitely.

**What exists:** Deactivated tenants are blocked at the guard level, but the `DataSource` for a deactivated tenant remains alive and holding a Postgres connection pool, wasting resources.

**Fix:** Provide an admin operation (or a scheduled task) that calls `ds.destroy()` and removes the entry from `connectionCache` when a tenant is deactivated.

---

## Summary Table

| # | Gap | Severity | Affected file(s) |
|---|-----|----------|-----------------|
| 1 | `TenantGuard` never applied | Critical | `auth.module.ts` |
| 2 | `TenantGuard` breaks `@Public()` routes | Critical | `tenant.guard.ts` |
| 3 | Login skips `tenant.isActive` check | Critical | `auth.service.ts` |
| 4 | Refresh tokens not stored / not revocable | Critical | `auth.service.ts`, new `refresh-token.entity.ts` |
| 5 | No migrations exist; CLI `dataSource` broken | Critical | `database/datasource.ts`, `package.json`, new `migrations/` |
| 6 | `AuthPayload` missing token fields | Medium | `auth-payload.type.ts` |
| 7 | JWT transport is cookies, not `Authorization` header | Medium | `jwt.strategy.ts` |
| 8 | `baseDataSourceOptions` type not strict | Medium | `database/datasource.ts` |
| 9 | Provider connects to unvalidated DB names | Medium | `tenant.provider.ts` |
| 10 | No tenant provisioning script | Medium | new `scripts/provision-tenant.ts` |
| 11 | No rate limiting | Medium | `app.module.ts`, `auth.resolver.ts` |
| 12 | `config/` and `database/` outside `src/` | Minor | directory layout |
| 13 | `Tenant` entity missing `updated_at` | Minor | `tenant.entity.ts` |
| 14 | Connection cache never evicts deactivated tenants | Minor | `tenant.provider.ts` |
