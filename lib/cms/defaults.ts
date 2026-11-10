import { business, websitePackages } from "@/config/business";
import { projects } from "@/config/content";
import { websiteFAQs } from "@/config/websites";
import { serviceMarketing } from "@/config/service-marketing";
import { servicePages } from "@/config/service-pages";
import { studioIntroductions } from "@/config/studio-copy";
import { initialTeam } from "@/config/team";
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
    team: initialTeam.map((member) => ({ ...member })),
    settings: {
      whatsapp: business.contact.whatsapp,
      alternativePhone: business.contact.alternativePhone,
      tagline: business.tagline,
      ...studioIntroductions,
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
    // Seed client work only. Demonstration templates are added deliberately in
    // the editor; never inject them into an existing stored publication.
    projects: projects
      .filter((p) => p.kind === "client")
      .map((p) => ({
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
