import Link from "next/link";
import { CreatorAvatar } from "@/components/creator-avatar";
import { CategoryBadge } from "@/components/category-badge";
import { PostCard } from "@/components/post-card";
import { getCreators } from "@/lib/creators";
import { topAllTimePosts } from "@/lib/posts";
import type { Creator, Post } from "@/lib/types";

export const dynamic = "force-dynamic";

interface TrendingEntry {
  creator: Creator;
  post: Post;
}

export default async function TrendingPage() {
  const creators = await getCreators();
  const withTopPost = await Promise.all(
    creators.map(async (creator) => ({
      creator,
      post: (await topAllTimePosts(creator.handle, 1))[0],
    })),
  );
  const withPosts: TrendingEntry[] = withTopPost
    .filter((entry): entry is TrendingEntry => entry.post != null)
    .sort((a, b) => b.post.like_count - a.post.like_count);

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Trending in my niche
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Top-performing posts from tracked creators, not general IG Explore
          — every post below is from an account already in your
          sarkari-job/office-life, travel, books, or fitness niches.
        </p>
        <div className="mt-1 w-fit rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          Refreshed automatically on the 1st of every month.
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {withPosts.map(({ creator, post }, i) => (
          <div key={creator.handle} className="flex flex-col gap-2">
            <Link
              href={`/creator/${creator.handle}`}
              className="group flex w-fit items-center gap-2"
            >
              <CreatorAvatar
                handle={creator.handle}
                fullName={creator.full_name}
                profilePicUrl={creator.profile_pic_url}
                className="h-8 w-8 shrink-0"
              />
              <span className="font-medium group-hover:text-primary transition-colors">
                @{creator.handle}
              </span>
              <CategoryBadge category={creator.category} />
            </Link>
            <PostCard post={post} priority={i < 2} />
          </div>
        ))}
      </div>
    </div>
  );
}
