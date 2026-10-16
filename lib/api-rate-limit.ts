import { createHmac } from "node:crypto";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  createSupabaseLeadWriter,
  hasSupabaseLeadStoreConfig,
} from "@/lib/supabase/server";

export async function checkApiRateLimit(
  key: string,
  limit: number,
  windowMs: number,
) {
  if (process.env.DISTRIBUTED_RATE_LIMIT_ENABLED !== "true")
    return checkRateLimit(key, limit, windowMs);
  const secret = process.env.RATE_LIMIT_HASH_SECRET;
  // Never bypass a configured shared limiter on provider/configuration failure.
  const unavailable = {
    allowed: false,
    retryAfterSeconds: 60,
    unavailable: true,
  };
  if (
    !secret ||
    secret.length < 32 ||
    process.env.TRUST_PROXY_HEADERS !== "true" ||
    !hasSupabaseLeadStoreConfig()
  )
    return unavailable;
  const bucketKey = createHmac("sha256", secret).update(key).digest("hex");
  try {
    const { data, error } = await createSupabaseLeadWriter().rpc(
      "consume_growthly_rate_limit",
      {
        p_bucket_key: bucketKey,
        p_request_limit: limit,
        p_window_seconds: Math.ceil(windowMs / 1000),
      },
    );
    if (
      error ||
      !data ||
      typeof data.allowed !== "boolean" ||
      !Number.isSafeInteger(data.retry_after) ||
      data.retry_after < 0
    )
      return unavailable;
    return { allowed: data.allowed, retryAfterSeconds: data.retry_after };
  } catch {
    return unavailable;
  }
}
