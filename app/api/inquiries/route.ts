import { createHash } from "node:crypto";
import { providerFetch } from "@/lib/provider-fetch";
import {
  readBoundedJson,
  BodyTooLargeError,
  BodyReadTimeoutError,
} from "@/lib/bounded-json";
import type { NextRequest } from "next/server";
import { privateJson } from "@/lib/api-response";
import { budgetOptions } from "@/config/business";
import { services } from "@/config/content";
import { validateInquiry } from "@/lib/inquiries";
import { requestIp } from "@/lib/rate-limit";
import { checkApiRateLimit } from "@/lib/api-rate-limit";
import { isSameOriginRequest } from "@/lib/request-security";
import {
  createSupabaseLeadWriter,
  hasSupabaseLeadStoreConfig,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 24_000;

function leadEmailText(lead: {
  full_name: string;
  business_name: string;
  email?: string;
  phone?: string;
  preferred_contact: string;
  service: string;
  package_id: string;
  brief: string;
  budget_range: string;
  preferred_deadline: string;
  attribution: Record<string, string>;
}) {
  const serviceName =
    services.find((item) => item.slug === lead.service)?.title ?? lead.service;
  const budget =
    budgetOptions.find((item) => item.value === lead.budget_range)?.label ??
    lead.budget_range;
  const attribution =
    Object.entries(lead.attribution)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n") || "None";
  return [
    "New GROWTHLY project enquiry",
    "",
    `Name: ${lead.full_name}`,
    `Business: ${lead.business_name || "Not supplied"}`,
    `Email: ${lead.email || "Not supplied"}`,
    `Phone: ${lead.phone || "Not supplied"}`,
    `Preferred contact: ${lead.preferred_contact}`,
    `Service: ${serviceName}`,
    `Package: ${lead.package_id}`,
    `Budget: ${budget}`,
    `Preferred timing: ${lead.preferred_deadline}`,
    "",
    "Project brief:",
    lead.brief,
    "",
    "Campaign attribution:",
    attribution,
  ].join("\n");
}

async function sendLeadEmail(text: string, key?: string | null) {
  const apiKey = process.env.RESEND_API_KEY;
  const destination = process.env.LEADS_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !destination || !from) return false;

  try {
    const response = await providerFetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(key ? { "Idempotency-Key": `growthly-enquiry/${key}` } : {}),
      },
      body: JSON.stringify({
        from,
        to: [destination],
        subject: "New GROWTHLY project enquiry",
        text,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error("Lead email delivery failed", response.status);
      return false;
    }
    const receipt = (await response.json().catch(() => null)) as {
      id?: string;
    } | null;
    return typeof receipt?.id === "string" && receipt.id.trim().length > 0;
  } catch {
    console.error("Lead email delivery failed");
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return privateJson(
      { message: "This request could not be accepted." },
      { status: 403 },
    );
  }

  const ip = requestIp(request);
  const limit = await checkApiRateLimit(`inquiry:${ip}`, 5, 10 * 60 * 1000);
  if ("unavailable" in limit && limit.unavailable) {
    return privateJson(
      {
        message:
          "The service is temporarily unavailable. Please try again later.",
      },
      { status: 503, headers: { "Retry-After": "60" } },
    );
  }
  if (!limit.allowed) {
    return privateJson(
      {
        message:
          "Too many requests from this connection. Please wait a few minutes or contact GROWTHLY directly.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let input: unknown;
  try {
    input = await readBoundedJson(request, MAX_BODY_BYTES);
  } catch (error) {
    if (error instanceof BodyReadTimeoutError)
      return privateJson(
        {
          message:
            "The upload took too long. Please retry on a stable connection.",
        },
        { status: 408 },
      );
    if (error instanceof BodyTooLargeError) {
      return privateJson(
        {
          message:
            "The request is too large. Please shorten your brief and try again.",
        },
        { status: 413 },
      );
    }
    return privateJson(
      { message: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const parsed = validateInquiry(input);
  if (!parsed.success) {
    return privateJson(
      {
        message:
          "Check the required fields and contact details, then try again.",
      },
      { status: 400 },
    );
  }
  if (process.env.ONLINE_INQUIRIES_ENABLED !== "true")
    return privateJson(
      {
        message:
          "Online enquiry delivery is not enabled. Please contact Growthly through WhatsApp.",
      },
      { status: 503 },
    );
  const idempotency = process.env.INQUIRY_IDEMPOTENCY_ENABLED === "true";
  const key = request.headers.get("idempotency-key");
  if (
    (key &&
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        key,
      )) ||
    (idempotency && !key)
  ) {
    return privateJson(
      { message: "Please refresh the form and try again." },
      { status: 400 },
    );
  }
  const fingerprint = createHash("sha256")
    .update(JSON.stringify(parsed.data))
    .digest("hex");
  const lead = parsed.data;
  // Keep the existing database schema: optional requirements form part of the private brief.
  lead.brief = [
    lead.service === "website-development"
      ? `Website type: ${lead.website_type}`
      : "",
    lead.existing_url ? `Existing URL: ${lead.existing_url}` : "",
    lead.industry ? `Industry: ${lead.industry}` : "",
    lead.required_features ? `Features: ${lead.required_features}` : "",
    "Privacy consent: accepted",
    "",
    lead.brief,
  ]
    .filter(Boolean)
    .join("\n");
  if (lead.website.trim()) {
    return privateJson(
      {
        message:
          "This request could not be accepted. Please check the form and try again.",
      },
      { status: 400 },
    );
  }

  const emailText = leadEmailText(lead);
  const emailConfigured = Boolean(
    process.env.RESEND_API_KEY &&
    process.env.LEADS_EMAIL &&
    process.env.RESEND_FROM_EMAIL,
  );
  let saved = false;

  if (hasSupabaseLeadStoreConfig()) {
    try {
      const supabase = createSupabaseLeadWriter();
      const { error } = await supabase.from("inquiries").insert({
        full_name: lead.full_name,
        business_name: lead.business_name || null,
        email: lead.email ?? null,
        phone: lead.phone ?? null,
        preferred_contact: lead.preferred_contact,
        service: lead.service,
        package_id: lead.package_id,
        brief: lead.brief,
        budget_range: lead.budget_range,
        preferred_deadline: lead.preferred_deadline,
        attribution: lead.attribution,
        status: "new",
        ...(idempotency
          ? { submission_id: key, submission_hash: fingerprint }
          : {}),
      });
      if (error?.code === "23505" && idempotency) {
        const existing = await supabase
          .from("inquiries")
          .select("submission_hash")
          .eq("submission_id", key!)
          .maybeSingle();
        if (!existing.error && existing.data) {
          if (existing.data.submission_hash !== fingerprint) {
            return privateJson(
              {
                message:
                  "This submission reference has already been used. Please refresh the form.",
              },
              { status: 409 },
            );
          }
          // A stored retry is acknowledged without creating another row or notification.
          return privateJson({ ok: true }, { status: 200 });
        }
      }
      if (error) {
        console.error("Inquiry persistence failed", error.code ?? "unknown");
      } else {
        saved = true;
      }
    } catch {
      console.error("Inquiry persistence failed");
    }
  }

  if (saved) {
    if (emailConfigured) await sendLeadEmail(emailText, key);
    return privateJson(
      { ok: true },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  }

  // In idempotent database mode, an unknown write outcome must not silently
  // switch channels. Retrying the same key safely discovers a committed row.
  if (
    !(idempotency && hasSupabaseLeadStoreConfig()) &&
    emailConfigured &&
    (await sendLeadEmail(emailText, key))
  ) {
    return privateJson(
      { ok: true },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  }

  return privateJson(
    {
      message:
        "The inquiry service is not available right now. Your request was not confirmed. Please contact GROWTHLY on WhatsApp or phone instead.",
    },
    { status: 503 },
  );
}
