import { z } from "zod";
import { budgetOptions, portfolioPackages } from "@/config/business";
import { services } from "@/config/content";

const optionalEmail = z.preprocess(
  (value) => typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().email().max(254).optional(),
);

const optionalPhone = z.preprocess(
  (value) => typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().min(7).max(30).regex(/^[0-9+().\s-]+$/, "Enter a valid phone number.").optional(),
);

const attributionSchema = z.object({
  utm_source: z.string().trim().max(160).optional(),
  utm_medium: z.string().trim().max(160).optional(),
  utm_campaign: z.string().trim().max(160).optional(),
  utm_term: z.string().trim().max(160).optional(),
  utm_content: z.string().trim().max(160).optional(),
}).strict().default({});

const inquirySchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  business_name: z.string().trim().max(140).optional().default(""),
  email: optionalEmail,
  phone: optionalPhone,
  preferred_contact: z.enum(["whatsapp", "email", "phone"]),
  service: z.string().trim().refine((value) => services.some((item) => item.slug === value), "Choose a listed service."),
  package_id: z.string().trim().max(80).refine(
    (value) => value === "custom" || portfolioPackages.some((item) => item.id === value),
    "Choose a listed package.",
  ),
  brief: z.string().trim().min(20).max(4000),
  budget_range: z.string().refine((value) => budgetOptions.some((option) => option.value === value), "Choose a budget range."),
  preferred_deadline: z.string().trim().min(1).max(30).refine((value) => {
    if (["flexible", "within-2-weeks", "2-4-weeks", "1-2-months"].includes(value)) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
  }, "Choose a valid preferred date or timeframe."),
  website: z.string().max(500).optional().default(""),
  attribution: attributionSchema,
}).strict().superRefine((value, context) => {
  if (!value.email && !value.phone) {
    context.addIssue({ code: "custom", path: ["email"], message: "Provide an email address or phone number." });
  }
  if (value.preferred_contact === "email" && !value.email) {
    context.addIssue({ code: "custom", path: ["email"], message: "An email address is needed for your preferred contact method." });
  }
  if ((value.preferred_contact === "whatsapp" || value.preferred_contact === "phone") && !value.phone) {
    context.addIssue({ code: "custom", path: ["phone"], message: "A phone number is needed for your preferred contact method." });
  }
  if (value.package_id !== "custom" && value.service !== "website-development") {
    context.addIssue({ code: "custom", path: ["package_id"], message: "These packages are only for graphic-designer portfolio websites." });
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(value.preferred_deadline)) {
    const today = new Date().toISOString().slice(0, 10);
    if (value.preferred_deadline < today) {
      context.addIssue({ code: "custom", path: ["preferred_deadline"], message: "Choose a future date or a flexible timeframe." });
    }
  }
});

export type InquirySubmission = z.infer<typeof inquirySchema>;

export function validateInquiry(input: unknown) {
  return inquirySchema.safeParse(input);
}
