import type { NextConfig } from "next";
import path from "path";

/* 'unsafe-inline' on script-src is doing real damage to what this policy is
   worth, and it is here on purpose: Next injects inline bootstrap scripts, and
   the alternative is a per-request nonce, which needs a proxy layer and
   re-renders every response. On a page with no user-generated content and no
   authenticated session there is nothing for injected script to steal, so the
   trade lands differently than it would on an app. What the policy still buys:
   frame-ancestors stops clickjacking, form-action stops a rewritten form
   posting elsewhere, and object-src/base-uri close two older vectors.

   connect-src carries Vercel's telemetry host — @vercel/analytics serves its
   script same-origin from /_vercel/insights but reports to vitals. */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Redundant beside frame-ancestors, kept for browsers that predate it.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Vercel already sends this on its own domains; explicit so a custom domain
  // doesn't quietly lose it.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Nothing here asks for hardware. Deny by default rather than per-feature.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
