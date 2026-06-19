# basekit-be

NestJS GraphQL API for BaseKit Starter Pack. Provides authentication, users, roles, permissions, settings, and multi-tenancy.

---

## Tech Stack

- **NestJS** — framework
- **Apollo Server** — GraphQL via `@nestjs/graphql`
- **TypeORM** — ORM with PostgreSQL
- **Passport / JWT** — authentication (access token + refresh token, HTTP-only cookies)

---

## Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL 14+

---

## Local Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Create a `.env` file at the root of `basekit-be/`:

```env
# Server
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=basekit

# JWT
JWT_SECRET=change_me_access
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=change_me_refresh
JWT_REFRESH_EXPIRES_IN=7d

# Multi-tenancy (set to false to disable)
MULTITENANCY_ENABLED=false
```

### 3. Create the database

```bash
createdb basekit
```

### 4. Run migrations

```bash
pnpm run migration:run
```

### 5. Create initial tenant and admin user

```bash
# Create a tenant (required when MULTITENANCY_ENABLED=true)
pnpm run tenant:create

# Create the first admin user
pnpm run user:create
```

### 6. Start the development server

```bash
pnpm run start:dev
```

The API is available at [http://localhost:3001/api/graphql](http://localhost:3001/api/graphql).  
The GraphiQL playground is served at the same URL.

---

## Scripts

| Command | Description |
|---|---|
| `pnpm run start:dev` | Start in watch mode (development) |
| `pnpm run start:prod` | Start compiled build (production) |
| `pnpm run build` | Compile to `dist/` |
| `pnpm run migration:run` | Apply pending migrations |
| `pnpm run migration:revert` | Revert last migration |
| `pnpm run migration:generate` | Generate a migration from entity changes |
| `pnpm run migration:create` | Create an empty migration file |
| `pnpm run migration:show` | List applied/pending migrations |
| `pnpm run tenant:create` | Interactive script to create a tenant |
| `pnpm run user:create` | Interactive script to create a user |
| `pnpm run test` | Run unit tests |
| `pnpm run test:e2e` | Run end-to-end tests |
| `pnpm run lint` | Lint and auto-fix |

---

## Project Structure

```
src/
├── auth/           # JWT strategy, guards, decorators, refresh tokens
├── user/           # User entity, resolver, service
├── role/           # Role & Permission entities, resolver, service
├── settings/       # Global & personal settings (registry-driven)
├── tenant/         # Multi-tenancy middleware, datasource provider
└── common/         # Shared DTOs, utilities, scalars
database/
├── datasource.ts   # TypeORM DataSource config
└── migrations/     # All migration files
config/
└── config.ts       # Environment-based configuration
```

---

## API

The GraphQL schema is auto-generated at `src/schema.gql` on startup.  
All resolvers are protected by `JwtAuthGuard` by default. Public endpoints are decorated with `@Public()`.
