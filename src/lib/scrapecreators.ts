import { sql } from "./db";

export const SC_BASE = "https://api.scrapecreators.com";

// Below this, /api/lookup pauses itself — checking balance costs nothing
// (verified directly against the API), so this is a real-time kill switch,
// not a periodic guess. The monthly cron (~40 credits) still has plenty of
// room below this floor to keep running for a long while after search pauses.
export const LOW_BALANCE_THRESHOLD = 500;

// Hard ceiling on /api/lookup regardless of balance — the actual risk isn't
// organic search volume (see PLAN.md §16), it's a bug or runaway loop.
export const DAILY_LOOKUP_CAP = 30;

export async function getCreditBalance(): Promise<number | null> {
  try {
    const res = await fetch(`${SC_BASE}/v1/account/credit-balance`, {
      headers: { "x-api-key": process.env.SCRAPECREATORS_API_KEY! },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.creditCount === "number" ? data.creditCount : null;
  } catch {
    return null;
  }
}

/** Returns today's lookup count *after* incrementing it. */
export async function incrementDailyLookupCount(): Promise<number> {
  const rows = (await sql`
    INSERT INTO lookup_usage (usage_date, count)
    VALUES (CURRENT_DATE, 1)
    ON CONFLICT (usage_date) DO UPDATE SET count = lookup_usage.count + 1
    RETURNING count
  `) as { count: number }[];
  return rows[0].count;
}

export async function getTodaysLookupCount(): Promise<number> {
  const rows = (await sql`
    SELECT count FROM lookup_usage WHERE usage_date = CURRENT_DATE
  `) as { count: number }[];
  return rows[0]?.count ?? 0;
}
