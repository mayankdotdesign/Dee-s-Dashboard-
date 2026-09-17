import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root explicitly — without this, Turbopack walks up
  // and can pick a stray lockfile in a parent directory as the root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
