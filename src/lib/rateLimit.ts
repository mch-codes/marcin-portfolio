import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

/* The contact action is an unauthenticated POST that sends real email, so
   without a cap a script can flood the inbox and burn the Resend quota. Five
   an hour per IP: a person writing twice because they mistyped an address
   never notices, a bot stops at five.

   Sliding window rather than fixed: a fixed window lets a burst land at 11:59
   and another at 12:00, so ten arrive back to back. */
const LIMIT = 5;
const WINDOW = "1 h";

/* Built once and reused — a module-level singleton, because a new client per
   call would open a connection per request. Null when the env vars are absent
   (local dev without Upstash), and callers treat that as "no limit" rather
   than failing the send. */
const redisConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const ratelimit = redisConfigured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(LIMIT, WINDOW),
      prefix: "portfolio:contact",
      analytics: true,
    })
  : null;

/* x-forwarded-for is spoofable in general, but on Vercel the platform sets the
   leftmost entry from the real connection, so it is trustworthy here. Falls
   back to a shared bucket rather than to "no limit" — an unidentifiable
   client should be more restricted, not less. */
async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/** True when the caller may proceed. Fails open: if Upstash is unreachable,
    a real enquiry still gets through rather than being silently dropped. */
export async function allowContact(): Promise<boolean> {
  if (!ratelimit) return true;
  try {
    const { success } = await ratelimit.limit(await clientIp());
    return success;
  } catch (error) {
    console.error("Rate limit check failed, allowing through:", error);
    return true;
  }
}
