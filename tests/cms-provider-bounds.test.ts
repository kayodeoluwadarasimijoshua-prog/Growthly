import { beforeEach, afterEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ server: vi.fn(), writer: vi.fn() }));
vi.mock("@supabase/ssr", () => ({ createServerClient: mocks.server }));
vi.mock("@supabase/supabase-js", () => ({ createClient: mocks.writer }));
vi.mock("next/headers", () => ({
  cookies: async () => ({ getAll: () => [], set: vi.fn() }),
}));
import {
  createSupabaseServerClient,
  createSupabaseLeadWriter,
} from "@/lib/supabase/server";
import { providerFetch } from "@/lib/provider-fetch";
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://synthetic.invalid");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "synthetic-anon");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "synthetic-server-only");
});
afterEach(() => vi.unstubAllEnvs());
it("keeps owner/public-provider reads within the bounded transport, without hidden SDK retries", async () => {
  await createSupabaseServerClient();
  createSupabaseLeadWriter();
  for (const factory of [mocks.server, mocks.writer]) {
    expect(factory.mock.calls[0][2].db.retry).toBe(false);
    expect(factory.mock.calls[0][2].global.fetch).toBe(providerFetch);
  }
  expect(mocks.writer.mock.calls[0][1]).toBe("synthetic-server-only");
  expect(mocks.writer.mock.calls[0][2].auth.persistSession).toBe(false);
});
