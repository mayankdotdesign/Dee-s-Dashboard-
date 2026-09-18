import { Card, CardContent } from "@/components/ui/card";
import { LeaderboardTabs } from "@/components/leaderboard-tabs";
import { getCreators, sortByEngagement, getLastUpdated } from "@/lib/creators";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Card className="gap-1 py-4 transition-colors hover:border-primary/40">
      <CardContent className="px-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-sans text-2xl font-semibold tabular-nums">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

const ALL_CATEGORIES: Category[] = ["sarkari", "travel", "books", "fitness"];

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ niche?: string }>;
}) {
  const { niche } = await searchParams;
  const [creatorsData, lastUpdated] = await Promise.all([
    getCreators(),
    getLastUpdated(),
  ]);
  const allCreators = sortByEngagement(creatorsData);

  const activeNiches = (niche?.split(",") ?? []).filter((v): v is Category =>
    ALL_CATEGORIES.includes(v as Category),
  );
  const creators =
    activeNiches.length > 0
      ? allCreators.filter((c) => activeNiches.includes(c.category))
      : allCreators;

  const rated = allCreators.filter((c) => c.engagement_rate_pct != null);
  const avgEngagement =
    rated.reduce((sum, c) => sum + (c.engagement_rate_pct ?? 0), 0) /
    rated.length;
  const followerCounts = allCreators.map((c) => c.followers);
  const followerRange = `${formatFollowers(Math.min(...followerCounts))} – ${formatFollowers(Math.max(...followerCounts))}`;
  const nichesCovered = new Set(allCreators.map((c) => c.category)).size;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Hey Deeksha 👋
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Here&apos;s who&apos;s doing well in your world right now —
          sarkari-job/office-life, travel, books, and fitness. Ranked by how
          engaged their audience actually is, not just follower count.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Tracked creators"
          value={String(allCreators.length)}
        />
        <StatTile
          label="Avg. engagement rate"
          value={`${avgEngagement.toFixed(1)}%`}
        />
        <StatTile label="Follower range" value={followerRange} />
        <StatTile label="Niches covered" value={String(nichesCovered)} />
      </div>

      <LeaderboardTabs creators={creators} />

      <p className="mt-6 text-xs text-muted-foreground">
        Last updated {formatDate(lastUpdated)}
      </p>
    </main>
  );
}
