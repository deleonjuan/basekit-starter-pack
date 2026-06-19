# basekit-fe

TanStack Start (React SSR) frontend for BaseKit Starter Pack. Admin UI with authentication, users, roles, settings, theming, and i18n.

---

## Tech Stack

- **TanStack Start** — React SSR framework
- **TanStack Router** — file-based routing with type-safe search params
- **Apollo Client** — GraphQL data fetching
- **Tailwind CSS** — utility-first styling
- **Zustand** — global state (settings, theme, language)
- **i18next / react-i18next** — internationalisation
- **Radix UI / Base UI** — headless component primitives

---

## Prerequisites

- Node.js 20+
- pnpm
- `basekit-be` running locally on port 3001

---

## Local Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

The repository includes a `.env` with defaults that work against a local backend:

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_TENANT_SLUG=default
```

### 3. Start the development server

```bash
pnpm dev
```

The app is available at [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server (port 3000) |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm generate-routes` | Regenerate TanStack Router route tree |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm lint` | Lint and auto-fix |
| `pnpm format` | Format with Prettier |

---

## Project Structure

```
src/
├── routes/             # File-based routes (TanStack Router)
│   ├── __root.tsx      # Root layout, theme provider, i18n init
│   ├── _admin.tsx      # Authenticated layout with sidebar
│   └── _admin/admin/   # Protected admin pages
├── modules/            # Feature modules
│   ├── auth/           # Login, logout, AuthGuard, refresh token logic
│   ├── dashboard/      # Dashboard page
│   ├── users/          # Users list, detail, create
│   ├── roles/          # Roles list, detail, permissions table
│   └── settings/       # Theme & language settings
├── components/
│   ├── common/         # Shared components (DataTable, AppDialog, Image, …)
│   └── screens/        # Full-page screens (NotFoundScreen, ErrorScreen)
├── lib/
│   ├── universal-layout/ # AppPage, Sidebar, LayoutWrapper, ThemeProvider
│   ├── form-generator/   # Declarative form builder
│   └── i18n/             # i18next setup, glob-based translation loader
└── store/
    └── settings.store.ts # Zustand store (theme, language, applySettings)
```

---

## Adding Translations

Drop a `language.json` file anywhere inside `src/modules/<name>/`, `src/components/`, or `src/lib/`. It is auto-discovered at build time — no registration needed.

```json
{
  "es": { "myModule": { "title": "Mi módulo" } },
  "en": { "myModule": { "title": "My module" } }
}
```

---

## Theme

Theme preference (`light` / `dark` / `system`) is stored in Zustand (persisted to `localStorage`) and synced with the backend personal settings API on change. The `ThemeProvider` resolves `system` against `prefers-color-scheme` and applies the result as a class on `<html>`.
