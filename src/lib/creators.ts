import seedFile from "../../data/seed-creators.json";
import type { Category, Creator, CreatorSeedFile } from "./types";

function deriveCategory(niche: string): Category {
  const n = niche.toLowerCase();
  if (n.includes("sarkari")) return "sarkari";
  if (n.includes("travel")) return "travel";
  if (n.includes("book")) return "books";
  if (n.includes("fitness")) return "fitness";
  return "other";
}

const seed = seedFile as CreatorSeedFile;

export const CREATORS: Creator[] = seed.creators.map((c) => ({
  ...c,
  category: deriveCategory(c.niche),
}));

export const SEED_META = {
  generated_at: seed.generated_at,
  source: seed.source,
  note: seed.note,
};

export function getCreators(): Creator[] {
  return CREATORS;
}

export function getCreatorByHandle(handle: string): Creator | undefined {
  return CREATORS.find((c) => c.handle.toLowerCase() === handle.toLowerCase());
}

export function sortByEngagement(creators: Creator[]): Creator[] {
  return [...creators].sort((a, b) => {
    const ae = a.engagement_rate_pct ?? -1;
    const be = b.engagement_rate_pct ?? -1;
    return be - ae;
  });
}

export function sortByFollowers(creators: Creator[]): Creator[] {
  return [...creators].sort((a, b) => b.followers - a.followers);
}

export const CATEGORY_LABEL: Record<Category, string> = {
  sarkari: "Sarkari / Office Life",
  travel: "Travel",
  books: "Books",
  fitness: "Fitness",
  other: "Other",
};

export const TIER_LABEL: Record<Creator["tier"], string> = {
  peer: "Peer",
  small: "Small",
  mid: "Mid-size",
  "high-performer": "High performer",
  "top-performer": "Top performer",
  mega: "Mega",
};
