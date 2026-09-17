import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { CreatorAvatar } from "@/components/creator-avatar";
import { CategoryBadge } from "@/components/category-badge";
import { getCreators } from "@/lib/creators";

export default function TrendingPage() {
  const withPosts = getCreators()
    .filter((c) => c.top_post_caption)
    .sort((a, b) => b.top_post_likes - a.top_post_likes);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Trending in my niche
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Top-performing sampled posts from tracked creators, not general IG
          Explore — every post below is from an account already in your
          sarkari-job/office-life, travel, books, or fitness niches.
        </p>
        <div className="mt-1 w-fit rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          This list updates whenever we refresh the tracked creators —
          automatic updates are coming soon.
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {withPosts.map((creator) => (
          <Link key={creator.handle} href={`/creator/${creator.handle}`}>
            <Card className="transition-colors hover:border-primary/40">
              <CardContent className="flex gap-3 px-4">
                <CreatorAvatar
                  handle={creator.handle}
                  fullName={creator.full_name}
                  className="h-10 w-10 shrink-0"
                />
                <div className="flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="font-medium">@{creator.handle}</span>
                    <CategoryBadge category={creator.category} />
                  </div>
                  <p className="text-sm italic text-muted-foreground">
                    &ldquo;{creator.top_post_caption}&rdquo;
                  </p>
                  <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                    {creator.top_post_likes.toLocaleString("en-IN")} likes
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
