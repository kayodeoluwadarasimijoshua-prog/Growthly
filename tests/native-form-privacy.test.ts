import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/inquiries/fallback/route";

afterEach(() => vi.unstubAllGlobals());
function nativeRequest(query = "", origin = "https://growthly.com.ng") {
  return new Request(`https://growthly.com.ng/api/inquiries/fallback${query}`, {
    method: "POST",
    headers: {
      origin,
      host: "growthly.com.ng",
      "content-type": "application/x-www-form-urlencoded",
    },
    body: "full_name=Synthetic+Owner&phone=08012345678&brief=Synthetic+private+brief",
  });
}
describe("native form privacy safety net", () => {
  it("redirects without reading, forwarding or echoing any personal fields", async () => {
    const request = nativeRequest();
    const text = vi.spyOn(request, "text");
    const json = vi.spyOn(request, "json");
    const formData = vi.spyOn(request, "formData");
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const response = await POST(request);
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "/request-a-quote?form=fallback",
    );
    expect(await response.text()).toBe("");
    expect(text).not.toHaveBeenCalled();
    expect(json).not.toHaveBeenCalled();
    expect(formData).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
  it("drops incoming query strings and cannot be used as an open redirect", async () => {
    const response = await POST(
      nativeRequest("?full_name=Synthetic&next=https://example.com"),
    );
    expect(response.headers.get("location")).toBe(
      "/request-a-quote?form=fallback",
    );
  });
  it("prevents caching and referrer leakage", async () => {
    const response = await POST(nativeRequest());
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("referrer-policy")).toBe("no-referrer");
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });
  it("refuses cross-origin submissions without touching the body", async () => {
    const request = nativeRequest("", "https://untrusted.example");
    const text = vi.spyOn(request, "text");
    const response = await POST(request);
    expect(response.status).toBe(403);
    expect(text).not.toHaveBeenCalled();
    expect(response.headers.get("location")).toBeNull();
    expect(await response.text()).not.toContain("08012345678");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});
