# Dee's Dashboard

Deeksha's personal creator-growth reference dashboard — see [`PLAN.md`](PLAN.md) for the full build plan and [`research/20-creators.md`](research/20-creators.md) for the Phase 1 research this is seeded from.

## Status

Live at [deedash.vercel.app](https://deedash.vercel.app). Phases 0–4 and 6 done; Phase 3 (real ingestion) is also done — see below.

## Stack

- Next.js 16 (App Router, Turbopack)
- Tailwind CSS v4 + shadcn/ui — custom warm/editorial token system in `src/app/globals.css` (not the default shadcn theme)
- `next-themes` for light/dark mode
- Password gate via a branded `/login` page (not the browser's native Basic Auth prompt) — `src/proxy.ts` checks a signed session cookie set by `src/app/api/login/route.ts` against `DASHBOARD_PASSWORD`
- Neon Postgres for creator/post/snapshot data (`src/lib/db.ts`), refreshed monthly by `/api/cron/refresh` from ScrapeCreators (`vercel.json` schedules it). `scripts/seed-db.mjs` is the one-time migration that seeded the DB from the original static JSON.
- On-demand `@username` search (`/api/lookup`) fetches any Instagram account live, regardless of the tracked list's cadence.
- `/api/img` proxies Instagram CDN thumbnails same-origin — their CDN blocks direct cross-origin embedding on some edge hosts.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL at minimum — the app reads from Postgres now
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See [`.env.example`](.env.example). `DATABASE_URL` is required (the app is fully DB-backed). `DASHBOARD_PASSWORD` gates access with a login page (skipped locally if unset). `SCRAPECREATORS_API_KEY` and `CRON_SECRET` are needed for the monthly refresh (`/api/cron/refresh`) and on-demand search (`/api/lookup`) to work.
