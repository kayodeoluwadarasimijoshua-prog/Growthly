import { z } from "zod";
import { servicePages } from "@/config/service-pages";

const text = (max: number, min = 1) =>
  z
    .string()
    .trim()
    .min(min)
    .max(max)
    .refine(
      (v) =>
        !/[<>]/.test(v) &&
        !Array.from(v).some(
          (c) => c.charCodeAt(0) < 32 && ![9, 10, 13].includes(c.charCodeAt(0)),
        ),
      "Use plain text, not HTML.",
    );
export const serviceSlugs = servicePages.map((p) => p.slug) as [
  string,
  ...string[],
];
const publicLink = z
  .string()
  .max(2000)
  .refine((v) => {
    if (v === "") return true;
    try {
      const u = new URL(v);
      const host = u.hostname.toLowerCase().replace(/\.$/, "");
      return (
        u.protocol === "https:" &&
        !u.username &&
        !u.password &&
        !host.startsWith("[") &&
        !/^\d+\.\d+\.\d+\.\d+$/.test(host) &&
        host !== "localhost" &&
        !host.endsWith(".localhost") &&
        host.includes(".") &&
        !host.endsWith(".local") &&
        !host.endsWith(".internal")
      );
    } catch {
      return false;
    }
  }, "Use a public HTTPS URL without credentials.");
export const cmsImageSchema = z
  .object({
    assetId: z.string().uuid(),
    width: z.number().int().min(1).max(1600),
    height: z.number().int().min(1).max(1600),
    alt: text(300, 0),
    credit: text(300, 0),
    permissionConfirmed: z.boolean(),
  })
  .strict();
export const cmsProjectSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]{3,80}$/),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(80),
    name: text(100, 0),
    category: text(150, 0),
    service: z.enum(serviceSlugs),
    kind: z.enum(["client", "demonstration"]),
    liveUrl: publicLink,
    videoUrl: publicLink,
    summary: text(400, 0),
    overview: text(2000, 0),
    creativeIntent: text(1000, 0),
    scope: z
      .array(text(300, 0))
      .max(12)
      .transform((lines) => lines.filter(Boolean)),
    designChoices: z
      .array(text(300, 0))
      .max(12)
      .transform((lines) => lines.filter(Boolean)),
    note: text(1000, 0),
    image: cmsImageSchema.nullable(),
    published: z.boolean(),
    publicationConfirmed: z.boolean(),
    featured: z.boolean(),
  })
  .strict();
const faq = z
  .object({ question: text(200, 5), answer: text(1600, 5) })
  .strict();
export const cmsSettingsSchema = z
  .object({
    whatsapp: z
      .string()
      .regex(
        /^(?:0|\+234)[789][0-9]{9}$/,
        "Use a Nigerian number, e.g. 08129391626 or +2348129391626.",
      ),
    alternativePhone: z.string().regex(/^(?:0|\+234)[789][0-9]{9}$/),
    tagline: text(140),
    homeHeadline: text(160),
    homeEmphasis: text(80, 0),
    homeIntro: text(500, 20),
    aboutIntro: text(700, 20),
    contactIntro: text(500, 20),
    prices: z
      .object({
        starter: z.number().int().min(1000).max(1_000_000_000),
        business: z.number().int().min(1000).max(1_000_000_000),
        ecommerce: z.number().int().min(1000).max(1_000_000_000),
      })
      .strict(),
    websiteFaqs: z.array(faq).min(1).max(20),
    serviceFaqs: z.record(z.enum(serviceSlugs), z.array(faq).min(1).max(12)),
  })
  .strict()
  .refine(
    (s) =>
      s.prices.starter <= s.prices.business &&
      s.prices.business <= s.prices.ecommerce,
    "Keep Starter ≤ Business ≤ E-commerce.",
  );
export const cmsDocumentSchema = z
  .object({
    settings: cmsSettingsSchema,
    projects: z.array(cmsProjectSchema).max(50),
  })
  .strict()
  .superRefine((d, ctx) => {
    for (const key of ["id", "slug"] as const)
      if (new Set(d.projects.map((p) => p[key])).size !== d.projects.length)
        ctx.addIssue({
          code: "custom",
          message: `Each project ${key} must be unique.`,
          path: ["projects"],
        });
    if (d.projects.filter((p) => p.published && p.featured).length > 1)
      ctx.addIssue({
        code: "custom",
        message: "Feature only one website project on Home.",
        path: ["projects"],
      });
    d.projects.forEach((p, i) => {
      if (
        p.featured &&
        (p.service !== "website-development" || p.kind !== "client")
      )
        ctx.addIssue({
          code: "custom",
          message: "Home proof must remain an authentic client website.",
          path: ["projects", i, "featured"],
        });
    });
  });
export type CmsDocument = z.infer<typeof cmsDocumentSchema>;
export type CmsSettings = z.infer<typeof cmsSettingsSchema>;
export type CmsProject = z.infer<typeof cmsProjectSchema>;
export function publicationIssues(
  doc: CmsDocument,
  previous: CmsDocument | null,
) {
  const errors: string[] = [];
  for (const p of doc.projects) {
    if (
      p.published &&
      (!p.name ||
        !p.category ||
        p.summary.length < 10 ||
        p.overview.length < 20 ||
        p.creativeIntent.length < 10 ||
        !p.scope.length ||
        !p.designChoices.length)
    )
      errors.push(
        `${p.name || p.slug}: complete the name, category, summary, overview, purpose, deliverables and decisions before publishing.`,
      );
    if (
      p.published &&
      p.image &&
      (p.image.alt.length < 5 || p.image.credit.length < 5)
    )
      errors.push(
        `${p.name}: add meaningful image alt text and source credit.`,
      );
    if (p.published && !p.publicationConfirmed)
      errors.push(
        `${p.name}: confirm permission to publish the project information.`,
      );
    if (p.published && p.image && !p.image.permissionConfirmed)
      errors.push(
        `${p.name}: confirm image publication permission or remove the image.`,
      );
    const prior = previous?.projects.find(
      (old) => old.id === p.id && old.published,
    );
    if (prior && prior.slug !== p.slug)
      errors.push(
        `${p.name}: a published URL cannot be renamed; archive it and create a new project instead.`,
      );
  }
  return errors;
}
