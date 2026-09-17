import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root explicitly — without this, Turbopack walks up
  // and can pick a stray lockfile in a parent directory as the root.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Post thumbnails are already downsized + compressed at ingestion time
    // (480px, ~30KB). Skip Vercel's Image Optimization pipeline so it never
    // eats into the free-tier optimization quota for images that don't
    // benefit from further server-side resizing.
    unoptimized: true,
  },
};

export default nextConfig;
