import { sql } from "./db";
import type { Category, Creator, Tier } from "./types";

interface CreatorRow {
  handle: string;
  full_name: string;
  category: string;
  tier: string;
  bio: string;
  why_relevant: string;
  followers: number;
  posts_count: number | null;
  engagement_rate_pct: string | number | null;
}

function mapRow(r: CreatorRow): Creator {
  return {
    handle: r.handle,
    full_name: r.full_name,
    category: r.category as Category,
    tier: r.tier as Tier,
    bio: r.bio,
    why_relevant: r.why_relevant,
    followers: r.followers,
    posts: r.posts_count ?? 0,
    engagement_rate_pct:
      r.engagement_rate_pct != null ? Number(r.engagement_rate_pct) : null,
  };
}

// Every creator, joined with their most recent snapshot (followers,
// engagement, etc.) — refreshed monthly by /api/cron/refresh.
export async function getCreators(): Promise<Creator[]> {
  const rows = (await sql`
    SELECT c.handle, c.full_name, c.category, c.tier, c.bio, c.why_relevant,
           s.followers, s.posts_count, s.engagement_rate_pct
    FROM creators c
    JOIN LATERAL (
      SELECT followers, posts_count, engagement_rate_pct
      FROM creator_snapshots
      WHERE handle = c.handle
      ORDER BY captured_at DESC
      LIMIT 1
    ) s ON true
  `) as CreatorRow[];
  return rows.map(mapRow);
}

export async function getCreatorByHandle(
  handle: string,
): Promise<Creator | undefined> {
  const rows = (await sql`
    SELECT c.handle, c.full_name, c.category, c.tier, c.bio, c.why_relevant,
           s.followers, s.posts_count, s.engagement_rate_pct
    FROM creators c
    JOIN LATERAL (
      SELECT followers, posts_count, engagement_rate_pct
      FROM creator_snapshots
      WHERE handle = c.handle
      ORDER BY captured_at DESC
      LIMIT 1
    ) s ON true
    WHERE lower(c.handle) = lower(${handle})
  `) as CreatorRow[];
  if (rows.length === 0) return undefined;
  return mapRow(rows[0]);
}

/** Most recent time any creator's stats were refreshed. */
export async function getLastUpdated(): Promise<string> {
  const rows =
    (await sql`SELECT max(captured_at) AS latest FROM creator_snapshots`) as {
      latest: string | null;
    }[];
  return rows[0]?.latest ?? new Date().toISOString();
}

export interface FollowerPoint {
  captured_at: string;
  followers: number;
}

/** Full follower-count history for one creator, oldest first. */
export async function getFollowerHistory(
  handle: string,
): Promise<FollowerPoint[]> {
  const rows = (await sql`
    SELECT captured_at, followers FROM creator_snapshots
    WHERE handle = ${handle}
    ORDER BY captured_at ASC
  `) as FollowerPoint[];
  return rows;
}

export function sortByEngagement(creators: Creator[]): Creator[] {
  return [...creators].sort((a, b) => {
    const ae = a.engagement_rate_pct ?? -1;
    const be = b.engagement_rate_pct ?? -1;
    return be - ae;
  });
}

export function sortByFollowers(creators: Creator[]): Creator[] {
  return [...creators].sort((a, b) => b.followers - a.followers);
}
