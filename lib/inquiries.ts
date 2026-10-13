import { z } from "zod";
import { budgetOptions, websitePackages } from "@/config/business";
import { websiteTypes } from "@/config/websites";
import { services } from "@/config/content";

const optionalEmail = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().email().max(254).optional(),
);

const optionalPhone = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z
    .string()
    .trim()
    .min(7)
    .max(30)
    .regex(/^[0-9+().\s-]+$/, "Enter a valid phone number.")
    .refine((v) => {
      const digits = v.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    }, "Enter a telephone number with 7–15 digits.")
    .optional(),
);

const attributionSchema = z
  .object({
    utm_source: z.string().trim().max(160).optional(),
    utm_medium: z.string().trim().max(160).optional(),
    utm_campaign: z.string().trim().max(160).optional(),
    utm_term: z.string().trim().max(160).optional(),
    utm_content: z.string().trim().max(160).optional(),
  })
  .strict()
  .default({});

export const inquirySchema = z
  .object({
    full_name: z.string().trim().min(2).max(120),
    business_name: z.string().trim().min(2).max(140),
    consent: z.literal(true),
    website_type: z.enum(websiteTypes),
    existing_url: z
      .union([
        z.literal(""),
        z
          .url()
          .max(500)
          .refine(
            (v) => /^https?:\/\//.test(v),
            "Use an http or https website URL.",
          ),
      ])
      .default(""),
    industry: z.string().trim().max(140).default(""),
    required_features: z.string().trim().max(600).default(""),
    email: optionalEmail,
    phone: optionalPhone,
    preferred_contact: z.enum(["whatsapp", "email", "phone"]),
    service: z
      .string()
      .trim()
      .refine(
        (value) => services.some((item) => item.slug === value),
        "Choose a listed service.",
      ),
    package_id: z
      .string()
      .trim()
      .max(80)
      .refine(
        (value) =>
          value === "custom" ||
          websitePackages.some((item) => item.id === value),
        "Choose a listed package.",
      ),
    brief: z.string().trim().min(20).max(2400),
    budget_range: z
      .string()
      .refine(
        (value) => budgetOptions.some((option) => option.value === value),
        "Choose a budget range.",
      ),
    preferred_deadline: z
      .string()
      .trim()
      .min(1)
      .max(30)
      .refine((value) => {
        if (
          ["flexible", "within-2-weeks", "2-4-weeks", "1-2-months"].includes(
            value,
          )
        )
          return true;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
        const parsed = new Date(`${value}T00:00:00.000Z`);
        return (
          !Number.isNaN(parsed.valueOf()) &&
          parsed.toISOString().slice(0, 10) === value
        );
      }, "Choose a valid preferred date or timeframe."),
    website: z.string().max(500).optional().default(""),
    attribution: attributionSchema,
  })
  .strict()
  .superRefine((value, context) => {
    if (!value.phone) {
      context.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Provide a telephone or WhatsApp number.",
      });
    }
    if (value.preferred_contact === "email" && !value.email) {
      context.addIssue({
        code: "custom",
        path: ["email"],
        message:
          "An email address is needed for your preferred contact method.",
      });
    }
    if (
      (value.preferred_contact === "whatsapp" ||
        value.preferred_contact === "phone") &&
      !value.phone
    ) {
      context.addIssue({
        code: "custom",
        path: ["phone"],
        message: "A phone number is needed for your preferred contact method.",
      });
    }
    if (
      value.package_id !== "custom" &&
      value.service !== "website-development"
    ) {
      context.addIssue({
        code: "custom",
        path: ["package_id"],
        message: "These packages apply to website-development projects.",
      });
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(value.preferred_deadline)) {
      const today = new Date().toISOString().slice(0, 10);
      if (value.preferred_deadline < today) {
        context.addIssue({
          code: "custom",
          path: ["preferred_deadline"],
          message: "Choose a future date or a flexible timeframe.",
        });
      }
    }
  });

export type InquirySubmission = z.infer<typeof inquirySchema>;

export function validateInquiry(input: unknown) {
  return inquirySchema.safeParse(input);
}
