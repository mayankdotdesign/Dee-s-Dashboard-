import { sql } from "./db";
import { proxiedImage } from "./utils";
import type { MediaLabel, Post } from "./types";

interface PostRow {
  code: string;
  media_type: string;
  media_label: string;
  like_count: number | null;
  comment_count: number | null;
  play_count: number | null;
  created_at: string;
  caption: string | null;
  thumbnail: string;
  permalink: string;
}

function mapPost(r: PostRow): Post {
  return {
    code: r.code,
    media_type: Number(r.media_type) || 0,
    media_label: r.media_label as MediaLabel,
    like_count: r.like_count ?? 0,
    comment_count: r.comment_count ?? 0,
    play_count: r.play_count,
    created_at: r.created_at,
    caption: r.caption ?? "",
    thumbnail: proxiedImage(r.thumbnail),
    permalink: r.permalink,
  };
}

function engagement(p: PostRow) {
  return (p.like_count ?? 0) + (p.comment_count ?? 0);
}

// Only rows the monthly cron has enriched with a real code/thumbnail/permalink
// are displayable as cards — older seed-only history has none of those and
// is used for the numeric insights in lib/insights.ts instead.

/** Best posts ever, regardless of age. */
export async function topAllTimePosts(
  handle: string,
  limit = 5,
): Promise<Post[]> {
  const rows = (await sql`
    SELECT * FROM posts
    WHERE handle = ${handle} AND thumbnail IS NOT NULL
    ORDER BY (like_count + comment_count) DESC
    LIMIT ${limit}
  `) as PostRow[];
  return rows.map(mapPost);
}

/** Best posts among the most recently published batch (recent AND good). */
export async function recentPosts(
  handle: string,
  limit = 5,
): Promise<Post[]> {
  const rows = (await sql`
    SELECT * FROM posts
    WHERE handle = ${handle} AND thumbnail IS NOT NULL
    ORDER BY created_at DESC
    LIMIT 10
  `) as PostRow[];
  return rows
    .sort((a, b) => engagement(b) - engagement(a))
    .slice(0, limit)
    .map(mapPost);
}
