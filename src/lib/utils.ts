export { cn } from "cn"

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(Math.round(n));
}

/**
 * Instagram's CDN blocks cross-origin embedding on some edge hosts
 * (Cross-Origin-Resource-Policy), so any Instagram image URL is routed
 * through our own same-origin proxy instead of linking the CDN URL
 * directly. See src/app/api/img/route.ts.
 */
export function proxiedImage(url: string): string {
  return `/api/img?url=${encodeURIComponent(url)}`;
}
