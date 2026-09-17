import postsFull from "../../data/creator-posts-full.json";
import type { MediaLabel } from "./types";

interface FullPost {
  media_type: number;
  media_label: MediaLabel;
  like_count: number;
  comment_count: number;
  play_count: number | null;
  created_at: string;
  caption: string;
}

const data = postsFull as Record<string, FullPost[]>;

function engagement(p: FullPost) {
  return p.like_count + p.comment_count;
}

function getPosts(handle: string): FullPost[] {
  return data[handle] ?? [];
}

/** IST-adjusted day-of-week / hour, independent of server/client timezone. */
function toIST(iso: string) {
  const istMs = new Date(iso).getTime() + 5.5 * 60 * 60 * 1000;
  return new Date(istMs);
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ---------- 1. Format performance ----------

export interface FormatBreakdown {
  label: MediaLabel;
  count: number;
  avgEngagement: number;
  isBest: boolean;
}

export function formatPerformance(handle: string): FormatBreakdown[] | null {
  const posts = getPosts(handle);
  if (posts.length === 0) return null;

  const groups = new Map<MediaLabel, FullPost[]>();
  for (const p of posts) {
    const list = groups.get(p.media_label) ?? [];
    list.push(p);
    groups.set(p.media_label, list);
  }
  if (groups.size < 2) return null; // only one format used — nothing to compare

  const rows = [...groups.entries()].map(([label, list]) => ({
    label,
    count: list.length,
    avgEngagement: list.reduce((s, p) => s + engagement(p), 0) / list.length,
    isBest: false,
  }));
  rows.sort((a, b) => b.avgEngagement - a.avgEngagement);
  rows[0].isBest = true;
  return rows;
}

// ---------- 2. Best time to post ----------

export interface BestPostingTime {
  dayLabel: string;
  timeLabel: string;
  sampleSize: number;
}

function timeBucket(hour: number): string {
  if (hour >= 5 && hour < 12) return "mornings";
  if (hour >= 12 && hour < 17) return "afternoons";
  if (hour >= 17 && hour < 21) return "evenings";
  return "late nights";
}

export function bestPostingTime(handle: string): BestPostingTime | null {
  const posts = getPosts(handle);
  if (posts.length < 4) return null; // too few posts for a meaningful pattern

  const byDay = new Map<number, { total: number; count: number }>();
  const byBucket = new Map<string, { total: number; count: number }>();

  for (const p of posts) {
    const ist = toIST(p.created_at);
    const day = ist.getUTCDay();
    const bucket = timeBucket(ist.getUTCHours());
    const eng = engagement(p);

    const d = byDay.get(day) ?? { total: 0, count: 0 };
    d.total += eng;
    d.count += 1;
    byDay.set(day, d);

    const b = byBucket.get(bucket) ?? { total: 0, count: 0 };
    b.total += eng;
    b.count += 1;
    byBucket.set(bucket, b);
  }

  const bestDay = [...byDay.entries()].sort(
    (a, b) => b[1].total / b[1].count - a[1].total / a[1].count,
  )[0];
  const bestBucket = [...byBucket.entries()].sort(
    (a, b) => b[1].total / b[1].count - a[1].total / a[1].count,
  )[0];

  return {
    dayLabel: DAY_NAMES[bestDay[0]],
    timeLabel: bestBucket[0],
    sampleSize: posts.length,
  };
}

// ---------- 3. Top hashtags ----------

const HASHTAG_RE = /#[\p{L}\p{N}_]+/gu;

export interface HashtagStat {
  tag: string;
  count: number;
  avgEngagement: number;
}

export function topHashtags(handle: string, limit = 5): HashtagStat[] {
  const posts = getPosts(handle);
  const byTag = new Map<string, { total: number; count: number }>();

  for (const p of posts) {
    const tags = new Set(
      (p.caption.match(HASHTAG_RE) ?? []).map((t) => t.toLowerCase()),
    );
    const eng = engagement(p);
    for (const tag of tags) {
      const t = byTag.get(tag) ?? { total: 0, count: 0 };
      t.total += eng;
      t.count += 1;
      byTag.set(tag, t);
    }
  }

  return [...byTag.entries()]
    .map(([tag, { total, count }]) => ({
      tag,
      count,
      avgEngagement: total / count,
    }))
    .sort((a, b) => b.count - a.count || b.avgEngagement - a.avgEngagement)
    .slice(0, limit);
}

// ---------- 4. Posting cadence ----------

export interface PostingCadence {
  typicalDaysBetween: number;
  postsPerWeek: number;
}

export function postingCadence(handle: string): PostingCadence | null {
  const posts = getPosts(handle);
  if (posts.length < 3) return null;

  const sorted = [...posts].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const diffMs =
      new Date(sorted[i].created_at).getTime() -
      new Date(sorted[i - 1].created_at).getTime();
    gaps.push(diffMs / (1000 * 60 * 60 * 24));
  }
  gaps.sort((a, b) => a - b);
  // Median, not mean — some accounts have a long dormant stretch buried in
  // their post history, and a single huge gap would otherwise swamp the average.
  const mid = Math.floor(gaps.length / 2);
  const typicalDaysBetween =
    gaps.length % 2 === 0 ? (gaps[mid - 1] + gaps[mid]) / 2 : gaps[mid];

  return {
    typicalDaysBetween,
    postsPerWeek: typicalDaysBetween > 0 ? 7 / typicalDaysBetween : 0,
  };
}

// ---------- 5. Consistency ----------

export type ConsistencyLevel = "steady" | "occasional-breakout" | "breakout-driven";

export interface ConsistencyStat {
  level: ConsistencyLevel;
  medianEngagement: number;
  maxEngagement: number;
  ratio: number;
}

export function consistency(handle: string): ConsistencyStat | null {
  const posts = getPosts(handle);
  if (posts.length < 4) return null;

  const values = posts.map(engagement).sort((a, b) => a - b);
  const mid = Math.floor(values.length / 2);
  const median =
    values.length % 2 === 0
      ? (values[mid - 1] + values[mid]) / 2
      : values[mid];
  const max = values[values.length - 1];
  const ratio = median > 0 ? max / median : max > 0 ? Infinity : 1;

  const level: ConsistencyLevel =
    ratio < 2 ? "steady" : ratio < 5 ? "occasional-breakout" : "breakout-driven";

  return { level, medianEngagement: median, maxEngagement: max, ratio };
}
