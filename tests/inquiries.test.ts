import { describe, expect, it } from "vitest";
import { portfolioPackages } from "@/config/business";
import { validateInquiry } from "@/lib/inquiries";
import { getWhatsAppUrl } from "@/lib/site";

const validInquiry = {
  full_name: "Amina Yusuf",
  business_name: "Nuru Prints",
  email: "amina@example.com",
  phone: "08012345678",
  preferred_contact: "whatsapp",
  service: "website-development",
  package_id: "starter-portfolio",
  brief: "I need a clear portfolio website to introduce my design work and make it easier for clients to enquire.",
  budget_range: "100k-250k",
  preferred_deadline: "flexible",
  website: "",
  attribution: { utm_source: "instagram", utm_campaign: "portfolio-launch" },
};

describe("project inquiry validation", () => {
  it("accepts a complete portfolio website inquiry with whitelisted attribution", () => {
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

  it("rejects a paid portfolio package applied to another service", () => {
    const result = validateInquiry({ ...validInquiry, service: "graphic-design" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown service and an unapproved package", () => {
    expect(validateInquiry({ ...validInquiry, service: "made-up-service" }).success).toBe(false);
    expect(validateInquiry({ ...validInquiry, package_id: "made-up-package" }).success).toBe(false);
  });

  it("rejects campaign attribution fields outside the UTM allow-list", () => {
    const result = validateInquiry({ ...validInquiry, attribution: { ...validInquiry.attribution, email: "leak@example.com" } });
    expect(result.success).toBe(false);
  });

  it("keeps the three configured fixed prices scoped to designer portfolio websites", () => {
    expect(portfolioPackages.map((item) => item.price)).toEqual(["₦50,000", "₦100,000", "₦180,000+"]);
    expect(portfolioPackages.every((item) => item.includes.length > 0 && item.excludes.length > 0 && item.revisions.length > 0)).toBe(true);
  });

  it("creates a WhatsApp deep link from the single configured business number", () => {
    expect(getWhatsAppUrl("Hello GROWTHLY")).toMatch(/^https:\/\/wa\.me\/2348129391626\?text=/);
  });
});
