import postsFile from "../../data/creator-posts.json";
import type { CreatorPostsFile, Post } from "./types";

const data = postsFile as CreatorPostsFile;

export function getPostsForHandle(handle: string): Post[] {
  return data.posts_by_handle[handle] ?? [];
}

/** Top 5 by engagement (likes + comments), highest first. */
export function topAllTimePosts(handle: string, limit = 5): Post[] {
  return [...getPostsForHandle(handle)]
    .sort((a, b) => b.like_count + b.comment_count - (a.like_count + a.comment_count))
    .slice(0, limit);
}

/** Most recent 5 by post date, newest first. */
export function recentPosts(handle: string, limit = 5): Post[] {
  return [...getPostsForHandle(handle)]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}
