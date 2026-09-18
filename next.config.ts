import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  trailingSlash: true,
  // Pin the workspace root: a stray lockfile in the home directory otherwise
  // makes Turbopack guess the wrong root (build warning, ST-103).
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
