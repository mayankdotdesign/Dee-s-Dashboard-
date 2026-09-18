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
- [x] **Phase 4 — Dashboard UI** (built alongside Phase 2, running on static seed data): leaderboard with niche filter + week/month (disabled, tooltipped)/all-time tabs, creator detail pages with real Top-performing/Recent post grids (thumbnails, likes/comments/plays, click-through) and 5 "Patterns worth knowing" insight widgets, search, trending feed. See §8-§10 for the review-round fixes and decisions layered on top of the original build.
- [x] **Phase 6 — Deploy**: live at [deedash.vercel.app](https://deedash.vercel.app), password-gated with a custom login screen. See §11.
- [x] **Phase 3 — Ingestion**: Neon connection, DB schema, cron job + serverless functions for scheduled + on-demand ScrapeCreators fetches, wire pages to real data instead of the static JSON. See §12.
- [~] **Phase 5 — Polish pass**: mobile leaderboard converted from a horizontal-scrolling table to a stacked card layout below `sm` (see §13) — the specific candidate called out here originally. Broader design-better/motion/accessibility passes are still open-ended and not yet done.

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

## 11. Phase 6 — Deploy

Live at **https://deedash.vercel.app** (imported via the Vercel dashboard's "Import Git Repository" flow, auto-deploys on every push to `main`).

Fixed/built for this:
- **Replaced HTTP Basic Auth with a branded `/login` page** — sunflower emoji, "Hey Deeksha" welcome, single password field, inline error state on a wrong password. `src/proxy.ts` now checks a signed session cookie (`src/lib/auth.ts` hashes the password with SHA-256 so the raw password is never stored client-side, and changing `DASHBOARD_PASSWORD` auto-invalidates old sessions) instead of issuing a 401 challenge. `src/app/api/login/route.ts` verifies and sets the cookie.
- Caught and fixed a real bug on the live deployment during testing: the success path used `router.push()` + `router.refresh()`, which raced the client-side RSC transition against the cookie landing and got stuck re-fetching `/login` in a loop. Switched to a hard navigation (`window.location.assign`), which fixed it immediately — verified with the real password end-to-end afterward.
- Hid the site header/nav on `/login` — it was rendering the full app chrome before she'd even authenticated.
- A Vercel MCP connection became available mid-session (read-heavy: project/deployment info, runtime logs/errors, temporary auth-bypass share links — no domain-rename or project-rename write capability). Used it to confirm there's no programmatic way to rename the project or add a domain from here; she did it herself in the Vercel dashboard.

Domain is live at `deedash.vercel.app`; the old `dee-s-dashboard.vercel.app` is gone.

## 12. Phase 3 — Ingestion (built)

**Infrastructure:**
- Neon Postgres added via the Vercel Marketplace integration (free tier). Three tables: `creators` (static editorial content — bio, why_relevant, category, tier), `creator_snapshots` (one row per refresh — followers, posts_count, engagement_rate_pct, timestamped), `posts` (full post history; only rows enriched by a live fetch carry `code`/`thumbnail`/`permalink` and are shown as cards — older seed-only rows feed the numeric insight widgets but aren't displayable, since they never had an image).
- `scripts/seed-db.mjs` migrated the original static JSON (`data/seed-creators.json`, `data/creator-posts-full.json`) into Postgres as the baseline — one-time, idempotent, re-runnable.
- `/api/cron/refresh` (`vercel.json` schedules it for the 1st of every month) pulls current followers + the 5 most recent posts per tracked creator from ScrapeCreators, upserts into the DB. Refreshes all 20 creators **concurrently** (`Promise.allSettled`) — a first sequential version took ~2 minutes and would have blown past Vercel's function time limit; concurrent brought it to ~15s. Gated by `CRON_SECRET` (Vercel Cron's own auth), exempted from the password-gate middleware in `src/proxy.ts` since it has no browser session.
- `/api/lookup?handle=X` — the on-demand `@username` search. Always hits ScrapeCreators live (no DB write, no caching), regardless of the tracked list's monthly cadence, per the original scope. Gated by the normal password session like the rest of the app, since each call spends a credit.
- `/api/img?url=X` — a same-origin image proxy. Instagram's CDN sends `Cross-Origin-Resource-Policy: same-origin` on some edge hosts, which silently breaks direct `<img src>` hotlinking in the browser (intermittently — some hosts allow it, most don't). Fetching server-side and re-serving avoids it; doesn't solve the CDN URL's eventual expiry, which is the same trade-off the original 150 locally-hosted thumbnails avoided only by downloading at scrape time.

**Pages switched from static JSON to live DB reads:** `lib/creators.ts`, `lib/posts.ts`, and `lib/insights.ts` are now all async and Postgres-backed. `getLastUpdated()` replaced the static `SEED_META.generated_at` footer. Every page that touches them (`/`, `/creator/[handle]`, `/trending`, the root layout's search) is `force-dynamic` so data is always fresh, not baked in at build/deploy time.

**Follower growth widget is now real** (was a permanent "coming soon" placeholder) — computes % change between the earliest and latest snapshot once at least 2 exist. It'll read as a tiny, noisy delta at first (only two points a day apart right now) and get more meaningful as monthly snapshots accumulate.

**Bugs found and fixed during build/verification (browser-tested, not just typechecked):**
- `CATEGORY_LABEL`/`TIER_LABEL` lived in `lib/creators.ts` alongside the new Neon client — any client component importing just the label constant (e.g. `category-badge.tsx`, `niche-filter.tsx`) dragged the whole DB-connection module into the browser bundle, which crashed with "No database connection string was provided to `neon()`" (env vars aren't exposed client-side). Fixed by splitting the pure constants into `lib/category.ts`, which has no DB import.
- The cron's `ON CONFLICT DO UPDATE` clause forgot to update `code` (only `like_count`/`comment_count`/`play_count`/`thumbnail`/`permalink`). When a freshly-fetched post collided on `(handle, created_at)` with an already-seeded row (same real post, matching timestamp), the update path kept the seed row's `code = NULL` while still setting a real `thumbnail` — producing displayable-but-code-less posts, which duplicate-keyed in React (`key={post.code}` → `key={null}` twice) and broke `<PostCard>` rendering. Fixed the upsert to include `code`/`media_type`/`media_label`, re-ran the cron to backfill, and reverted the two rows that had already fallen out of the 5-most-recent window (so they'd never get corrected) back to thumbnail-less/insights-only.
- Real captions sometimes repeat the same hashtag twice — `post-card.tsx`'s hashtag chips used the raw regex match (no dedupe) as React keys, another duplicate-key case. Fixed with a `Set`.

Verified end-to-end in the browser: leaderboard renders real follower/engagement numbers, creator detail pages show real insights and post thumbnails (via the image proxy), the on-demand search returns live results for untracked accounts (tested `@narendramodi` → 106.8M followers, and a nonexistent handle → clean "not found" state) and external accounts open their real Instagram profile in a new tab.

## 13. Phase 5 (partial) — mobile leaderboard card layout

Below the `sm` breakpoint, `LeaderboardTable` now renders `LeaderboardCards` instead of a horizontally-scrolling 5-column table — one stacked card per creator (rank, avatar, handle, name, niche badge, followers, engagement meter), plus a standalone "Filter · Niche" row above the list so the niche dropdown stays reachable without the table header. Table markup is unchanged above `sm` (`hidden sm:block` / `sm:hidden` toggle, no duplicated logic beyond the two render paths).

Also fixed while testing on a 375px viewport: the creator detail page's 3-column Followers/Tier/Engagement stat row squeezed "Mid-size"/"High performer" onto two cramped lines. Changed to `grid-cols-2 sm:grid-cols-3` with Engagement spanning both columns on mobile (`col-span-2 sm:col-span-1`), and the Tier value drops to `text-lg` below `sm`.

Verified visually at 375×812 (leaderboard cards, niche filter dropdown, creator detail stat row, post cards) and confirmed the desktop table is untouched.

Not done (remaining Phase 5 scope, open-ended): a broader design-better pass, motion, and a dedicated accessibility audit (contrast, focus order, ARIA) beyond what shipped incidentally with earlier rounds.

## 14. Production outage — every deploy since Phase 3 was silently failing

After pushing the Phase 3 + Phase 5 commits, the live site kept behaving as if none of it had landed. Root cause, in order of discovery:

1. **Every build from `5f8aa3b` onward was actually failing**, not stalling — Vercel kept serving the pre-Phase-3 build (`9f15a39`) without surfacing this anywhere obvious. `src/lib/db.ts` created the Neon client eagerly at module scope, and Next statically prerenders `/_not-found` at build time, which evaluates the root layout's module graph (imports `db.ts`) before `DATABASE_URL` is reliably available in that build phase — crashing the whole build. Fixed by making the client lazy (only calls `neon()` on first actual query) **and** making the root layout's creators fetch resilient (`.catch(() => [])`), since a 404 page should never depend on a live DB connection either way. Verified by building with `DATABASE_URL` completely absent — succeeds now.
2. Once builds succeeded again, the site 500'd on every DB-backed route. Vercel's request trace showed **zero outgoing requests** from the failing function — meaning the code threw before ever attempting a network call, which only happens if `DATABASE_URL` reads as empty. Root cause: the earlier naming collision during the Neon integration install (see §12) meant `DATABASE_URL` was left blank in Vercel the whole time; the real connection string only ever existed under the `NEON_*`-prefixed vars and in local `.env.local` (fetched manually via the Neon MCP). Fixed by overwriting `DATABASE_URL` in Vercel with the real value directly.
3. Even after saving the corrected value, the *very next* request still failed the same way — resolved a minute or two later on its own, most likely function-container propagation delay rather than a real second bug (subsequent requests all succeeded cleanly).

Verified fully recovered against the live URL, not just locally: homepage renders real DB data, `/api/cron/refresh` returns `"ok"` for all 20 creators, `/api/lookup` returns live results, `/api/img` proxies a real thumbnail (200, correct JPEG bytes).

**Lesson for next time**: this app never fails loudly on a broken deploy — Vercel just keeps serving the last good build with no obvious signal in the UI that new pushes stopped taking effect. Worth checking the Deployments tab's actual top entry (status + commit) after any push that touches `src/lib/db.ts`, the root layout, or environment variables, rather than assuming a successful `git push` means the live site updated.

## 15. Open Graph image + ScrapeCreators credit optimization

**Open Graph image**: `src/app/opengraph-image.tsx` renders the `/login` screen (sunflower, "Hey Deeksha", password field, Enter button) as a 1200x630 PNG via `next/og`'s `ImageResponse`, so sharing the dashboard link shows a branded preview instead of nothing. Colors are the dark-mode palette from `globals.css` converted to hex (Satori, the renderer behind `next/og`, doesn't support `oklch()`). Had to exempt `/opengraph-image` from the password-gate middleware — link-preview crawlers (WhatsApp, Slack, iMessage) fetch it with no session cookie, so without the exemption they'd get redirected to `/login` and the preview would show login-page HTML instead of the image.

**Credit optimization**: a chunk of the ScrapeCreators account's credits went to repeated full-sweep test runs during this session's development (each full `/api/cron/refresh` run is 20 creators x 2 calls = 40 credits — re-running it 4-5 times while debugging the profile-picture backfill and the production outage adds up fast). Three fixes:

- **`cache_max_age=1d`** added to the cron's profile call, and **`cache_max_age=7d`** to `/api/lookup`'s. ScrapeCreators caches server-side and charges **0 credits on a hit** — verified directly against the API (two back-to-back calls both returned `cached: true, credits_charged: 0`). The posts endpoint doesn't support this parameter, only profile does. 7 days is fine for a casual on-demand follower-count lookup; 1 day on the cron only guards against same-day re-runs, since a real monthly gap always exceeds it anyway.
- **`/api/cron/refresh?handle=<handle>`** — refreshes one creator instead of sweeping all 20, for targeted testing (2 credits instead of 40).
- **`/api/cron/refresh?dry_run=true`** — exercises auth + the DB query + response shape with zero ScrapeCreators calls, for testing the plumbing itself.

Going forward, any manual testing of the cron route should use `dry_run` or a single `handle` rather than a full sweep, and repeated searches for the same on-demand handle are now free within a week.

## 16. Credit cap + low-balance safety net

With §15's caching in place, projected the actual runway: the cron is a fixed ~40 credits/month, and even a heavy on-demand-search month (~100 searches) lands around ~165 credits/month — against a 6,814-credit balance that's **3.5+ years** even in the heavy case, more like 6-10 years at light/moderate use. **Steady organic usage was never the real risk** — the credits actually burned so far came entirely from repeated full-sweep test runs during development (§15), a burst pattern, not a drip.

So the safety net targets bursts/bugs specifically, not normal search volume:

- **`lookup_usage` table** (`usage_date` PK, `count`) — tracks `/api/lookup` calls per day.
- **Daily hard cap of 30 lookups/day** (`DAILY_LOOKUP_CAP` in `src/lib/scrapecreators.ts`) — a ceiling against any bug or runaway loop, not a realistic organic limit.
- **Low-balance kill switch**: `/api/lookup` checks the live ScrapeCreators balance (confirmed the balance check itself is free — two consecutive checks both returned the same count) and pauses search below **500 credits** (`LOW_BALANCE_THRESHOLD`), leaving the monthly cron (~40 credits) plenty of room to keep running afterward. Both gates tested directly: forced the daily counter to 30 → got `429 daily_cap_reached`; forced the threshold above the real balance → got `503 low_balance`. Both revert to normal once the condition clears.
- Considered surfacing the balance in the dashboard footer as the practical "alert" (no email/SMS infra exists here) — built and verified it, then removed it per her call: she'd rather not see it on every visit. `/api/cron/refresh`'s JSON response still includes `scrapecreators_credits_remaining` for anyone who wants to check directly, and `getCreditBalance()` in `src/lib/scrapecreators.ts` is there if visibility is wanted again later.
