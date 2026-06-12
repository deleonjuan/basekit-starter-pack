# Routing Plan

**Stack:** TanStack Start + TanStack Router (file-based) · React 19 · Apollo Client

---

## Route Zones

The app has three distinct access zones. Each zone maps to a **pathless layout route** (`_name.tsx`) that wraps its children without adding a URL segment. The layout route's `beforeLoad` enforces the access rule for everything nested beneath it.

| Zone | Pathless layout | Rule |
|------|----------------|------|
| Public | _(none — bare routes)_ | No check |
| User-private | `_authenticated.tsx` | Redirect → `/login` if not signed in |
| Admin-private | `_admin.tsx` | Redirect → `/login` if not admin role |

---

## Directory Tree

```
src/routes/
│
├── __root.tsx                         # Shell (html/head/body), global providers,
│                                      # router context type (includes auth)
│
│ ── PUBLIC ─────────────────────────────────────────────────────────────────
│
├── index.tsx                          # /            Landing / home
│
├── store/
│   ├── index.tsx                      # /store       Product listing
│   ├── $productSlug.tsx               # /store/:productSlug   Product detail
│   └── category/
│       └── $categorySlug.tsx          # /store/category/:categorySlug
│
├── about.tsx                          # /about
├── contact.tsx                        # /contact
│
│ ── AUTH PAGES ─────────────────────────────────────────────────────────────
│   (no path prefix — these are just regular routes)
│   (redirect to /account if already authenticated)
│
├── login.tsx                          # /login
├── register.tsx                       # /register
├── forgot-password.tsx                # /forgot-password
├── reset-password.tsx                 # /reset-password
│
│ ── USER-PRIVATE ────────────────────────────────────────────────────────────
│   Wrapped by _authenticated.tsx — redirects to /login if not signed in.
│   Shares a common account shell layout (sidebar nav).
│
├── _authenticated.tsx                 # Pathless guard + account layout
└── _authenticated/
    └── account/
        ├── index.tsx                  # /account             Overview / dashboard
        ├── orders/
        │   ├── index.tsx              # /account/orders      Order history list
        │   └── $orderId.tsx           # /account/orders/:orderId   Order detail
        ├── profile.tsx                # /account/profile     Personal info & password
        ├── addresses.tsx              # /account/addresses   Saved addresses
        └── wishlist.tsx              # /account/wishlist

│ ── ADMIN-PRIVATE ───────────────────────────────────────────────────────────
│   Wrapped by _admin.tsx — redirects to /login if not admin.
│   Shares a dedicated admin shell layout (sidebar + header).
│
├── _admin.tsx                         # Pathless guard + admin shell layout
└── _admin/
    └── admin/
        ├── index.tsx                  # /admin               Dashboard / KPI overview
        ├── products/
        │   ├── index.tsx              # /admin/products      Product list
        │   ├── new.tsx                # /admin/products/new  Create product
        │   └── $productId.tsx         # /admin/products/:productId   Edit product
        ├── orders/
        │   ├── index.tsx              # /admin/orders        Orders list
        │   └── $orderId.tsx           # /admin/orders/:orderId   Order detail
        ├── customers/
        │   ├── index.tsx              # /admin/customers     Customer list
        │   └── $customerId.tsx        # /admin/customers/:customerId
        ├── categories/
        │   ├── index.tsx              # /admin/categories
        │   └── $categoryId.tsx        # /admin/categories/:categoryId
        └── settings/
            └── index.tsx              # /admin/settings      Site-wide config
```

---

## Router Context

`__root.tsx` receives an extended `RouterContext` that includes auth state. Every route can read it from `context` inside `beforeLoad` or `loader`.

```ts
// Extend in __root.tsx
interface RouterContext extends ApolloClientIntegration.RouterContext {
  auth: {
    isAuthenticated: boolean
    user: { id: string; role: 'user' | 'admin' } | null
  }
}
```

The context is populated at the router level in the app entry point (SSR-safe via a server function or session cookie check).

---

## Auth Guard Pattern

Both `_authenticated.tsx` and `_admin.tsx` use `beforeLoad` to enforce access. Failed checks throw a `redirect` so TanStack Router handles it cleanly without a render flash.

```ts
// _authenticated.tsx — sketch (no implementation yet)
beforeLoad: ({ context, location }) => {
  if (!context.auth.isAuthenticated) {
    throw redirect({ to: '/login', search: { redirect: location.href } })
  }
}

// _admin.tsx — sketch
beforeLoad: ({ context, location }) => {
  if (!context.auth.isAuthenticated) {
    throw redirect({ to: '/login', search: { redirect: location.href } })
  }
  if (context.auth.user?.role !== 'admin') {
    throw redirect({ to: '/account' })
  }
}
```

Auth pages (`/login`, `/register`) should also redirect away if the user is already signed in — handled with the same `beforeLoad` pattern, redirecting to `/account`.

---

## Layouts

Three distinct shell layouts are needed. They live as components inside the pathless layout routes so they apply to every nested route automatically.

| Layout | Host file | Applies to |
|--------|-----------|------------|
| **Public** | `__root.tsx` (default outlet) | Landing, store, static pages |
| **Account** | `_authenticated.tsx` | `/account/**` |
| **Admin** | `_admin.tsx` | `/admin/**` |

The public layout renders a global nav and footer around `<Outlet />`. The account and admin layouts render their own side-nav shells.

---

## Lazy Loading

Routes with heavy UI (admin data tables, product configurators) should use TanStack Router's `.lazy.tsx` split-file convention:

```
admin/products/index.tsx        # Route definition (tiny, loads instantly)
admin/products/index.lazy.tsx   # Component (code-split, loads on demand)
```

All `/admin/**` routes and `/store/**` detail routes are candidates for lazy loading.

---

## Search Params

| Route | Notable search params |
|-------|-----------------------|
| `/login` | `redirect` — the URL to return to after sign-in |
| `/store` | `q`, `category`, `sort`, `page` |
| `/admin/products` | `q`, `status`, `sort`, `page` |
| `/admin/orders` | `status`, `from`, `to`, `page` |
| `/admin/customers` | `q`, `page` |

Search params should be **type-validated** with Zod schemas on the route's `validateSearch` option — a built-in TanStack Router feature.

---

## 404 / Error Handling

- A `notFoundComponent` on `__root.tsx` catches all unmatched paths with a branded 404 page.
- An `errorComponent` on `__root.tsx` is the last-resort boundary for unexpected errors.
- Individual route segments (e.g. `$productSlug`, `$orderId`) define their own `notFoundComponent` for "product not found" / "order not found" cases so the error is scoped and the shell stays rendered.
