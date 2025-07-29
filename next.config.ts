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
};

export default nextConfig;
