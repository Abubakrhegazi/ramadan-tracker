// apps/web/lib/rateLimit.ts
import { NextRequest } from "next/server";

// Simple in-memory rate limiter (replace with Redis in production)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

export function rateLimit(
  req: NextRequest,
  {
    maxRequests = 10,
    windowMs = 60 * 1000,
    keyPrefix = "global",
  }: { maxRequests?: number; windowMs?: number; keyPrefix?: string } = {}
): { success: boolean; remaining: number } {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();

  let entry = store.get(key);
  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + windowMs };
    store.set(key, entry);
  }

  entry.count += 1;
  const remaining = Math.max(0, maxRequests - entry.count);

  return { success: entry.count <= maxRequests, remaining };
}
