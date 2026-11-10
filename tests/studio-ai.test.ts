import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock("@/lib/provider-fetch", () => ({ providerFetch: mocks.fetch }));
import {
  studioAIAvailable,
  askStudioAI,
  refinementPreservesFacts,
} from "@/lib/studio-ai";
import { POST as publicAssistant } from "@/app/api/assistant/route";
beforeEach(() => {
  vi.stubEnv("STUDIO_AI_ENABLED", "false");
  vi.stubEnv("PUBLIC_AI_ASSISTANT_ENABLED", "false");
  vi.stubEnv("OPENAI_API_KEY", "");
  vi.stubEnv("OPENAI_MODEL", "");
  vi.clearAllMocks();
});
afterEach(() => vi.unstubAllEnvs());
describe("optional server-only AI", () => {
  it("makes no provider request without deliberate configuration", async () => {
    expect(studioAIAvailable()).toBe(false);
    const response = await publicAssistant(
      new NextRequest("https://growthly.com.ng/api/assistant", {
        method: "POST",
        headers: { origin: "https://growthly.com.ng", host: "growthly.com.ng" },
        body: JSON.stringify({ question: "Which service fits?" }),
      }),
    );
    expect(response.status).toBe(503);
    expect(mocks.fetch).not.toHaveBeenCalled();
    await expect(askStudioAI("instructions", "notes")).rejects.toThrow(
      "AI_NOT_CONFIGURED",
    );
  });
  it("requires a separate public opt-in and validates model configuration", () => {
    vi.stubEnv("STUDIO_AI_ENABLED", "true");
    vi.stubEnv("OPENAI_API_KEY", "synthetic-test-key");
    vi.stubEnv("OPENAI_MODEL", "synthetic-model");
    expect(studioAIAvailable()).toBe(true);
    expect(studioAIAvailable(true)).toBe(false);
    vi.stubEnv("PUBLIC_AI_ASSISTANT_ENABLED", "true");
    expect(studioAIAvailable(true)).toBe(true);
    vi.stubEnv("OPENAI_MODEL", "https://untrusted.invalid");
    expect(studioAIAvailable()).toBe(false);
  });
  it("bounds transport, parses structured output and rejects markup", async () => {
    vi.stubEnv("STUDIO_AI_ENABLED", "true");
    vi.stubEnv("OPENAI_API_KEY", "synthetic-test-key");
    vi.stubEnv("OPENAI_MODEL", "synthetic-model");
    mocks.fetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  text: "A clearer description using the supplied facts.",
                }),
              },
            },
          ],
        }),
      ),
    );
    expect(
      await askStudioAI("Refine only the facts", "Synthetic notes"),
    ).toContain("supplied facts");
    expect(mocks.fetch.mock.calls[0][0]).toBe(
      "https://api.openai.com/v1/chat/completions",
    );
    expect(mocks.fetch.mock.calls[0].slice(2)).toEqual([20000, 64000]);
    mocks.fetch.mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({ text: "<script>invalid</script>" }),
              },
            },
          ],
        }),
      ),
    );
    await expect(askStudioAI("instructions", "notes")).rejects.toThrow();
  });
  it("blocks newly invented numbers and selected unsupported promises", () => {
    expect(
      refinementPreservesFacts(
        "We made 3 flyers.",
        "We designed 3 flyers for the brief.",
      ),
    ).toBe(true);
    expect(
      refinementPreservesFacts(
        "We made 3 flyers.",
        "We increased enquiries by 180%.",
      ),
    ).toBe(false);
    expect(
      refinementPreservesFacts(
        "A product advert.",
        "An advert with guaranteed results.",
      ),
    ).toBe(false);
  });
});
