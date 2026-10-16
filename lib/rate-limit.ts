import { isIP } from "node:net";
type Bucket = { count: number; resetAt: number };

type RateLimitGlobal = typeof globalThis & {
  __growthlyRateBuckets?: Map<string, Bucket>;
};

export const MAX_RATE_BUCKETS = 5000;
const root = globalThis as RateLimitGlobal;
const buckets = root.__growthlyRateBuckets ?? new Map<string, Bucket>();
root.__growthlyRateBuckets = buckets;

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    if (buckets.size >= MAX_RATE_BUCKETS) {
      for (const [bucketKey, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(bucketKey);
      }
    }
    if (!buckets.has(key) && buckets.size >= MAX_RATE_BUCKETS)
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil(windowMs / 1000)),
      };
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }
  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function requestIp(request: Request) {
  // Header trust is an explicit host decision, never inferred from client input.
  if (process.env.TRUST_PROXY_HEADERS !== "true") return "unknown";
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const value = forwarded || realIp;
  return value && isIP(value) ? value : "unknown";
}
