import { describe, expect, it } from "vitest";
import { websitePackages } from "@/config/business";
import { validateInquiry } from "@/lib/inquiries";
import { getWhatsAppUrl } from "@/lib/site";

const validInquiry = {
  full_name: "Amina Yusuf",
  business_name: "Nuru Prints",
  consent: true,
  website_type: "Business website",
  email: "amina@example.com",
  phone: "08012345678",
  preferred_contact: "whatsapp",
  service: "website-development",
  package_id: "starter-website",
  brief:
    "I need a clear portfolio website to introduce my design work and make it easier for clients to enquire.",
  budget_range: "100k-250k",
  preferred_deadline: "flexible",
  website: "",
  attribution: { utm_source: "instagram", utm_campaign: "portfolio-launch" },
};

describe("project inquiry validation", () => {
  it("accepts a complete website inquiry with whitelisted attribution", () => {
    const result = validateInquiry(validInquiry);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.attribution.utm_source).toBe("instagram");
      expect(result.data.service).toBe("website-development");
    }
  });

  it("accepts either email or phone when the selected contact method is available", () => {
    const result = validateInquiry({
      ...validInquiry,
      email: "",
      preferred_contact: "whatsapp",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBeUndefined();
  });

  it("rejects an inquiry with no return contact", () => {
    const result = validateInquiry({ ...validInquiry, email: "", phone: "" });
    expect(result.success).toBe(false);
  });

  it("rejects a website package applied to another service", () => {
    const result = validateInquiry({
      ...validInquiry,
      service: "graphic-design",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown service and an unapproved package", () => {
    expect(
      validateInquiry({ ...validInquiry, service: "made-up-service" }).success,
    ).toBe(false);
    expect(
      validateInquiry({ ...validInquiry, package_id: "made-up-package" })
        .success,
    ).toBe(false);
  });

  it("rejects campaign attribution fields outside the UTM allow-list", () => {
    const result = validateInquiry({
      ...validInquiry,
      attribution: { ...validInquiry.attribution, email: "leak@example.com" },
    });
    expect(result.success).toBe(false);
  });

  it("publishes the owner-approved starting prices with clear scope", () => {
    expect(websitePackages.map((item) => item.price)).toEqual([
      "From ₦100,000",
      "From ₦200,000",
      "From ₦300,000",
    ]);
    expect(
      websitePackages.every(
        (item) =>
          item.includes.length > 0 &&
          item.excludes.length > 0 &&
          item.revisions.length > 0,
      ),
    ).toBe(true);
  });

  it("requires business name, telephone and consent", () => {
    for (const missing of [
      { business_name: "" },
      { phone: "" },
      { consent: false },
      { website_type: "Unknown" },
    ])
      expect(validateInquiry({ ...validInquiry, ...missing }).success).toBe(
        false,
      );
  });
  it("rejects non-web existing URLs", () => {
    expect(
      validateInquiry({ ...validInquiry, existing_url: "javascript:alert(1)" })
        .success,
    ).toBe(false);
  });
  it("creates a WhatsApp deep link from the single configured business number", () => {
    expect(getWhatsAppUrl("Hello GROWTHLY")).toMatch(
      /^https:\/\/wa\.me\/2348129391626\?text=/,
    );
  });
});
