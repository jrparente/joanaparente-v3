import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "**", // This allows all paths from the Sanity CDN
      },
    ],
  },
  experimental: {
    esmExternals: "loose",
  },
  webpack: (config) => {
    // Fix refractor import issues
    config.resolve.alias = {
      ...config.resolve.alias,
      "refractor/core": "refractor/core.js",
      "refractor/core.js": "refractor/core.js",
    };
  },
};
