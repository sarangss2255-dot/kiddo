# KidDo Web App — Vite → Next.js 16 Migration Plan

Status: approved and in progress.

## 1. Current state (audited before changes)

| Area | Current implementation |
| --- | --- |
| Framework | Vite 6 + React 19.2 SPA (`index.html` + `src/main.tsx`) |
| Package manager | npm (`.npmrc` → `legacy-peer-deps=true`) |
| Routing | `react-router-dom` v7 (`BrowserRouter` in `src/App.tsx`) |
| Marketing site | `src/site/SiteApp.tsx` — `/`, `/download`, `/auth`, `/app/*` |
| Admin panel | `src/admin/App.tsx` — `/admin/login`, `/admin/*` |
| App dashboards | `src/site/pages/app/KiddoApp.tsx` (internal `Routes`) |
| Swagger/OpenAPI | Served by the **backend** at `/api-docs` (swagger-ui-express + `kiddo-portal.css/js`). Raw spec at `GET /api-docs.json`. |
| OpenAPI source of truth | `kiddo-backend/src/docs/swagger.ts` — OpenAPI 3.0, 62 paths / 70 operations, 14 tags, 31 schemas, bearer JWT |
| Backend API | `https://dev.kiddoapp.in/api/v1` (dev), `https://kiddo-backend-950978285173.asia-south1.run.app/api/v1` (prod). Vite dev proxy forwarded `/api` → `dev.kiddoapp.in`. |
| App auth | Firebase Auth → `POST /auth/firebase` → backend JWT in `localStorage` (`kiddo_token`) |
| Admin auth | Firebase email/password or Google → backend JWT, admin role check (`kiddo_admin_token`) |
| UI kit | Local shadcn-style components in `src/components/ui` (Radix + CVA + Tailwind 4) |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite`, KidDo tokens in `src/index.css` |
| Env vars | `VITE_API_URL` (`.env.production`), `GEMINI_API_KEY` (Vite define) |
| Build/deploy | `vite build` → `dist/`, Netlify (`netlify.toml`), `_redirects` SPA fallback |
| Tests | Vitest + Testing Library (`src/test/landing.test.tsx`) |

## 2. Target architecture

Next.js 16 (App Router) at the repository root, TypeScript, Tailwind CSS 4,
shadcn/ui primitives, Lucide React, next-themes. The backend, MongoDB, API
routes, OpenAPI specification and auth endpoints are **not** modified.

### Route map

| Current (react-router) | Next.js (App Router) |
| --- | --- |
| `/` | `src/app/page.tsx` → `PublicLandingPage` |
| `/download` | `src/app/download/page.tsx` → `DownloadPage` |
| `/auth` | `src/app/auth/page.tsx` → `AuthPage` |
| `/app/*` | `src/app/app/[[...section]]/page.tsx` → `KiddoApp` |
| `/admin/login` | `src/app/admin/login/page.tsx` |
| `/admin/dashboard` … | `src/app/admin/(dashboard)/<page>/page.tsx` |
| — | `src/app/docs/page.tsx` → API overview |
| — | `src/app/docs/[...slug]/page.tsx` → tag sections + endpoints |
| — | `src/app/guides/page.tsx`, `src/app/changelog/page.tsx` |

### Migration strategy per area

1. **Shell** — `src/app/layout.tsx` (metadata, fonts, `Providers` with
   `next-themes`), `src/globals.css` reused from `src/index.css`.
2. **Marketing site / app dashboards / admin** — ported with the existing page
   components intact. Pages render inside `"use client"` route files and
   `next/dynamic` with `ssr: false` where browser storage is read during render.
3. **Router usage** — replace the 15 `react-router-dom` imports with `next/link`
   and `next/navigation`. `KiddoApp` route-switch becomes pathname-based.
4. **OpenAPI layer** — `src/lib/openapi/` loads the spec at runtime from
   `NEXT_PUBLIC_OPENAPI_URL` (defaults to the backend `/api-docs.json`) with an
   ISR revalidate window, falling back to the bundled canonical snapshot
   `src/lib/openapi/kiddo-openapi.json` generated from
   `kiddo-backend/src/docs/swagger.ts`.
5. **Docs portal** — new custom UI (no Swagger UI). Components listed in
   `src/components/docs/`, all data derived from the parsed spec.
6. **Try it out** — browser `fetch` to the selected `servers[]` base URL with
   bearer token from secure storage; in development the same-origin
   `/api/v1/*` Next rewrite proxies to the backend to avoid CORS.
7. **Env** — `VITE_API_URL` → `NEXT_PUBLIC_API_URL` (value preserved),
   plus `NEXT_PUBLIC_OPENAPI_URL` and `API_PROXY_TARGET`.

### Removed (legacy, verified unused or superseded)

- `vite.config.ts`, `index.html`, `src/main.tsx`, `index.ts`, `babel.config.cjs`,
  `.expo/`
- `react-router-dom` usage across 15 files
- Legacy unused `src/pages/*`, `src/components/{Header,Hero,FeatureGrid,Footer}.tsx`,
  `src/theme/landingPageStyles.ts`, `src/shims/react-is.ts`
- Vite-specific Tailwind plugin (replaced by `@tailwindcss/postcss`)

Vitest is retained as the test runner only; Vite is no longer the app bundler.

### Guarantees

- Backend routes, MongoDB models, authentication logic and the OpenAPI spec are
  untouched.
- Existing UI components and visual language are preserved.
- Existing API calls (`/api/v1/...`) keep working through the same env var and
  a dev/prod rewrite.
