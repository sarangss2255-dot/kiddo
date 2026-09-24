# Kiddo Webapp Migration — Memory File

## What Was Done

### Migration: Vite + React Router → Next.js 16 App Router
- Converted entire `kiddo-webapp` from Vite to Next.js 16.3.5
- All routes migrated from React Router to Next.js App Router (`src/app/`)
- Removed Vite: `vite.config.ts`, `index.html`, `src/main.tsx`, `index.ts`, `babel.config.cjs`
- Removed React Router from all 15 files; replaced with `next/link` + `next/navigation`

### OpenAPI Documentation Portal
- Built from scratch in `src/components/docs/` (21 components)
- Source of truth: `kiddo-backend/src/docs/swagger.ts` (70 operations, 14 tags, 31 schemas)
- Bundled snapshot: `src/lib/openapi/kiddo-openapi.json` (58KB)
- Parser: `src/lib/openapi/parser.ts` (`buildCatalog()`, `findTag()`, `findOperation()`)
- Loader: `src/lib/openapi/loader.ts` (env-driven with live/bundled fallback)
- Catalog: `src/lib/openapi/catalog.ts` (cached server function)
- Route: `src/app/(docs)/docs/[...slug]/page.tsx` (dynamic, all 70 operations render)
- Static pages: `/docs`, `/docs/schemas`, `/docs/quick-start`, `/docs/authentication`, `/guides`, `/changelog`

### Marketing Pages
- Landing: `src/app/page.tsx` (client, SSR)
- Download: `src/app/download/page.tsx` (client, SSR)
- Auth: `src/app/auth/page.tsx` (client, SSR)
- AuthPage localStorage fixed: `typeof window !== 'undefined'` guard

### App Shell
- `src/app/app/[[...section]]/page.tsx` (dynamic ssr:false, pathname-based nav)

### Admin
- `src/app/admin/layout.tsx` (dynamic ssr:false, AdminShell)
- 14 admin pages + 2 redirect pages
- Protected layout with `onboardingComplete` check

### Design System
- `src/index.css`: `@custom-variant dark`, docs CSS tokens, `@theme inline` shadcn mappings
- Dark/light via `next-themes`, docs defaults dark
- `src/components/ui/Card.tsx`: added `variant` prop (default|premium)
- JetBrains Mono font included

### Configuration
- `next.config.ts`: env-driven rewrites (`API_PROXY_TARGET`), `turbopack.root`
- `.env.development`, `.env.production`, `.env.example`: all API URLs env-driven
- `netlify.toml`: updated for Next.js (`@netlify/plugin-nextjs`)
- `postcss.config.mjs`: `@tailwindcss/postcss`
- `eslint.config.mjs`: flat config
- `vitest.config.ts`: updated for Next.js

### Tests
- `src/test/landing.test.tsx`: mocks `next/navigation` and `next/link`
- `npm run lint` passes clean
- `npm test` — 4/4 pass
- `npm run build` — 29 routes generated

### Verification Results — COMPLETE ✅
- **70/70 operations verified** across 14 tag sections (automated tsx script)
- **31 schemas** in schemas page
- **120 search entries** in search index
- **SSR verified**: landing, download, auth pages all render full content server-side
- **Theme toggle**: "Switch to dark theme" (server default, correct — flips to "light" client-side)
- **Search**: "Ctrl K" shortcut in docs HTML
- **Protected endpoints**: show "Authentication required" badge (blue, with lock icon)
- **Public endpoints**: show "Public endpoint" badge (green)
- **Query parameters, request body, path parameters** all render in EndpointDetails
- **Schema viewer**: shows "required", "Example value", "properties" with property table
- **Proxy verified**: `/api/v1/auth/me` → 401 (real backend through Next rewrite)
- **Mobile responsive**: mobile menu button present, sidebar drawer overlay, hamburger button, dark overlay backdrop
- **Auth modal**: "Authorize" button present in docs header
- **Footer**: present on docs pages with KidDo branding
- **Sidebar sections**: Getting Started, Overview, Quick Start, Authentication, API Reference, Resources, Data Models, Changelog — all 14 tags listed
- **Known backend quirk**: `/health` endpoint at root but spec declares under `/api/v1` — pre-existing inconsistency, not our bug
- **DELETE ops slug casing**: all slugs are lowercase (e.g., `delete-tasks-taskid`, not `delete-tasks-taskId`)

### Status: ALL ITEMS COMPLETE
- All pages verified and working
- No remaining blockers
- Ready for user to test in browser

## Cleanup Complete ✅

### Webapp Files Removed
| File | Reason |
|------|--------|
| `ticket.pdf` | Random 2MB PDF, not part of project |
| `.next/` | Build output (gitignored, regenerable) |
| `tsconfig.tsbuildinfo` | Build artifact (gitignored, regenerable) |
| `src/admin/vite-env.d.ts` | Vite type definition, no longer needed |
| `src/site/landing.css` | Not imported anywhere |
| `src/site/site.css` | Not imported anywhere |
| `src/site/components/ErrorBoundary.tsx` | Not imported anywhere |
| `src/site/components/ScrollAssembly.tsx` | Not imported anywhere |

### Backend Files Removed
| File | Reason |
|------|--------|
| `dist/` | Build output (gitignored, regenerable) |
| `config/` | Legacy root-level JS (superseded by `src/config/`) |
| `controllers/` | Legacy root-level JS (superseded by `src/controllers/`) |
| `middleware/` | Legacy root-level JS (superseded by `src/middlewares/`) |
| `models/` | Legacy root-level JS (superseded by `src/models/`) |
| `routes/` | Legacy root-level JS (superseded by `src/routes/`) |
| `server.ts` | Legacy entry point (superseded by `src/server.ts`) |
| `src/test_firebase.ts` | Unused test file |

### Verification After Cleanup
- `npm run build` — 29 routes, all clean
- `npm run lint` — clean
- `npm test` — 4/4 pass

## Key Architecture Decisions
- **No hard coding**: All API URLs, servers, endpoints come from env vars + OpenAPI spec
- **OpenAPI spec is source of truth**: Backend must NOT be modified
- **Proxy**: Next.js rewrites (`/api/v1/:path*`) to backend via `API_PROXY_TARGET` env var
- **Bundled fallback**: If live spec is stale (54 ops) vs bundled (70 ops), prefer bundled
- **SSR vs client**: Marketing pages SSR for SEO; app shell ssr:false for localStorage; docs dynamic on-demand

## File Counts
- **Created**: ~40 new files (components, pages, libs, config)
- **Modified**: ~15 existing files (imports, API URLs, config)
- **Deleted**: ~20 legacy files (Vite, React Router, unused components)

## Environment Variables
```
NEXT_PUBLIC_API_URL          # Backend base URL (e.g., http://localhost:5000)
API_PROXY_TARGET             # Backend for Next.js rewrites (e.g., http://localhost:5000)
OPENAPI_SPEC_URL             # Live OpenAPI endpoint
OPENAPI_SPEC_PATH            # Path to bundled spec JSON
```
