# Dee's Dashboard

Deeksha's personal creator-growth reference dashboard — see [`PLAN.md`](PLAN.md) for the full build plan and [`research/20-creators.md`](research/20-creators.md) for the Phase 1 research this is seeded from.

## Status

Live at [deedash.vercel.app](https://deedash.vercel.app) (Phase 6 deploy done). Running on static seed data from [`data/seed-creators.json`](data/seed-creators.json) — no live database or ScrapeCreators ingestion wired up yet, that's Phase 3.

## Stack

- Next.js 16 (App Router, Turbopack)
- Tailwind CSS v4 + shadcn/ui — custom warm/editorial token system in `src/app/globals.css` (not the default shadcn theme)
- `next-themes` for light/dark mode
- Password gate via a branded `/login` page (not the browser's native Basic Auth prompt) — `src/proxy.ts` checks a signed session cookie set by `src/app/api/login/route.ts` against `DASHBOARD_PASSWORD`

## Local development

```bash
npm install
cp .env.example .env.local   # optional locally — no password prompt without it
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See [`.env.example`](.env.example). `DASHBOARD_PASSWORD` is the only one needed to run the current build; `SCRAPECREATORS_API_KEY` and `DATABASE_URL` are for Phase 3.
