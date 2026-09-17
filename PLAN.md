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
- [x] **Phase 2 — Scaffold**: Next.js app, three-layer design tokens (warm terracotta/pine palette, not default shadcn theme), shadcn/ui components, light/dark mode. Neon connection deferred to Phase 3 (no data to persist yet).
- [x] **Phase 4 — Dashboard UI** (built alongside Phase 2, running on static seed data): leaderboard with niche filter + week/month (disabled, tooltipped)/all-time tabs, creator detail pages with real Top-performing/Recent post grids (thumbnails, likes/comments/plays, click-through), Cmd+K search, trending feed. See §8 for the review-round-1 fixes and decisions layered on top of the original build.
- [ ] **Phase 3 — Ingestion**: Neon connection, DB schema, cron job + serverless functions for scheduled + on-demand ScrapeCreators fetches, wire pages to real data instead of the static JSON. Scope per §8: **top 5** posts (not 10) per creator to control scraping cost, same limit for on-demand-searched accounts; monthly cadence for the tracked-list refresh; on-demand `@username` search always fetches live regardless of cadence.
- [ ] **Phase 5 — Polish pass**: design-better + motion + accessibility passes (mobile table currently horizontal-scrolls — candidate for a card layout on small screens)
- [ ] **Phase 6 — Deploy**: connect Vercel to this repo, set env vars (prompting for the new ScrapeCreators key + password gate secret), ship

## 7. Open questions (non-blocking, revisit later)

- Custom domain, or default `*.vercel.app` URL — fine either way for a private tool.
- Exact niche hashtags/keywords to seed the trending feed beyond what's obvious from her bio (`#SarkariNaukri`, `#GovtEmployee`, travel/fitness/book tags) — will refine during Phase 1 research.

## 8. Review round 1 — fixes and decisions

Fixed:
- Search command palette crashed on open (`CommandDialog` wasn't wrapping children in cmdk's `<Command>` root — no store context to subscribe to). Fixed and verified: opens, filters, shows "not tracked yet" for unknown handles.
- Niche filter added — radio dropdown from the leaderboard's Niche column header, state in the URL (`?niche=`).
- Week/month tabs disabled with a tooltip explaining they need cron history, instead of silently rendering the same data as All time (was confusing, read as broken).
- Creator detail pages now show real Top-performing / Recent post grids (5 each) with thumbnails, likes, comments, plays, date, and click-through to the live Instagram post — sourced from ScrapeCreators, thumbnails downloaded and compressed locally (~30KB each, no Vercel Image Optimization usage).
- Direct-address copy pass: "your leaderboard," "your two accounts," etc., instead of third-person references to Deeksha, including in seed data's `why_relevant` fields. Trending page retitled "Trending in my niche" (first-person, her own framing — distinct from the second-person "your" used in body copy elsewhere).
- Hover states added to table rows, stat tiles, post cards.

**Decided, not yet built (Phase 3 scope):**
- **Engagement floor for the main leaderboard**: once real per-post history accumulates (a month or so), filter to accounts sustaining ≥20% engagement — keeps the leaderboard feeling aspirational rather than discouraging. Niches don't need equal representation; an account topping engagement in just one niche still qualifies. A single standout post can also justify inclusion, not just an account-wide average.
- **"Closest matches to you" exemption**: any exact job-title/niche match stays even if under the ≥20% floor — relevance over vanity metrics. (The two accounts originally named here, `@aso_naresh_gautam` and `@aso_prashantrana`, were removed in review round 2 — see §9 — so this is a standing rule for future candidates, not tied to specific handles right now. The current closest matches, `@sarkari_karamchari2207` and `@shreya.xplores`, both clear the floor comfortably anyway.)
- **Post-fetch cost control**: 5 posts per creator (not 10), same limit whether it's a tracked account or a live `@username` search result — same template either way, just capped lower to control ScrapeCreators credit spend.
- Profile picture rehosting (same CDN-expiry fix as post thumbnails) — deferred to Phase 3 alongside the rest of the real ingestion pipeline.

## 9. Review round 2 — women-only re-curation and more fixes

Fixed:
- **Women-only re-curation**: 13 of the 20 creators were men or a multi-author brand account (`@theglobalhues`) and got removed, including one (`@itsaartisahu`) whose content leans heavily religious and didn't fit the niche regardless of gender. Replaced with 13 newly researched independent women creators across the same 4 niches — see [`research/20-creators.md`](research/20-creators.md) for the full list and reasoning. Re-fetched real post history (12 posts each) for all 20 and switched `engagement_rate_pct` from a 1-2 post sample to a proper average across each account's 12 most recent posts.
- **Dropped the "Other" niche category** — every account in it was one of the removed men/brand accounts, so it emptied out naturally. `Category` type, badge colors, and the filter no longer reference it.
- **Niche filter is now multi-select**: checkboxes instead of radio buttons, with a count badge next to the chevron (e.g. "Niche ②"). State still lives in the URL as a comma-separated list.
- **"Recent" tab now means recent-and-good, not just latest**: it shows the best-performing posts among each creator's most-recently-published batch (last 8 of the 12 fetched), ranked by engagement — not pure reverse-chronological. It's also the default/first tab on creator pages now, with "Top performing" (best-ever, any age) second.
- **Plain-language copy pass**: removed "cron," "Phase 1/3," "ScrapeCreators," and similar internal jargon from every user-facing string (tooltips, empty states, footer). The footer now reads a plain date instead of the raw data-source string.
- **Greeting replaces the leaderboard heading**: "Hey Deeksha 👋" instead of "Your creator leaderboard" — fixed, not time-of-day dynamic, per her call.
- Fixed two Base UI-specific bugs hit while building the above: a `DropdownMenuTrigger` wrapping a `Button` component produced invalid nested `<button>` HTML (fixed by styling the trigger directly with `buttonVariants()` instead of wrapping a component); and `DropdownMenuLabel` needs to sit inside a `<DropdownMenuGroup>` (or `RadioGroup`), not float directly in `DropdownMenuContent`, or Base UI throws "MenuGroupContext is missing."

Not changed: the ≥20% engagement floor and Phase 3 ingestion scope from round 1 (§8) — she asked to let the current data run for a month before revisiting, rather than force it now with the current single-sample-per-era data.

## 10. Review round 3 — card layout, real bugs, and per-creator insight widgets

Fixed:
- **Post card redesign**: rebuilt to a horizontal layout (portrait thumbnail left, content stacked right) per a provided wireframe, applied to both the creator detail page and Trending. Content order was then flipped again — caption/hashtags first, engagement stats last — to match the convention of other social apps instead of leading with stats.
- **Search dropdown alignment bug** (real bug, not styling taste): `CommandItem` always renders an invisible trailing checkmark that also carries `ml-auto`, which was splitting the auto-margin space with the creator name's own `ml-auto` and stranding it mid-row instead of flush right. Fixed by giving the row its own `flex justify-between` wrapper so it stops competing with that hidden element.
- **Scroll/blank-screen report**: stress-tested heavily on both `next dev` and a production `next build && next start` and could not reproduce a real rendering bug on either. Did find that above-the-fold images took a moment to appear on first load; fixed by eager-loading (`priority`) the first two cards in every post grid. Best explanation for what was seen: the dev server recompiles on every file save, and the report likely coincided with active editing — worth watching for recurrence now that we're not mid-edit, but not something the code itself was found to cause.
- **"Niches covered" stat tile** was hardcoded as `"4"` — now computed from the actual distinct categories present, matching the other three (already-dynamic) tiles.
- **Hover tooltips** added to every engagement stat pill (Likes/Comments/Views) explaining what it represents.
- **Five new "Patterns worth knowing" widgets** on the creator detail page (`src/components/creator-insights.tsx`, logic in `src/lib/insights.ts`) — see the tracking table below. Required persisting the full 12-post history per creator (not just the 5-10 curated for thumbnails) into a new committed file, [`data/creator-posts-full.json`](data/creator-posts-full.json), so these stats don't depend on ephemeral scratch data. Caught and fixed one real bug while building this: posting cadence using the *mean* gap between posts was badly skewed by accounts with one long dormant stretch buried in their history (one account's average came out to "every 69 days" when its real recent cadence is closer to every 2) — switched to median, which is robust to that outlier.

### Additional data-point tracking (per her request — sorted by status)

| Data point | Status | Notes |
|---|---|---|
| Format performance (reel/carousel/photo) | ✅ Implemented | `formatPerformance()` — needs ≥2 formats used, else shows an empty state |
| Best day/time to post | ✅ Implemented | `bestPostingTime()` — IST-normalized regardless of server/client timezone; needs ≥4 posts |
| Hashtag reuse patterns | ✅ Implemented | `topHashtags()` — top 5 by frequency, avg engagement shown per tag |
| Posting cadence | ✅ Implemented | `postingCadence()` — median gap between posts, not mean (see bug note above) |
| Consistency vs. one-hit-viral | ✅ Implemented | `consistency()` — median vs. max engagement ratio → steady / occasional-breakout / breakout-driven |
| Follower growth over time | ⏳ Placeholder built, data pending | Card exists with an honest empty state; needs Phase 3's recurring snapshots *and* real elapsed time — can't be unlocked by infra alone |
| Top comments sample | 💡 Proposed, not started | Needs one small additional scrape per post (comments endpoint) |
| Trending audio used on reels | 💡 Proposed, not started | Needs one small additional scrape per creator |
| IG's "related accounts" signal | 💡 Proposed, not started | Needs one small additional scrape per creator; useful for auto-discovering more creators later |

The first five needed no new scraping — all computed from data already fetched in review round 2. The next three are small, one-time, whenever-she-wants additions. Follower growth is the only one gated on both new infrastructure and the passage of time.
