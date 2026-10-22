# Deployment

The webapp is deployed on **Vercel** using the repository's native Git integration.
Netlify configuration and the Netlify GitHub Actions workflow have been removed.

## Vercel project setup

1. Import `kiddoappindia-app/kiddo-webapp` (or the `sarangss2255-dot/kiddo` mirror) into Vercel.
2. Use the repository root as the project root.
3. Vercel detects the framework from `vercel.json`:
   - Framework: **Next.js**
   - Install command: `npm ci`
   - Build command: `npm run build`
   - Node.js: **22.x**
4. Set the production branch to `main`.

## Environment variables

Add these in **Vercel → Project → Settings → Environment Variables** for
Production (and Preview if needed). They are the public values already present in
`.env.production`:

```text
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_OPENAPI_URL
API_PROXY_TARGET
NEXT_PUBLIC_SITE_URL=https://kiddoapp.in
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

`API_PROXY_TARGET` enables the `/api/v1` rewrite in `next.config.ts`. Without it,
the browser calls `NEXT_PUBLIC_API_URL` directly.

## Domain cutover from Netlify

1. Add `kiddoapp.in` and `www.kiddoapp.in` to the Vercel project.
2. Update DNS at the registrar to the records Vercel provides
   (nameservers or the A/CNAME records for the apex and `www`).
3. Remove the custom domains from the old Netlify site.
4. Keep the old Netlify site available until the Vercel deployment and DNS
   propagation are verified.

## Mobile release manifest

The in-app update check reads:

```text
https://kiddoapp.in/app-releases.json
```

After building new APKs, run:

```bash
npm run apps:sync
```

This copies the parent/child APKs into `public/` and updates both:

- `public/app-releases.json` — the manifest fetched by the mobile apps
- `src/lib/app-releases.json` — download-page labels

The current release is **1.0.4+5**. The APKs are served from `public/` on Vercel.

## Verification

After the first Vercel production deployment:

```text
https://kiddoapp.in/                     → new 16:9/mobile layout
https://kiddoapp.in/app-releases.json    → version 1.0.4, buildNumber 5
https://kiddoapp.in/kiddo-parent-app.apk → signed parent APK
https://kiddoapp.in/kiddo-child-app.apk  → signed child APK
```
