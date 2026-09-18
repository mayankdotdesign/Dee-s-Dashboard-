import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SC_BASE = "https://api.scrapecreators.com";

function mediaLabel(productType: string, mediaType: number): string {
  if (productType === "carousel_container") return "carousel";
  if (productType === "clips") return "reel";
  return mediaType === 1 ? "photo" : "video";
}

async function scFetch(path: string) {
  const res = await fetch(`${SC_BASE}${path}`, {
    headers: { "x-api-key": process.env.SCRAPECREATORS_API_KEY! },
  });
  if (!res.ok) {
    throw new Error(`ScrapeCreators ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

// Monthly refresh (see vercel.json) — pulls current followers + the 5 most
// recent posts per tracked creator. Capped at 5 (not the full history) to
// control ScrapeCreators credit spend, per PLAN.md §8.
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const creators = await sql`SELECT handle FROM creators`;

  // Refresh every creator concurrently — sequential took ~2min locally,
  // which blows past Vercel's Hobby-plan function time limit.
  const outcomes = await Promise.allSettled(
    creators.map(async ({ handle }) => {
      const profile = await scFetch(`/v1/instagram/profile?handle=${handle}`);
      const user = profile.data.user;
      const followers: number = user.edge_followed_by.count;
      const postsCount: number | null = user.edge_owner_to_timeline_media?.count ?? null;

      const postsRes = await scFetch(`/v2/instagram/user/posts?handle=${handle}`);
      const items = (postsRes.items ?? []).slice(0, 5);

      let engagementSum = 0;
      for (const p of items) {
        engagementSum += (p.like_count ?? 0) + (p.comment_count ?? 0);
        await sql`
          INSERT INTO posts (code, handle, media_type, media_label, like_count, comment_count, play_count, created_at, caption, thumbnail, permalink)
          VALUES (${p.code}, ${handle}, ${String(p.media_type)}, ${mediaLabel(p.product_type, p.media_type)}, ${p.like_count}, ${p.comment_count}, ${p.play_count ?? null}, ${p.created_at}, ${p.caption?.text ?? null}, ${p.display_uri ?? null}, ${p.url ?? null})
          ON CONFLICT (handle, created_at) DO UPDATE SET
            code = EXCLUDED.code,
            media_type = EXCLUDED.media_type,
            media_label = EXCLUDED.media_label,
            like_count = EXCLUDED.like_count,
            comment_count = EXCLUDED.comment_count,
            play_count = EXCLUDED.play_count,
            thumbnail = EXCLUDED.thumbnail,
            permalink = EXCLUDED.permalink
        `;
      }

      const engagementRate =
        items.length > 0 && followers > 0
          ? (engagementSum / items.length / followers) * 100
          : null;

      await sql`
        INSERT INTO creator_snapshots (handle, followers, posts_count, engagement_rate_pct)
        VALUES (${handle}, ${followers}, ${postsCount}, ${engagementRate})
      `;

      return handle;
    }),
  );

  const results: Record<string, string> = {};
  outcomes.forEach((outcome, i) => {
    const handle = creators[i].handle as string;
    results[handle] =
      outcome.status === "fulfilled"
        ? "ok"
        : outcome.reason instanceof Error
          ? outcome.reason.message
          : "unknown error";
  });

  return NextResponse.json({ refreshed_at: new Date().toISOString(), results });
}
