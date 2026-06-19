# BaseKit Starter Pack

A full-stack admin starter pack built with **NestJS** (GraphQL API) and **TanStack Start** (React SSR). Ships with authentication, role-based access control, multi-tenancy, settings management, and i18n out of the box.

---

## Stack

| Layer | Technology |
|---|---|
| Backend API | NestJS · GraphQL (Apollo) · TypeORM · PostgreSQL |
| Frontend | TanStack Start · React · Apollo Client · Tailwind CSS |
| Auth | JWT (access + refresh tokens, HTTP-only cookies) |
| i18n | i18next · react-i18next |
| State | Zustand |

---

## Repository Structure

```
basekit-starter-pack/
├── basekit-be/     # NestJS GraphQL API
└── basekit-fe/     # TanStack Start React app
```

See each sub-project's README for local setup instructions:

- [`basekit-be/README.md`](./basekit-be/README.md) — API setup, env vars, migrations
- [`basekit-fe/README.md`](./basekit-fe/README.md) — Frontend setup, env vars, dev server

---

## Features

- **Authentication** — Login, logout, JWT refresh tokens, session persistence
- **Users** — Create, activate/deactivate, username updates
- **Roles & Permissions** — Create roles, assign granular permissions, assign roles to users
- **Settings** — Registry-driven global and personal settings (theme, language)
- **i18n** — Spanish/English, per-module `language.json` files, Zustand-synced
- **Theme** — Light / Dark / System via `ThemeProvider` + Zustand store
- **Multi-tenancy** — Tenant isolation at the data layer

---

## Quick Start

```bash
# 1 – start the API
cd basekit-be && pnpm install && pnpm run start:dev

# 2 – start the frontend (new terminal)
cd basekit-fe && pnpm install && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).
