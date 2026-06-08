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
      { hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
