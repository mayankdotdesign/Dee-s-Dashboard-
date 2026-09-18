import { NextResponse } from "next/server";
import { proxiedImage } from "@/lib/utils";
import {
  SC_BASE,
  DAILY_LOOKUP_CAP,
  LOW_BALANCE_THRESHOLD,
  getCreditBalance,
  getTodaysLookupCount,
  incrementDailyLookupCount,
} from "@/lib/scrapecreators";

export const dynamic = "force-dynamic";

// On-demand @username lookup for the search box — not stored in our DB,
// but does use ScrapeCreators' own server-side cache (cache_max_age=7d):
// a follower count doesn't need to be fresher than a week for a casual
// lookup, and a cache hit costs 0 credits instead of 1. Gated by the same
// DASHBOARD_PASSWORD session as the rest of the app (see src/proxy.ts).
//
// Two safety nets on top of that, per PLAN.md §16 — the real risk here is a
// bug or runaway loop, not normal search volume:
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get("handle")?.trim().replace(/^@/, "");

  if (!handle || !/^[a-zA-Z0-9._]{1,30}$/.test(handle)) {
    return NextResponse.json({ error: "Invalid handle" }, { status: 400 });
  }

  const todaysCount = await getTodaysLookupCount();
  if (todaysCount >= DAILY_LOOKUP_CAP) {
    return NextResponse.json(
      { error: "daily_cap_reached", message: "Search is paused for today — try again tomorrow." },
      { status: 429 },
    );
  }

  const balance = await getCreditBalance();
  if (balance != null && balance < LOW_BALANCE_THRESHOLD) {
    return NextResponse.json(
      { error: "low_balance", message: "Search is paused — running low on ScrapeCreators credits." },
      { status: 503 },
    );
  }

  // Counted here, not just on success — a 404 still spends a real query
  // against Instagram, so it counts toward the daily cap the same way.
  await incrementDailyLookupCount();

  const res = await fetch(
    `${SC_BASE}/v1/instagram/profile?handle=${encodeURIComponent(handle)}&trim=true&cache_max_age=7d`,
    { headers: { "x-api-key": process.env.SCRAPECREATORS_API_KEY! } },
  );

  if (res.status === 404) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (!res.ok) {
    return NextResponse.json({ error: "lookup_failed" }, { status: 502 });
  }

  const data = await res.json();
  const user = data?.data?.user;
  if (!user) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const picUrl: string | null = user.profile_pic_url_hd ?? user.profile_pic_url ?? null;

  return NextResponse.json({
    handle: user.username ?? handle,
    full_name: user.full_name ?? user.username ?? handle,
    followers: user.edge_followed_by?.count ?? null,
    is_private: Boolean(user.is_private),
    profile_pic_url: picUrl ? proxiedImage(picUrl) : null,
  });
}
