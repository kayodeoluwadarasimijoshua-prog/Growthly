import { describe, expect, it } from "vitest";
import { services } from "@/config/content";
import { resolveInquiryService } from "@/lib/inquiry-context";
import { validateInquiry } from "@/lib/inquiries";

const base = {
  full_name: "Synthetic Owner",
  business_name: "Synthetic Business",
  phone: "08012345678",
  preferred_contact: "whatsapp",
  consent: true,
  brief: "Synthetic project brief for routing tests only.",
  package_id: "custom",
  budget_range: "not-sure",
  preferred_deadline: "flexible",
};
describe("validated service context", () => {
  for (const service of services) {
    it(`resolves ${service.slug} without changing its identity`, () => {
      expect(resolveInquiryService(service.slug)).toEqual(service);
    });
    it(`accepts correctly shaped ${service.slug} enquiries`, () => {
      const result = validateInquiry({
        ...base,
        service: service.slug,
        website_type:
          service.slug === "website-development" ? "Business website" : "",
      });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.service).toBe(service.slug);
    });
  }
  it("uses the primary offer for unknown, duplicate and absent query values", () => {
    for (const value of [
      undefined,
      "",
      "unknown",
      ["graphic-design", "digital-advertising"],
      "<script>",
    ])
      expect(resolveInquiryService(value).slug).toBe("website-development");
  });
  it("still requires a website type for website enquiries", () => {
    expect(
      validateInquiry({
        ...base,
        service: "website-development",
        website_type: "",
      }).success,
    ).toBe(false);
  });
  it("rejects website fields/packages attached to supporting-service enquiries", () => {
    expect(
      validateInquiry({
        ...base,
        service: "graphic-design",
        website_type: "Business website",
      }).success,
    ).toBe(false);
    expect(
      validateInquiry({
        ...base,
        service: "graphic-design",
        website_type: "",
        package_id: "starter-website",
      }).success,
    ).toBe(false);
  });
});
