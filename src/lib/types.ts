export type Category = "sarkari" | "travel" | "books" | "fitness";

export type Tier =
  | "peer"
  | "small"
  | "mid"
  | "high-performer"
  | "top-performer"
  | "mega";

export interface Creator {
  handle: string;
  full_name: string;
  niche: string;
  tier: Tier;
  followers: number;
  posts: number;
  bio: string;
  engagement_rate_pct: number | null;
  top_post_caption: string | null;
  top_post_likes: number;
  why_relevant: string;
  /** Derived, not stored in seed data */
  category: Category;
}

export interface CreatorSeedFile {
  generated_at: string;
  source: string;
  note: string;
  creators: Omit<Creator, "category">[];
}

export type MediaLabel = "reel" | "carousel" | "photo";

export interface Post {
  code: string;
  media_type: number;
  media_label: MediaLabel;
  like_count: number;
  comment_count: number;
  play_count: number | null;
  created_at: string;
  caption: string;
  thumbnail: string;
  permalink: string;
}

export interface HandlePosts {
  /** Best posts ever, regardless of age. */
  top_all_time: Post[];
  /** Best posts among the most recently published batch — recent AND good, not just latest. */
  top_recent: Post[];
}

export interface CreatorPostsFile {
  generated_at: string;
  posts_by_handle: Record<string, HandlePosts>;
}
