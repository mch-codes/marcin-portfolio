import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { hostname: "github-readme-stats.vercel.app" },
      { hostname: "ghchart.rshah.org" },
    ],
  },
};

export default nextConfig;
