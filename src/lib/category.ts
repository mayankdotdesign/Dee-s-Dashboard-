import type { Category, Tier } from "./types";

// Pure, client-safe constants — kept out of creators.ts (which imports the
// Neon client) so components that only need a label don't drag a server-only
// DB connection into the client bundle.

export const CATEGORY_LABEL: Record<Category, string> = {
  sarkari: "Sarkari / Office Life",
  travel: "Travel",
  books: "Books",
  fitness: "Fitness",
};

export const TIER_LABEL: Record<Tier, string> = {
  peer: "Peer",
  small: "Small",
  mid: "Mid-size",
  "high-performer": "High performer",
  "top-performer": "Top performer",
  mega: "Mega",
};
