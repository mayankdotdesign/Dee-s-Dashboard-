"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/post-card";
import type { Post } from "@/lib/types";

export function CreatorPostsSection({
  topAllTime,
  recent,
}: {
  topAllTime: Post[];
  recent: Post[];
}) {
  if (topAllTime.length === 0 && recent.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No posts saved for this account yet.
      </p>
    );
  }

  return (
    <Tabs defaultValue="recent" className="gap-4">
      <TabsList>
        <TabsTrigger value="recent">Recent</TabsTrigger>
        <TabsTrigger value="top">Top performing</TabsTrigger>
      </TabsList>
      <TabsContent value="recent">
        <PostGrid posts={recent} />
      </TabsContent>
      <TabsContent value="top">
        <PostGrid posts={topAllTime} />
      </TabsContent>
    </Tabs>
  );
}

function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post.code} post={post} />
      ))}
    </div>
  );
}
