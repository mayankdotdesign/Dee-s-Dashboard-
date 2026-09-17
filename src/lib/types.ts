export type Category = "sarkari" | "travel" | "books" | "fitness" | "other";

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
