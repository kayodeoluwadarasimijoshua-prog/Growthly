import { NextResponse, type NextRequest } from "next/server";
import { budgetOptions } from "@/config/business";
import { services } from "@/config/content";
import { validateInquiry } from "@/lib/inquiries";
import { checkRateLimit, requestIp } from "@/lib/rate-limit";
import { isSameOriginRequest } from "@/lib/request-security";
import { createSupabaseLeadWriter, hasSupabaseLeadStoreConfig } from "@/lib/supabase/server";

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
  const serviceName = services.find((item) => item.slug === lead.service)?.title ?? lead.service;
  const budget = budgetOptions.find((item) => item.value === lead.budget_range)?.label ?? lead.budget_range;
  const attribution = Object.entries(lead.attribution).map(([key, value]) => `${key}: ${value}`).join("\n") || "None";
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

async function sendLeadEmail(text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const destination = process.env.LEADS_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !destination || !from) return false;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
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
    return true;
  } catch {
    console.error("Lead email delivery failed");
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ message: "This request could not be accepted." }, { status: 403 });
  }

  const ip = requestIp(request);
  const limit = checkRateLimit(`inquiry:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests from this connection. Please wait a few minutes or contact GROWTHLY directly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ message: "The request is too large. Please shorten your brief and try again." }, { status: 413 });
  }

  let input: unknown;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) {
      return NextResponse.json({ message: "The request is too large. Please shorten your brief and try again." }, { status: 413 });
    }
    input = JSON.parse(body);
  } catch {
    return NextResponse.json({ message: "Please check the form and try again." }, { status: 400 });
  }

  const parsed = validateInquiry(input);
  if (!parsed.success) {
    return NextResponse.json({ message: "Check the required fields and contact details, then try again." }, { status: 400 });
  }
  const lead = parsed.data;
  if (lead.website.trim()) {
    return NextResponse.json({ message: "This request could not be accepted. Please check the form and try again." }, { status: 400 });
  }

  const emailText = leadEmailText(lead);
  const emailConfigured = Boolean(process.env.RESEND_API_KEY && process.env.LEADS_EMAIL && process.env.RESEND_FROM_EMAIL);
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
      });
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
    if (emailConfigured) await sendLeadEmail(emailText);
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  if (emailConfigured && await sendLeadEmail(emailText)) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  return NextResponse.json(
    {
      message: "The inquiry service is not available right now. Your request was not confirmed. Please contact GROWTHLY on WhatsApp or phone instead.",
    },
    { status: 503 },
  );
}
