import type { NextConfig } from "next";

const nextConfig = {
  images: {
    domains: ["image.pollinations.ai"],
  },
};

module.exports = nextConfig;
//
// images: {
//   remotePatterns: [
//       {
//           protocol: 'https',
//           hostname: 'image.pollinations.ai',
//           port: '',
//           pathname: '/**',
//       },
//   ],
// },
