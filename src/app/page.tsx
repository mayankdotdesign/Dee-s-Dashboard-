import { Card, CardContent } from "@/components/ui/card";
import { LeaderboardTabs } from "@/components/leaderboard-tabs";
import { getCreators, sortByEngagement, SEED_META } from "@/lib/creators";
import type { Category } from "@/lib/types";

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

const VALID_CATEGORIES: Category[] = [
  "sarkari",
  "travel",
  "books",
  "fitness",
  "other",
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ niche?: string }>;
}) {
  const { niche } = await searchParams;
  const allCreators = sortByEngagement(getCreators());
  const activeNiche = VALID_CATEGORIES.includes(niche as Category)
    ? (niche as Category)
    : null;
  const creators = activeNiche
    ? allCreators.filter((c) => c.category === activeNiche)
    : allCreators;

  const rated = allCreators.filter((c) => c.engagement_rate_pct != null);
  const avgEngagement =
    rated.reduce((sum, c) => sum + (c.engagement_rate_pct ?? 0), 0) /
    rated.length;

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Your creator leaderboard
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          20 creators across sarkari-job/office-life, travel, books, and
          fitness — the niches that overlap your two accounts. Ranked by
          engagement rate, not just follower count.
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
        <StatTile label="Follower range" value="2.8K – 4.3M" />
        <StatTile label="Niches covered" value="4" />
      </div>

      <LeaderboardTabs creators={creators} />

      <p className="mt-6 text-xs text-muted-foreground">
        Snapshot from {SEED_META.generated_at} · {SEED_META.source}
      </p>
    </div>
  );
}
