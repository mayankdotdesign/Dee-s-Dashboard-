import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CreatorAvatar } from "@/components/creator-avatar";
import { CategoryBadge } from "@/components/category-badge";
import { EngagementMeter } from "@/components/engagement-meter";
import { CreatorPostsSection } from "@/components/creator-posts-section";
import { CreatorInsights } from "@/components/creator-insights";
import { getCreatorByHandle } from "@/lib/creators";
import { TIER_LABEL } from "@/lib/category";
import { topAllTimePosts, recentPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

function formatFollowers(n: number) {
  return n.toLocaleString("en-IN");
}

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const creator = await getCreatorByHandle(handle);
  if (!creator) notFound();

  const [topPosts, latestPosts] = await Promise.all([
    topAllTimePosts(creator.handle),
    recentPosts(creator.handle),
  ]);

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leaderboard
      </Link>

      <div className="mb-6 flex items-start gap-4">
        <CreatorAvatar
          handle={creator.handle}
          fullName={creator.full_name}
          profilePicUrl={creator.profile_pic_url}
          className="h-16 w-16"
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              @{creator.handle}
            </h1>
            <CategoryBadge category={creator.category} />
          </div>
          <p className="text-sm text-muted-foreground">{creator.full_name}</p>
          <a
            href={`https://www.instagram.com/${creator.handle}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            View on Instagram
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card className="gap-1 py-4">
          <CardContent className="px-4">
            <p className="text-xs text-muted-foreground">Followers</p>
            <p className="text-xl font-semibold tabular-nums">
              {formatFollowers(creator.followers)}
            </p>
          </CardContent>
        </Card>
        <Card className="gap-1 py-4">
          <CardContent className="px-4">
            <p className="text-xs text-muted-foreground">Tier</p>
            <p className="text-lg font-semibold leading-tight sm:text-xl">
              {TIER_LABEL[creator.tier] ?? creator.tier}
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-2 gap-1 py-4 sm:col-span-1">
          <CardContent className="px-4">
            <p className="text-xs text-muted-foreground">Engagement</p>
            <EngagementMeter
              valuePct={creator.engagement_rate_pct}
              className="mt-1.5"
            />
          </CardContent>
        </Card>
      </div>

      <section className="mb-6">
        <h2 className="mb-2 font-heading text-lg font-semibold">Bio</h2>
        <p className="text-sm text-muted-foreground">{creator.bio}</p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 font-heading text-lg font-semibold">
          Why this account is relevant
        </h2>
        <p className="text-sm text-muted-foreground">
          {creator.why_relevant}
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 font-heading text-lg font-semibold">
          Patterns worth knowing
        </h2>
        <CreatorInsights handle={creator.handle} />
      </section>

      <section>
        <h2 className="mb-3 font-heading text-lg font-semibold">Posts</h2>
        <CreatorPostsSection topAllTime={topPosts} recent={latestPosts} />
      </section>
    </div>
  );
}
