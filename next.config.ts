import type { NextConfig } from "next";

function resolveProxyTarget(): string | undefined {
  const explicit = process.env.API_PROXY_TARGET;
  if (explicit) {
    // Accept both origin-only targets and targets that already include the
    // API prefix. The rewrite below appends /api/v1, so a trailing /api/v1 in
    // the configured target would otherwise produce /api/v1/api/v1/...
    return explicit.replace(/\/$/, "").replace(/\/api\/v1$/i, "");
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl && /^https?:\/\//i.test(apiUrl)) {
    try {
      return new URL(apiUrl).origin;
    } catch {
      return undefined;
    }
  }

  return undefined;
}

const proxyTarget = resolveProxyTarget();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    if (!proxyTarget) return [];
    return [
      {
        source: "/api/v1/:path*",
        destination: `${proxyTarget}/api/v1/:path*`,
      },
      {
        source: "/api-docs.json",
        destination: `${proxyTarget}/api-docs.json`,
      },
    ];
  },
};

export default nextConfig;
