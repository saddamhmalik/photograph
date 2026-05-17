import type { NextConfig } from "next";

const apiBackend = process.env.API_BACKEND_URL ?? "http://127.0.0.1:8000";

function cdnRemotePattern():
  | { protocol: "https"; hostname: string; pathname: string }
  | null {
  const raw = process.env.NEXT_PUBLIC_CDN_URL?.trim();
  if (!raw) return null;
  try {
    const { hostname } = new URL(raw);
    return { protocol: "https", hostname, pathname: "/**" };
  } catch {
    return null;
  }
}

const cdnPattern = cdnRemotePattern();

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiBackend}/api/:path*`,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "*.r2.dev", pathname: "/**" },
      { protocol: "https", hostname: "**.r2.dev", pathname: "/**" },
      { protocol: "https", hostname: "**.cloudflare.com", pathname: "/**" },
      ...(cdnPattern ? [cdnPattern] : []),
    ],
  },
};

export default nextConfig;
