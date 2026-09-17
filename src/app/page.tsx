import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { getCreators, sortByEngagement, SEED_META } from "@/lib/creators";

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Card className="gap-1 py-4">
      <CardContent className="px-4">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-sans text-2xl font-semibold tabular-nums">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const creators = sortByEngagement(getCreators());
  const rated = creators.filter((c) => c.engagement_rate_pct != null);
  const avgEngagement =
    rated.reduce((sum, c) => sum + (c.engagement_rate_pct ?? 0), 0) /
    rated.length;

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Creator leaderboard
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          20 creators across sarkari-job/office-life, travel, books, and
          fitness — the niches that overlap Deeksha&apos;s own two accounts.
          Ranked by engagement rate, not just follower count.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Tracked creators" value={String(creators.length)} />
        <StatTile
          label="Avg. engagement rate"
          value={`${avgEngagement.toFixed(1)}%`}
        />
        <StatTile label="Follower range" value="2.8K – 4.3M" />
        <StatTile label="Niches covered" value="4" />
      </div>

      <Tabs defaultValue="all-time" className="gap-4">
        <TabsList>
          <TabsTrigger value="this-week">This week</TabsTrigger>
          <TabsTrigger value="this-month">This month</TabsTrigger>
          <TabsTrigger value="all-time">All time</TabsTrigger>
        </TabsList>

        <TabsContent value="this-week">
          <ComingSoonNotice period="week" />
          <LeaderboardTable creators={creators} />
        </TabsContent>
        <TabsContent value="this-month">
          <ComingSoonNotice period="month" />
          <LeaderboardTable creators={creators} />
        </TabsContent>
        <TabsContent value="all-time">
          <LeaderboardTable creators={creators} />
        </TabsContent>
      </Tabs>

      <p className="mt-6 text-xs text-muted-foreground">
        Snapshot from {SEED_META.generated_at} · {SEED_META.source}
      </p>
    </div>
  );
}

function ComingSoonNotice({ period }: { period: "week" | "month" }) {
  return (
    <div className="mb-3 rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
      Real &ldquo;fastest-growing this {period}&rdquo; ranking needs a few{" "}
      {period === "week" ? "weeks" : "months"} of snapshots from the
      ingestion cron to build up history — showing the current all-time
      snapshot below until then.
    </div>
  );
}
