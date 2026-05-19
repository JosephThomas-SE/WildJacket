# WildJacket

An eco-tourism platform where users can browse, book, and manage premium wildlife and nature experiences, with Supabase-powered authentication and an admin dashboard.

## Run & Operate

- `pnpm --filter @workspace/wildjacket run dev` — run the WildJacket frontend (Vite + React)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Vite + React, Tailwind CSS v4, wouter (client-side routing)
- Auth: Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- API: Express 5
- Build: esbuild (CJS bundle for API server)

## Where things live

- `artifacts/wildjacket/src/` — all frontend source code
- `artifacts/wildjacket/src/app/` — original Next.js page components (migrated)
- `artifacts/wildjacket/src/pages/` — Vite/React page wrappers for wouter routing
- `artifacts/wildjacket/src/context/AuthContext.tsx` — Supabase auth context/provider
- `artifacts/wildjacket/src/lib/supabase/client.ts` — Supabase browser client
- `artifacts/wildjacket/src/App.tsx` — wouter router with ProtectedRoute/AdminRoute guards
- `artifacts/wildjacket/src/index.css` — Tailwind v4 theme with custom eco-tourism tokens

## Architecture decisions

- Migrated from Next.js (Vercel) to Vite + React in Replit pnpm workspace
- `next/link` and `useRouter` replaced with wouter `Link` and `useLocation`
- Next.js server actions converted to direct Supabase browser client calls
- Server-only files (middleware, server auth helpers) stubbed with `export {}` since SSR is not used
- Supabase env vars renamed from `NEXT_PUBLIC_SUPABASE_*` to `VITE_SUPABASE_*`

## Product

- Home page with WildJacket branding and eco-tourism hero
- User auth: sign up, log in, forgot/reset password (via Supabase)
- Protected dashboard for authenticated users
- Admin dashboard behind role-based route guard
- Unauthorized and 404 pages

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Vite bakes env vars at startup — after changing secrets, always restart the `artifacts/wildjacket: web` workflow
- `VITE_SUPABASE_URL` must be the project URL (starts with `https://`); `VITE_SUPABASE_ANON_KEY` is the long `eyJ…` anon key

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
