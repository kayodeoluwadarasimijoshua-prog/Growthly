import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({
  configured: vi.fn(),
  insert: vi.fn(),
  existing: vi.fn(),
}));
vi.mock("@/lib/supabase/server", () => ({
  hasSupabaseLeadStoreConfig: mocks.configured,
  createSupabaseLeadWriter: () => ({
    from: () => ({
      insert: mocks.insert,
      select: () => ({ eq: () => ({ maybeSingle: mocks.existing }) }),
    }),
  }),
}));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: () => ({ allowed: true }),
  requestIp: () => "test",
}));
import { services } from "@/config/content";
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
const request = (body = payload, key?: string) =>
  new NextRequest("https://growthly.com.ng/api/inquiries", {
    method: "POST",
    headers: {
      origin: "https://growthly.com.ng",
      host: "growthly.com.ng",
      "content-type": "application/json",
      ...(key ? { "idempotency-key": key } : {}),
    },
    body: JSON.stringify(body),
  });
beforeEach(() => {
  vi.stubEnv("ONLINE_INQUIRIES_ENABLED", "true");
  vi.stubEnv("INQUIRY_IDEMPOTENCY_ENABLED", "false");
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
  for (const service of services.filter(
    (s) => s.slug !== "website-development",
  )) {
    it(`preserves ${service.slug} in private storage (mock)`, async () => {
      mocks.configured.mockReturnValue(true);
      mocks.insert.mockResolvedValue({ error: null });
      const r = await POST(
        request({
          ...payload,
          service: service.slug,
          website_type: "",
          package_id: "custom",
        }),
      );
      expect(r.status).toBe(201);
      const row = mocks.insert.mock.calls[0][0];
      expect(row.service).toBe(service.slug);
      expect(row.package_id).toBe("custom");
      expect(row.brief).not.toContain("Website type:");
      expect(row.brief).toContain("Privacy consent: accepted");
    });
    it(`names ${service.slug} in the email payload (mock)`, async () => {
      vi.stubEnv("RESEND_API_KEY", "test-key");
      vi.stubEnv("RESEND_FROM_EMAIL", "test@example.com");
      vi.stubEnv("LEADS_EMAIL", "owner@example.com");
      const send = vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ id: "mock-receipt" }), { status: 200 }),
        );
      vi.stubGlobal("fetch", send);
      const r = await POST(
        request({
          ...payload,
          service: service.slug,
          website_type: "",
          package_id: "custom",
        }),
      );
      expect(r.status).toBe(201);
      const body = JSON.parse(send.mock.calls[0][1].body);
      expect(body.text).toContain(`Service: ${service.title}`);
      expect(body.text).not.toContain("Website type:");
    });
  }
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
      vi.fn().mockResolvedValue(
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

describe("retry-safe enquiry delivery (mock providers)", () => {
  const key = "11111111-1111-4111-8111-111111111111";
  it("keeps legacy database inserts unchanged until migration approval", async () => {
    mocks.configured.mockReturnValue(true);
    mocks.insert.mockResolvedValue({ error: null });
    expect((await POST(request(payload, key))).status).toBe(201);
    expect(mocks.insert.mock.calls[0][0]).not.toHaveProperty("submission_id");
  });
  it("requires a valid retry reference in approved database mode", async () => {
    vi.stubEnv("INQUIRY_IDEMPOTENCY_ENABLED", "true");
    expect((await POST(request())).status).toBe(400);
    expect((await POST(request(payload, "bad-key"))).status).toBe(400);
    expect(mocks.insert).not.toHaveBeenCalled();
  });
  it("acknowledges a matching stored retry without another owner notification", async () => {
    vi.stubEnv("INQUIRY_IDEMPOTENCY_ENABLED", "true");
    mocks.configured.mockReturnValue(true);
    mocks.insert.mockResolvedValueOnce({ error: null });
    expect((await POST(request(payload, key))).status).toBe(201);
    const hash = mocks.insert.mock.calls[0][0].submission_hash;
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    mocks.insert.mockResolvedValue({ error: { code: "23505" } });
    mocks.existing.mockResolvedValue({
      data: { submission_hash: hash },
      error: null,
    });
    vi.stubEnv("RESEND_API_KEY", "synthetic-key");
    vi.stubEnv("RESEND_FROM_EMAIL", "test@example.com");
    vi.stubEnv("LEADS_EMAIL", "owner@example.com");
    const send = vi.fn();
    vi.stubGlobal("fetch", send);
    const response = await POST(request(payload, key));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });
  it("rejects reuse of a stored reference with changed data", async () => {
    vi.stubEnv("INQUIRY_IDEMPOTENCY_ENABLED", "true");
    mocks.configured.mockReturnValue(true);
    mocks.insert.mockResolvedValue({ error: { code: "23505" } });
    mocks.existing.mockResolvedValue({
      data: { submission_hash: "different" },
      error: null,
    });
    expect((await POST(request(payload, key))).status).toBe(409);
  });
  it("does not switch channels after an unknown idempotent database outcome", async () => {
    vi.stubEnv("INQUIRY_IDEMPOTENCY_ENABLED", "true");
    mocks.configured.mockReturnValue(true);
    mocks.insert.mockRejectedValue(new Error("timeout"));
    vi.stubEnv("RESEND_API_KEY", "synthetic-key");
    vi.stubEnv("RESEND_FROM_EMAIL", "test@example.com");
    vi.stubEnv("LEADS_EMAIL", "owner@example.com");
    const send = vi.fn();
    vi.stubGlobal("fetch", send);
    expect((await POST(request(payload, key))).status).toBe(503);
    expect(send).not.toHaveBeenCalled();
  });
  it("forwards retry references to the existing email provider", async () => {
    vi.stubEnv("RESEND_API_KEY", "synthetic-key");
    vi.stubEnv("RESEND_FROM_EMAIL", "test@example.com");
    vi.stubEnv("LEADS_EMAIL", "owner@example.com");
    const send = vi
      .fn()
      .mockResolvedValue(new Response('{"id":"synthetic-receipt"}'));
    vi.stubGlobal("fetch", send);
    expect((await POST(request(payload, key))).status).toBe(201);
    expect(send.mock.calls[0][1].headers["Idempotency-Key"]).toBe(
      `growthly-enquiry/${key}`,
    );
  });
});

it("does not activate online lead collection merely because CMS/provider credentials exist", async () => {
  vi.stubEnv("ONLINE_INQUIRIES_ENABLED", "false");
  mocks.configured.mockReturnValue(true);
  expect((await POST(request())).status).toBe(503);
  expect(mocks.insert).not.toHaveBeenCalled();
});
