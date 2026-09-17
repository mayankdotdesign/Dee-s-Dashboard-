# Dee's Growth Dashboard — Build Plan

Personal creator-growth dashboard for Deeksha (@deeksha.singhal200 / @aso_chronicals). Not a public product — a private reference tool she uses to track what's working in her niche (sarkari-job/office-life humor + travel, fitness, books, creative lifestyle) and see how top accounts in that space are performing.

Status: **planning — nothing built yet.**

---

## 1. What it does

- **Leaderboard**: top 20 creators in her niche, filterable by *this week* / *this month*, ranked by engagement.
- **Search**: type `@username` → pull that account's profile, stats, and top content on demand.
- **Trending feed**: latest high-performing content in her niche (hashtag/keyword-driven), not general IG trending.
- Scoped entirely to her niche — never a general IG explore/trending surface.

## 2. Architecture

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) | Native fit for Vercel, server components for data-fetching pages |
| Hosting | Vercel (Hobby, free) | Already connected |
| Database | **Neon Postgres**, via Vercel Marketplace (free tier) | Need real sort/filter queries for the leaderboard and historical growth tracking — outgrows a JSON-blob approach fast |
| Scheduled ingestion | Vercel Cron → serverless function | Pulls fresh creator/post data on a schedule instead of live-fetching on every page load (keeps API credit spend predictable) |
| On-demand fetch | Serverless API route | Powers the `@username` search when a handle isn't already tracked |
| Data source | ScrapeCreators REST API (server-side only, key in Vercel env vars) | Same provider used for research in this chat; the deployed app calls it directly over HTTP, not via MCP (MCP only exists inside this Claude session) |
| Access control | Password gate via middleware + env var | Recommended over an unlisted URL — cheap to add, keeps it off search engines/link leaks |
| UI components | shadcn/ui, styled with our own design tokens | Accessible primitives without the generic "default shadcn" look |

**Data flow:**
1. Cron job (daily or weekly) → fetches profile + recent posts for ~20-30 tracked creators, plus niche hashtag/keyword search → writes to Neon.
2. Dashboard pages read from Neon (fast, no live API calls on page load).
3. Search bar → checks Neon first; if handle isn't tracked, hits ScrapeCreators live, shows result, and persists it for next time.

**Known limitation:** "top this week" by *engagement* works from day one (post timestamps are already in the data). "Fastest-growing this week" by *follower change* needs our own historical snapshots — that view will be empty/thin until the cron has run for a couple of weeks.

## 3. Design & UX approach — skills in use

Explicitly aiming for 2026-standard, considered UI — not default-AI-generated look. Plan is to invoke these at the relevant build stages rather than winging the styling:

| Skill | When we use it |
|---|---|
| `design-system` | First — define the token architecture (color, type scale, spacing, radii) before any component gets built, so the UI is systemic, not ad hoc per-page styling |
| `frontend-design-direction` | Right after tokens — lock a visual direction/mood that fits *her* brand (warm, creative, travel/reading-coded) rather than a generic SaaS-dashboard look |
| `shadcn` / `vercel:shadcn` | Component layer — accessible primitives (tables, tabs, command palette for search) restyled with our tokens |
| `dataviz` | Leaderboard charts, engagement sparklines, trend visualizations — explicitly covers dashboard/chart design, color-by-series rules, avoiding default chart-library look |
| `design-better` | Craft pass once screens exist — applies UX heuristics + Laws of UX against our token file for hierarchy, interaction, and polish |
| `motion-foundations` / `motion-ui` | Purposeful micro-interactions — leaderboard rank changes, tab transitions, loading states — the thing that separates "2026 feel" from a static CRUD table |
| `make-interfaces-feel-better` | Loading/empty/error states, perceived performance — matters a lot here since real pages will show "no data yet" during the first cron cycles |
| `accessibility` | WCAG 2.2 AA pass — contrast, keyboard nav, screen-reader labels on charts |
| `taste` | General aesthetic gut-check pass before calling any screen done |
| `vercel:nextjs`, `vercel:react-best-practices` | Implementation-level best practices for the actual Next.js code |

Considered and **not** using: `dashboard-builder` — that skill targets Grafana/SigNoz observability boards, not a product UI; not a fit here. `liquid-glass-design` is a candidate visual direction (not a default) — we'll weigh it against her brand mood during the `frontend-design-direction` pass rather than defaulting to a trendy glass look for its own sake.

## 4. ScrapeCreators API

- **Now (research/prototyping)**: using the account already connected in this Claude session.
- **Production app**: needs its own ScrapeCreators account/API key, separate from the one used here. **I'll prompt for that key when we get to wiring the Vercel environment variables** — not needed until then.

## 5. Accounts & services

| Service | Status |
|---|---|
| GitHub (`mayankdotdesign/Dee-s-Dashboard-`) | ✅ Have — repo cloned locally, will hold all code + this plan |
| Vercel | ✅ Have — already connected |
| ScrapeCreators (prototyping) | ✅ Have — using current session's account |
| ScrapeCreators (production) | ⏳ Needed later — will prompt before deploying |
| **Neon (Postgres)** | ⏳ **Needed** — add via Vercel Marketplace integration (uses your existing Vercel login, free tier, a few clicks — no separate signup) |

That's the only new thing to set up. Everything else is covered.

## 6. Build phases

- [x] **Phase 0 — this plan** (this file)
- [x] **Phase 1 — Research**: 20 real creators overlapping her niches identified and profiled — see [`research/20-creators.md`](research/20-creators.md) and [`data/seed-creators.json`](data/seed-creators.json)
- [ ] **Phase 2 — Scaffold**: Next.js app in this repo, design tokens, shadcn setup, Neon connection
- [ ] **Phase 3 — Ingestion**: cron job + serverless functions for scheduled + on-demand ScrapeCreators fetches
- [ ] **Phase 4 — Dashboard UI**: leaderboard (week/month toggle), creator detail view, search, trending feed
- [ ] **Phase 5 — Polish pass**: design-better + motion + accessibility passes
- [ ] **Phase 6 — Deploy**: connect Vercel to this repo, set env vars (prompting for the new ScrapeCreators key + password gate secret), ship

## 7. Open questions (non-blocking, revisit later)

- Custom domain, or default `*.vercel.app` URL — fine either way for a private tool.
- Exact niche hashtags/keywords to seed the trending feed beyond what's obvious from her bio (`#SarkariNaukri`, `#GovtEmployee`, travel/fitness/book tags) — will refine during Phase 1 research.
