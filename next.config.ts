import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/gistda-proxy/:path*',
        destination: 'https://sphere.gistda.or.th/services/:path*',
      },
    ];
  },
};

export default nextConfig;
