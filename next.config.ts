import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This allows all hostnames
        port: "", // Optional, use if needed
        pathname: "**", // Matches all paths
      },
    ],
  },
};

module.exports = nextConfig;
//
// images: {
//   remotePatterns: [
//       {
//           protocol: 'https',
//           hostname: '**', // This allows all hostnames
//           port: '',       // Optional, use if needed
//           pathname: '**', // Matches all paths
//       },
//   ],
// },
