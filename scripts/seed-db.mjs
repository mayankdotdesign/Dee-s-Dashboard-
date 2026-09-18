// One-time migration: loads the static seed JSON into Postgres as the
// baseline snapshot. Safe to re-run — it's idempotent (upserts).
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function deriveCategory(niche) {
  const n = niche.toLowerCase();
  if (n.includes("sarkari")) return "sarkari";
  if (n.includes("book")) return "books";
  if (n.includes("fitness")) return "fitness";
  if (n.includes("travel")) return "travel";
  throw new Error(`Unrecognized niche: "${niche}"`);
}

const seedCreators = JSON.parse(
  readFileSync(path.join(root, "data/seed-creators.json"), "utf-8"),
);
const postsFull = JSON.parse(
  readFileSync(path.join(root, "data/creator-posts-full.json"), "utf-8"),
);

const sql = neon(process.env.DATABASE_URL);

async function main() {
  for (const c of seedCreators.creators) {
    await sql`
      INSERT INTO creators (handle, full_name, category, tier, bio, why_relevant)
      VALUES (${c.handle}, ${c.full_name}, ${deriveCategory(c.niche)}, ${c.tier}, ${c.bio}, ${c.why_relevant})
      ON CONFLICT (handle) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        category = EXCLUDED.category,
        tier = EXCLUDED.tier,
        bio = EXCLUDED.bio,
        why_relevant = EXCLUDED.why_relevant
    `;

    await sql`
      INSERT INTO creator_snapshots (handle, captured_at, followers, posts_count, engagement_rate_pct)
      VALUES (${c.handle}, ${seedCreators.generated_at}, ${c.followers}, ${c.posts}, ${c.engagement_rate_pct})
      ON CONFLICT (handle, captured_at) DO NOTHING
    `;

    const posts = postsFull[c.handle] ?? [];
    for (const p of posts) {
      await sql`
        INSERT INTO posts (handle, media_type, media_label, like_count, comment_count, play_count, created_at, caption)
        VALUES (${c.handle}, ${String(p.media_type)}, ${p.media_label}, ${p.like_count}, ${p.comment_count}, ${p.play_count ?? null}, ${p.created_at}, ${p.caption})
        ON CONFLICT (handle, created_at) DO NOTHING
      `;
    }
    console.log(`seeded ${c.handle}: ${posts.length} posts`);
  }
}

main()
  .then(() => {
    console.log("done");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
