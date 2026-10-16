import { websitePackages } from "@/config/business";

/** Customer-intent keywords, not measured search volumes or ranking promises. */
export const seoPages = {
  home: {
    path: "/",
    title: "Website Design & Development in Nigeria",
    description: `Growthly builds professional business websites and online stores for Nigerian businesses. Website design ${websitePackages[0].price.toLowerCase()}. Get a Website Quote.`,
    primaryKeyword: "website design in Nigeria",
    secondaryKeywords: [
      "website development in Nigeria",
      "website design for small businesses",
    ],
  },
  about: {
    path: "/about",
    title: "About Growthly & Our Website-First Approach",
    description:
      "Meet Growthly’s business-focused approach to website development in Nigeria. Understand our process, responsibilities and separately scoped digital support.",
    primaryKeyword: "Growthly website development",
    secondaryKeywords: [
      "about Growthly",
      "website development company Nigeria",
    ],
  },
  contact: {
    path: "/contact",
    title: "Contact Growthly for Website & Project Enquiries",
    description:
      "Contact Growthly on WhatsApp or phone about websites, design, AI video, social media, promotion or automation. Choose a service-specific brief.",
    primaryKeyword: "contact Growthly",
    secondaryKeywords: ["website design enquiry Nigeria", "Growthly WhatsApp"],
  },
  services: {
    path: "/services",
    title: "Website & Digital Services for Nigerian Businesses",
    description:
      "Explore Growthly website development, graphic design, AI video, social media, advertising and scoped automation services for Nigerian businesses.",
    primaryKeyword: "website and digital services Nigeria",
    secondaryKeywords: [
      "Growthly services",
      "business website development Nigeria",
    ],
  },
  portfolio: {
    path: "/portfolio",
    title: "Website Projects & Independent Design Inspiration",
    description:
      "Explore Growthly’s StarXCO client website and clearly labelled independent website references. See project purpose, design decisions and ideas for your own site.",
    primaryKeyword: "Growthly website projects",
    secondaryKeywords: [
      "business website case study",
      "website design inspiration",
    ],
  },
  development: {
    path: "/website-development",
    title: "Website Development Services in Nigeria",
    description:
      "Professional website development in Nigeria: business websites, online stores, catalogues and landing pages. Explore Growthly’s process and get a scoped quote.",
    primaryKeyword: "website development in Nigeria",
    secondaryKeywords: [
      "web development services Nigeria",
      "website redesign Nigeria",
    ],
  },
  business: {
    path: "/business-websites",
    title: "Business Website Design for Nigerian SMEs",
    description:
      "Business website design for Nigerian SMEs and service providers. Present your services, answer customer questions and make enquiries easier with Growthly.",
    primaryKeyword: "business website design Nigeria",
    secondaryKeywords: [
      "website development for small businesses",
      "small business website design Nigeria",
    ],
  },
  ecommerce: {
    path: "/ecommerce-websites",
    title: "E-commerce Website Development in Nigeria",
    description:
      "Plan an online store with clear product listings, ordering and scoped payment integration. Growthly offers e-commerce website development for Nigerian retailers.",
    primaryKeyword: "e-commerce website development Nigeria",
    secondaryKeywords: [
      "online store website design Nigeria",
      "ecommerce website design Nigeria",
    ],
  },
  pricing: {
    path: "/pricing",
    title: "Website Design Prices & Packages in Nigeria",
    description: `Growthly website prices: Starter ${websitePackages[0].price.toLowerCase()}, Business ${websitePackages[1].price.toLowerCase()}, E-commerce ${websitePackages[2].price.toLowerCase()}. Includes .com.ng domain and hosting for year one.`,
    primaryKeyword: "website design prices Nigeria",
    secondaryKeywords: [
      "cost of a website in Nigeria",
      "website development packages Nigeria",
    ],
  },
} as const;
