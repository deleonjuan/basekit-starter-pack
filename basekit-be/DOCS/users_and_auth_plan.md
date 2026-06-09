# Users & Auth Plan

## Overview

Two user types exist in the system:

- **App users** — scoped to a tenant, live in the tenant database (or master when multitenancy is disabled). They carry a `tenant_id` and authenticate against their tenant's data.
- **Super admins** — not scoped to any tenant, live in the master database with `tenant_id = null` and `is_super_admin = true`. They can perform any operation across all tenants with no restrictions.

Authentication is JWT-based. Every token embeds the tenant slug and the `isSuperAdmin` flag. **Roles are not included in the JWT** — when a permission check is needed, the guard loads the user's effective permissions from the DB at request time via their assigned roles. Super admins bypass all permission checks — if `isSuperAdmin = true` the request is allowed regardless of what decorators are on the resolver/controller.

Every operation falls into exactly one of three access levels:

1. **Public** — no token required (`@Public()`)
2. **Authenticated** — valid JWT required, no further checks (default)
3. **Permission-gated** — valid JWT + user must hold all listed permissions (`@RequirePermissions(...)`)
4. **Super admin only** — valid JWT + `isSuperAdmin = true` (`@SuperAdminOnly()`)

---

## 1. Database Tables

### Master Database

#### Table: `users` (super admins only when multitenancy is enabled)

| Column         | Type        | Notes                                    |
|----------------|-------------|------------------------------------------|
| id             | uuid PK     | `gen_random_uuid()`                      |
| username       | varchar     | Unique                                   |
| password       | varchar     | bcrypt hashed                            |
| tenant_id      | uuid FK     | `null` for super admins                  |
| is_super_admin | boolean     | Default `false`                          |
| is_active      | boolean     | Default `true`                           |
| created_at     | timestamptz | Default `NOW()`                          |
| updated_at     | timestamptz | Auto-updated on change                   |

### Tenant Database (per-tenant, or master when multitenancy is disabled)

#### Table: `users`

Same columns as above. `tenant_id` is set to the owning tenant's id. `is_super_admin` is always `false` for rows in tenant databases.

#### Table: `roles`

| Column      | Type        | Notes                  |
|-------------|-------------|------------------------|
| id          | uuid PK     |                        |
| name        | varchar     | Unique within tenant   |
| description | varchar     | Optional               |
| is_active   | boolean     | Default `true`         |
| created_at  | timestamptz |                        |
| updated_at  | timestamptz |                        |

#### Table: `permissions`

| Column      | Type        | Notes                                                              |
|-------------|-------------|--------------------------------------------------------------------|
| id          | uuid PK     |                                                                    |
| value       | varchar     | Unique. Format: `action:resource` (e.g. `create:user`)            |
| description | varchar     | Optional. Human-readable label for the permission                 |
| is_active   | boolean     | Default `true`                                                     |
| created_at  | timestamptz |                                                                    |
| updated_at  | timestamptz |                                                                    |

Unique constraint on `value`.

#### Table: `user_roles` (junction)

| Column  | Type    | Notes                |
|---------|---------|----------------------|
| user_id | uuid FK | References `users`   |
| role_id | uuid FK | References `roles`   |

Primary key on `(user_id, role_id)`.

#### Table: `role_permissions` (junction)

| Column        | Type    | Notes                    |
|---------------|---------|--------------------------|
| role_id       | uuid FK | References `roles`       |
| permission_id | uuid FK | References `permissions` |

Primary key on `(role_id, permission_id)`.

---

## 2. JWT Token Design

Tokens are signed by the `AuthService`. The payload is intentionally minimal — roles and permissions are **not** embedded.

```typescript
// Payload shape
{
  sub: user.id,               // user uuid
  username: user.username,
  tenantId: tenant.slug,      // matches x-tenant header; null for super admins
  isSuperAdmin: boolean,
}
```

- Access token TTL: **15 minutes**
- Refresh token TTL: **7 days** (stored hashed in a `refresh_tokens` table)
- The `tenantId` claim is validated against the `x-tenant` header on every request (existing `TenantGuard` logic from multitenancy plan).
- Super admin tokens have `tenantId: null` — they are not bound to any tenant, and `TenantGuard` skips the claim check when `isSuperAdmin = true`.

---

## 3. Module Structure

```
src/
  auth/
    auth.module.ts
    auth.service.ts              # login, token generation, refresh, logout
    auth.resolver.ts             # GraphQL: login, refreshToken, logout mutations
    jwt.strategy.ts              # Passport JWT strategy — validates Bearer token
    guards/
      jwt-auth.guard.ts          # global guard — validates JWT on every request
      permissions.guard.ts       # loads user permissions from DB, checks @RequirePermissions
    decorators/
      public.decorator.ts        # @Public() — skips jwt-auth.guard
      super-admin.decorator.ts   # @SuperAdminOnly() — isSuperAdmin = true required
      permissions.decorator.ts   # @RequirePermissions(...) — sets required perms metadata
      current-user.decorator.ts  # @CurrentUser() param decorator
  user/
    user.module.ts
    user.service.ts              # CRUD + password hashing
    user.resolver.ts             # GraphQL: users, user, createUser, updateUser, deleteUser
    entities/
      user.entity.ts
    dto/
      create-user.input.ts
      update-user.input.ts
  role/
    role.module.ts
    role.service.ts              # CRUD for roles, assign/revoke permissions
    role.resolver.ts             # GraphQL: roles, createRole, assignPermission, etc.
    entities/
      role.entity.ts
      permission.entity.ts
```

---

## 4. Entities

### `User`

```typescript
@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Column()               // never exposed via @Field
  password: string;

  @Field(() => ID, { nullable: true })
  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  tenantId: string | null;

  @Field()
  @Column({ name: 'is_super_admin', default: false })
  isSuperAdmin: boolean;

  @Field()
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Field(() => [Role])
  @ManyToMany(() => Role, { eager: false })
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
```

### `Role`

```typescript
@ObjectType()
@Entity('roles')
export class Role {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field()
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Field(() => [Permission])
  @ManyToMany(() => Permission, { eager: true })
  @JoinTable({ name: 'role_permissions' })
  permissions: Permission[];

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
```

### `Permission`

```typescript
@ObjectType()
@Entity('permissions')
export class Permission {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  value: string;      // format: action:resource — e.g. 'create:user'

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field()
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Field()
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
```

---

## 5. Guards & Decorators

### 5a. JwtAuthGuard (global)

Applied globally in `AppModule`. All resolvers/controllers are protected by default. Use `@Public()` to opt out.

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(ctx: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(ctx);
  }
  // Override getRequest to support GraphQL context
}
```

### 5b. PermissionsGuard

Runs after `JwtAuthGuard`. Activated only when `@RequirePermissions()` or `@SuperAdminOnly()` is present on the handler. When a permission check is required, it loads the user's roles and their permissions from the DB for that request — permissions are **not** stored in the JWT.

```typescript
@Injectable()
export class PermissionsGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const user = getRequestFromContext(ctx).user;  // populated by JwtAuthGuard

    // super admins pass unconditionally
    if (user.isSuperAdmin) return true;

    const requiresSuperAdmin = this.reflector.get<boolean>(SUPER_ADMIN_KEY, ctx.getHandler());
    if (requiresSuperAdmin) throw new ForbiddenException();

    const required = this.reflector.get<string[]>(PERMISSIONS_KEY, ctx.getHandler());
    if (!required?.length) return true;  // authenticated-only route, no permission check needed

    // load permissions from DB: user → roles → permissions
    const userWithRoles = await this.userService.findWithPermissions(user.sub);
    const effective = userWithRoles.roles
      .flatMap(r => r.permissions)
      .map(p => p.value);

    const hasAll = required.every(p => effective.includes(p));
    if (!hasAll) throw new ForbiddenException();

    return true;
  }
}
```

### 5c. Decorator summary

| Decorator                              | Effect                                                      |
|----------------------------------------|-------------------------------------------------------------|
| `@Public()`                            | Skips `JwtAuthGuard` — no token required                    |
| `@SuperAdminOnly()`                    | Requires `isSuperAdmin = true`; rejects all other users     |
| `@RequirePermissions('create:user', ...)` | Loads user permissions from DB; user must hold all listed   |
| `@CurrentUser()`                       | Param decorator — injects the authenticated user from JWT   |

There is no `@RequireRoles()` decorator. Role assignment is the mechanism for granting permissions; guards always check permissions directly.

---

## 6. Auth Module

### GraphQL operations

```graphql
type Mutation {
  login(username: String!, password: String!): AuthPayload!
  refreshToken(token: String!): AuthPayload!
  logout: Boolean!
}

type AuthPayload {
  accessToken: String!
  refreshToken: String!
  user: User!
}
```

### Login flow

```
1. Receive username + password (+ x-tenant header from middleware)
2. Look up user by username in the resolved DB (tenant or master)
3. Verify bcrypt hash
4. Confirm user.isActive = true
5. Confirm tenant.isActive = true (skip for super admins)
6. Sign JWT with { sub, username, tenantId, isSuperAdmin }
7. Return accessToken + refreshToken
```

---

## 7. User Module — GraphQL Operations

```graphql
type Query {
  users: [User!]!               # @RequirePermissions('read:user')
  user(id: ID!): User           # authenticated; service enforces own-or-permitted
  me: User!                     # authenticated only
}

type Mutation {
  createUser(input: CreateUserInput!): User!       # @RequirePermissions('create:user')
  updateUser(id: ID!, input: UpdateUserInput!): User! # @RequirePermissions('update:user')
  deleteUser(id: ID!): Boolean!                    # @RequirePermissions('delete:user')
  assignRole(userId: ID!, roleId: ID!): User!      # @RequirePermissions('update:user')
  revokeRole(userId: ID!, roleId: ID!): User!      # @RequirePermissions('update:user')
}
```

---

## 8. Access Control Matrix

| Operation            | Public | Authenticated | Required permissions       | Super admin  |
|----------------------|--------|---------------|----------------------------|--------------|
| `login`              | yes    | —             | —                          | —            |
| `refreshToken`       | yes    | —             | —                          | —            |
| `me`                 | no     | yes           | —                          | yes          |
| `user(id)`           | no     | yes           | —  (service enforces own)  | yes          |
| `users`              | no     | yes           | `read:user`                | yes          |
| `createUser`         | no     | yes           | `create:user`              | yes          |
| `updateUser`         | no     | yes           | `update:user`              | yes          |
| `deleteUser`         | no     | yes           | `delete:user`              | yes          |
| `tenants`            | no     | yes           | —                          | yes          |
| `createTenant`       | no     | no            | —                          | required     |
| `roles`              | no     | yes           | `read:role`                | yes          |
| `createRole`         | no     | yes           | `create:role`              | yes          |
| `assignPermission`   | no     | yes           | `update:role`              | yes          |

---

## 9. Security Considerations

- Passwords are hashed with bcrypt (cost factor ≥ 12). Never stored or returned in plaintext.
- JWT secret is separate from DB credentials and must be rotated independently.
- Refresh tokens are stored hashed in a `refresh_tokens` table with an expiry — revoke on logout by deleting the row.
- The `TenantGuard` (from multitenancy plan) validates `x-tenant` vs JWT `tenantId` on every authenticated request. Super admins with `tenantId: null` are explicitly exempted from this check.
- Rate-limit the `login` mutation by IP and by username to prevent brute-force.
- `password` field must never be annotated with `@Field()` on the entity.
- Permissions are loaded from the DB on each guarded request — consider a short-lived in-memory cache (keyed by `userId`, TTL ~30s) if this becomes a latency concern.
