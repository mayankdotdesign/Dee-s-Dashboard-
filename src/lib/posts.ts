import postsFile from "../../data/creator-posts.json";
import type { CreatorPostsFile, Post } from "./types";

const data = postsFile as CreatorPostsFile;

/** Best posts among the most recently published batch (recent AND good). */
export function recentPosts(handle: string): Post[] {
  return data.posts_by_handle[handle]?.top_recent ?? [];
}

/** Best posts ever, regardless of age. */
export function topAllTimePosts(handle: string): Post[] {
  return data.posts_by_handle[handle]?.top_all_time ?? [];
}
