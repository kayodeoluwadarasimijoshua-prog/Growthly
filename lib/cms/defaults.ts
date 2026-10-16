import { business, websitePackages } from "@/config/business";
import { projects } from "@/config/content";
import { websiteFAQs } from "@/config/websites";
import { serviceMarketing } from "@/config/service-marketing";
import { servicePages } from "@/config/service-pages";
import type { CmsDocument } from "./schema";

export function defaultCmsDocument(): CmsDocument {
  const tokens = Object.fromEntries(
    websitePackages.map((p, i) => [
      `₦${p.priceValue.toLocaleString("en-NG")}`,
      `{{${["starter", "business", "ecommerce"][i]}_amount}}`,
    ]),
  );
  const websiteFaqs = websiteFAQs.map(([question, answer]) => ({
    question,
    answer: answer.replace(
      /₦(?:100,000|200,000|300,000)(?![0-9]|,[0-9])/g,
      (m) => tokens[m],
    ),
  }));
  return {
    settings: {
      whatsapp: business.contact.whatsapp,
      alternativePhone: business.contact.alternativePhone,
      tagline: business.tagline,
      homeHeadline: "Your business deserves more than just",
      homeEmphasis: "social media.",
      homeIntro:
        "Get a professional website that helps customers discover your business, explore your products or services, and contact you with confidence.",
      aboutIntro:
        "Growthly develops professional websites for Nigerian businesses, with design and marketing support available for separately agreed needs. Our focus is on making your offer clear and the next step easy.",
      contactIntro:
        "Ask a question about {{service}}, share your goal and discuss the next step. Scope, cost and timing are agreed before you commit.",
      prices: { starter: 100000, business: 200000, ecommerce: 300000 },
      websiteFaqs,
      serviceFaqs: Object.fromEntries(
        servicePages.map((p) => [
          p.slug,
          p.slug === "website-development"
            ? websiteFaqs
            : serviceMarketing[p.slug].faqs.map(([question, answer]) => ({
                question,
                answer,
              })),
        ]),
      ),
    },
    projects: projects.map((p) => ({
      id: p.slug,
      slug: p.slug,
      name: p.name,
      category: p.category,
      service: "website-development",
      kind: "client",
      liveUrl: p.liveUrl,
      videoUrl: "",
      summary: p.summary,
      overview: p.overview,
      creativeIntent: p.creativeIntent,
      scope: [...p.scope],
      designChoices: [...p.designChoices],
      note: p.note,
      image: null,
      published: true,
      publicationConfirmed: true,
      featured: true,
    })),
  };
}
