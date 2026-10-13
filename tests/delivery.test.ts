import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({ configured: vi.fn(), insert: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  hasSupabaseLeadStoreConfig: mocks.configured,
  createSupabaseLeadWriter: () => ({ from: () => ({ insert: mocks.insert }) }),
}));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: () => ({ allowed: true }),
  requestIp: () => "test",
}));
import { POST } from "@/app/api/inquiries/route";
const payload = {
  full_name: "Test Owner",
  business_name: "Test Business",
  phone: "08012345678",
  email: "owner@example.com",
  preferred_contact: "whatsapp",
  service: "website-development",
  website_type: "Business website",
  package_id: "custom",
  brief: "A professional website with clear product and enquiry information.",
  budget_range: "not-sure",
  preferred_deadline: "flexible",
  consent: true,
  website: "",
  existing_url: "https://example.com",
  required_features: "WhatsApp enquiries",
  industry: "Retail",
};
const request = (body = payload) =>
  new NextRequest("https://growthly.com.ng/api/inquiries", {
    method: "POST",
    headers: {
      origin: "https://growthly.com.ng",
      host: "growthly.com.ng",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("RESEND_FROM_EMAIL", "");
  vi.stubEnv("LEADS_EMAIL", "");
  mocks.configured.mockReturnValue(false);
  mocks.insert.mockReset();
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe("confirmed enquiry delivery (provider mocks, not live delivery)", () => {
  it("does not claim receipt without a configured delivery system", async () => {
    const r = await POST(request());
    expect(r.status).toBe(503);
    expect(await r.json()).not.toHaveProperty("ok", true);
  });
  it("confirms a successful private store insert and preserves requirements", async () => {
    mocks.configured.mockReturnValue(true);
    mocks.insert.mockResolvedValue({ error: null });
    const r = await POST(request());
    expect(r.status).toBe(201);
    expect(await r.json()).toEqual({ ok: true });
    const row = mocks.insert.mock.calls[0][0];
    expect(row.brief).toContain("Website type: Business website");
    expect(row.brief).toContain("Privacy consent: accepted");
    expect(row.brief).toContain("Features: WhatsApp enquiries");
  });
  it("fails safely when storage fails", async () => {
    mocks.configured.mockReturnValue(true);
    mocks.insert.mockResolvedValue({ error: { code: "TEST" } });
    expect((await POST(request())).status).toBe(503);
  });
  it("confirms an accepted email, not merely an HTTP 200", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("RESEND_FROM_EMAIL", "test@example.com");
    vi.stubEnv("LEADS_EMAIL", "owner@example.com");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ id: "provider-receipt" }), {
            status: 200,
          }),
        ),
    );
    expect((await POST(request())).status).toBe(201);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("{}", { status: 200 })),
    );
    expect((await POST(request())).status).toBe(503);
  });
  it("rejects missing privacy consent before delivery", async () => {
    mocks.configured.mockReturnValue(true);
    expect((await POST(request({ ...payload, consent: false }))).status).toBe(
      400,
    );
    expect(mocks.insert).not.toHaveBeenCalled();
  });
});
