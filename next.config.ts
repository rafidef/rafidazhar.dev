import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted on a VPS behind nginx. `standalone` emits a minimal server
  // bundle so the deploy artifact does not carry all of node_modules.
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // All imagery is local and self-hosted; no remote patterns needed.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        // Fingerprinted font/logo assets never change under the same name.
        source: "/logos/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
