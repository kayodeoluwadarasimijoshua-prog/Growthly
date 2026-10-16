import { describe, expect, it } from "vitest";
import {
  servicePages,
  getContactService,
  getRouteService,
  getServiceContactHref,
  sentenceServiceName,
  serviceContactMessage,
} from "@/config/service-pages";

describe("public contact context without tracking or arbitrary destinations", () => {
  for (const service of servicePages)
    it(`${service.slug}: context survives contact and quote detours`, () => {
      expect(getContactService(service.slug)).toBe(service);
      expect(getRouteService("/contact", service.slug)).toBe(service);
      expect(getRouteService("/request-a-quote", service.slug)).toBe(service);
      expect(getServiceContactHref(service.slug)).toBe(
        `/contact?service=${service.slug}`,
      );
      expect(serviceContactMessage(service)).toContain(
        sentenceServiceName(service.label),
      );
      expect(getRouteService(service.path, "graphic-design")).toBe(service);
    });
  it("rejects unknown, duplicate and non-string values without echoing or persisting them", () => {
    for (const value of [
      undefined,
      null,
      "unknown",
      "<script>",
      ["ai-video-adverts", "graphic-design"],
      {},
      "https://untrusted.invalid",
    ]) {
      expect(getContactService(value)).toBeUndefined();
      expect(getRouteService("/contact", value)).toBeUndefined();
    }
    expect(getServiceContactHref("https://untrusted.invalid")).toBe("/contact");
    expect(getRouteService("/about", "ai-video-adverts")).toBeUndefined();
  });
  it("keeps generic contact neutral and preserves acronyms", () => {
    expect(serviceContactMessage()).not.toMatch(/website|video|design/i);
    expect(sentenceServiceName("AI video adverts")).toBe("AI video adverts");
    expect(sentenceServiceName("AI & automation")).toBe("AI & automation");
    expect(sentenceServiceName("Graphic design")).toBe("graphic design");
  });
});
