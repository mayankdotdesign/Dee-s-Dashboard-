# Dee's Dashboard

Deeksha's personal creator-growth reference dashboard — see [`PLAN.md`](PLAN.md) for the full build plan and [`research/20-creators.md`](research/20-creators.md) for the Phase 1 research this is seeded from.

## Status

Phase 2 (scaffold) in progress: Next.js + Tailwind v4 + shadcn/ui, running on static seed data from [`data/seed-creators.json`](data/seed-creators.json). No live database or ScrapeCreators ingestion wired up yet — that's Phase 3.

## Stack

- Next.js 16 (App Router, Turbopack)
- Tailwind CSS v4 + shadcn/ui — custom warm/editorial token system in `src/app/globals.css` (not the default shadcn theme)
- `next-themes` for light/dark mode
- HTTP Basic Auth gate via `src/proxy.ts` (`DASHBOARD_PASSWORD` env var)

## Local development

```bash
npm install
cp .env.example .env.local   # optional locally — no password prompt without it
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See [`.env.example`](.env.example). `DASHBOARD_PASSWORD` is the only one needed to run the current build; `SCRAPECREATORS_API_KEY` and `DATABASE_URL` are for Phase 3.
