import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages deploys to https://liloolight.github.io/mis-altera/
  basePath: "/mis-altera",
  // Images: unoptimized for static export (no server-side optimisation)
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
