import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({
  configured: vi.fn(),
  insert: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  admin: vi.fn(),
  update: vi.fn(),
  single: vi.fn(),
  rate: vi.fn(),
}));
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: mocks.rate,
  requestIp: () => "synthetic-test",
}));
vi.mock("@/lib/supabase/server", () => ({
  hasSupabaseLeadStoreConfig: mocks.configured,
  hasSupabaseAuthConfig: mocks.configured,
  createSupabaseLeadWriter: () => ({ from: () => ({ insert: mocks.insert }) }),
  createSupabaseServerClient: async () => ({
    auth: { signInWithPassword: mocks.signIn, signOut: mocks.signOut },
  }),
}));
vi.mock("@/lib/supabase/admin", () => ({ getAdminContext: mocks.admin }));
import { POST as inquiry } from "@/app/api/inquiries/route";
import { POST as login } from "@/app/api/admin/login/route";
import { POST as logout } from "@/app/api/admin/logout/route";
import { PATCH as update } from "@/app/api/admin/leads/[id]/route";
const id = "11111111-1111-4111-8111-111111111111";
const patch = (request: NextRequest) =>
  update(request, { params: Promise.resolve({ id }) });
const lead = {
  full_name: "Synthetic Owner",
  business_name: "Synthetic Business",
  phone: "08012345678",
  preferred_contact: "whatsapp",
  service: "website-development",
  website_type: "Business website",
  package_id: "custom",
  brief: "Synthetic requirements for private API tests only.",
  budget_range: "not-sure",
  preferred_deadline: "flexible",
  consent: true,
};
function request(
  body: string | ReadableStream<Uint8Array>,
  method = "POST",
  headers: Record<string, string> = {},
) {
  return new NextRequest("https://growthly.com.ng/api/test", {
    method,
    headers: {
      origin: "https://growthly.com.ng",
      host: "growthly.com.ng",
      "content-type": "application/json",
      ...headers,
    },
    body,
    duplex: "half",
  } as NonNullable<ConstructorParameters<typeof NextRequest>[1]>);
}
function upload(size: number) {
  const cancel = vi.fn();
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      c.enqueue(new TextEncoder().encode("x".repeat(size)));
    },
    cancel,
  });
  return { stream, cancel };
}
beforeEach(() => {
  vi.stubEnv("ONLINE_INQUIRIES_ENABLED", "true");
  vi.clearAllMocks();
  mocks.configured.mockReturnValue(true);
  mocks.rate.mockReturnValue({ allowed: true, retryAfterSeconds: 0 });
  mocks.insert.mockResolvedValue({ error: null });
  mocks.signIn.mockResolvedValue({
    data: { user: { app_metadata: { role: "admin" } } },
    error: null,
  });
  mocks.signOut.mockResolvedValue({ error: null });
  mocks.single.mockResolvedValue({ data: { id, status: "new" }, error: null });
  mocks.update.mockReturnValue({
    eq: () => ({ select: () => ({ single: mocks.single }) }),
  });
  mocks.admin.mockResolvedValue({
    ok: true,
    supabase: { from: () => ({ update: mocks.update }) },
  });
});
const handlers = [
  {
    name: "enquiry",
    handle: inquiry,
    cap: 24_000,
    method: "POST",
    provider: mocks.insert,
  },
  {
    name: "admin login",
    handle: login,
    cap: 4_096,
    method: "POST",
    provider: mocks.signIn,
  },
  {
    name: "lead update",
    handle: patch,
    cap: 12_000,
    method: "PATCH",
    provider: mocks.update,
  },
];
describe("bounded sensitive APIs (provider mocks, not live acceptance)", () => {
  for (const { name, handle, cap, method, provider } of handlers) {
    it(`${name} rejects stalled uploads with a private 408 and no provider action`, async () => {
      vi.useFakeTimers();
      try {
        const cancel = vi.fn();
        const stream = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(new TextEncoder().encode("{"));
          },
          cancel,
        });
        const pending = handle(request(stream, method));
        await vi.advanceTimersByTimeAsync(15_000);
        const response = await pending;
        expect(response.status).toBe(408);
        expect(response.headers.get("cache-control")).toBe("private, no-store");
        expect(cancel).toHaveBeenCalledOnce();
        expect(provider).not.toHaveBeenCalled();
      } finally {
        vi.useRealTimers();
      }
    });
    it(`${name} rejects chunked oversize before validation/delivery`, async () => {
      const body = upload(cap + 1);
      const response = await handle(request(body.stream, method));
      expect(response.status).toBe(413);
      expect(response.headers.get("cache-control")).toBe("private, no-store");
      expect(body.cancel).toHaveBeenCalledOnce();
      expect(provider).not.toHaveBeenCalled();
      expect(await response.text()).not.toContain("x".repeat(100));
    });
    it(`${name} cannot be bypassed with a small declared length`, async () => {
      const response = await handle(
        request(upload(cap + 1).stream, method, { "content-length": "1" }),
      );
      expect(response.status).toBe(413);
      expect(provider).not.toHaveBeenCalled();
    });
    it(`${name} maps malformed JSON to a private 400 response`, async () => {
      const response = await handle(request("invalid JSON", method));
      expect(response.status).toBe(400);
      expect(response.headers.get("cache-control")).toBe("private, no-store");
      expect(provider).not.toHaveBeenCalled();
    });
    it(`${name} keeps origin rejection ahead of body consumption`, async () => {
      const req = request(upload(cap + 1).stream, method, {
        origin: "https://untrusted.example",
      });
      const reader = vi.spyOn(req.body!, "getReader");
      const response = await handle(req);
      expect(response.status).toBe(403);
      expect(response.headers.get("cache-control")).toBe("private, no-store");
      expect(reader).not.toHaveBeenCalled();
    });
  }
  it("preserves successful enquiry/login/update/logout flows with no-store", async () => {
    const responses = [
      await inquiry(request(JSON.stringify(lead))),
      await login(
        request(
          JSON.stringify({
            email: "test@example.com",
            password: "synthetic-password",
          }),
        ),
      ),
      await patch(request(JSON.stringify({ status: "new" }), "PATCH")),
      await logout(request("")),
    ];
    expect(responses.map((r) => r.status)).toEqual([201, 200, 200, 200]);
    for (const response of responses)
      expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(mocks.insert).toHaveBeenCalledOnce();
    expect(mocks.signIn).toHaveBeenCalledOnce();
    expect(mocks.update).toHaveBeenCalledOnce();
  });
  it("preserves 429 retry headers without reading the blocked upload", async () => {
    mocks.rate.mockReturnValue({ allowed: false, retryAfterSeconds: 60 });
    for (const handle of [inquiry, login]) {
      const req = request(upload(30_000).stream);
      const reader = vi.spyOn(req.body!, "getReader");
      const response = await handle(req);
      expect(response.status).toBe(429);
      expect(response.headers.get("retry-after")).toBe("60");
      expect(response.headers.get("cache-control")).toBe("private, no-store");
      expect(reader).not.toHaveBeenCalled();
    }
  });
  it("leaves admin authorisation ahead of updates/body reads", async () => {
    mocks.admin.mockResolvedValue({ ok: false, reason: "forbidden" });
    const req = request(upload(13_000).stream, "PATCH");
    const reader = vi.spyOn(req.body!, "getReader");
    const response = await patch(req);
    expect(response.status).toBe(403);
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(reader).not.toHaveBeenCalled();
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it("does not enable an unconfigured login or claim delivery", async () => {
    mocks.configured.mockReturnValue(false);
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("RESEND_FROM_EMAIL", "");
    vi.stubEnv("LEADS_EMAIL", "");
    try {
      for (const response of [
        await login(request("{}")),
        await inquiry(request(JSON.stringify(lead))),
      ]) {
        expect(response.status).toBe(503);
        expect(response.headers.get("cache-control")).toBe("private, no-store");
        expect(await response.json()).not.toHaveProperty("ok", true);
      }
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
