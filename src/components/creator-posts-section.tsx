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
        No post data cached for this account yet.
      </p>
    );
  }

  return (
    <Tabs defaultValue="top" className="gap-4">
      <TabsList>
        <TabsTrigger value="top">Top performing</TabsTrigger>
        <TabsTrigger value="recent">Recent</TabsTrigger>
      </TabsList>
      <TabsContent value="top">
        <PostGrid posts={topAllTime} />
      </TabsContent>
      <TabsContent value="recent">
        <PostGrid posts={recent} />
      </TabsContent>
    </Tabs>
  );
}

function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {posts.map((post) => (
        <PostCard key={post.code} post={post} />
      ))}
    </div>
  );
}
