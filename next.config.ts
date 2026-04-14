import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "json.commudle.com"
      },
      {
        protocol: "https",
        hostname: "media.giphy.com",
      }
    ],
  },
  // For Next.js 16 with Turbopack, use serverExternalPackages
  serverExternalPackages: ['pdfkit'],
  // Turbopack configuration (empty object to silence the warning)
  turbopack: {},
};

export default nextConfig;