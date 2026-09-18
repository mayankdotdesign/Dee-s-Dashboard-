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
  tier: Tier;
  followers: number;
  posts: number;
  bio: string;
  engagement_rate_pct: number | null;
  why_relevant: string;
  category: Category;
  /** Proxied through /api/img — see proxiedImage() in lib/creators.ts. Null until a cron run has captured it. */
  profile_pic_url: string | null;
}

export type MediaLabel = "reel" | "carousel" | "photo" | "video";

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
