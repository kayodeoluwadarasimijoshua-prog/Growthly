export const business = {
  name: "GROWTHLY",
  tagline: "Helping Businesses Scale Up.",
  primaryCTA: { label: "Get a Website Quote", href: "/request-a-quote" },
  description:
    "Professional website development for Nigerian businesses. Clear design, practical enquiry paths and a stronger online presence.",
  contact: {
    whatsapp: "08129391626",
    alternativePhone: "09162994183",
  },
} as const;

/** Owner-confirmed first-year bundle, shared by all three website packages. */
export const websiteHostingOffer = {
  domainYears: 1,
  hostingYears: 1,
  domainLabel: "Free .com.ng domain for 1 year (subject to availability)",
  hostingLabel: "Free hosting for 1 year",
  summary:
    "All three website packages include a free .com.ng domain and free hosting for the first year. Domain availability, account ownership and hosting limits are confirmed in your proposal.",
  renewals:
    "Domain and hosting renewals after year one are charged separately; renewal prices and responsibility are confirmed in writing before you commit.",
} as const;

export type PackageDefinition = {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  availability: string;
  positioning: string;
  includes: string[];
  excludes: string[];
  timeframe: string;
  revisions: string;
  separateFees: string;
  nextStep: string;
};

/**
 * Owner-approved starting prices. Final page counts, features and costs are agreed in writing.
 * Update this file when scope, availability or pricing changes.
 */
export const websitePackages: PackageDefinition[] = [
  {
    id: "starter-website",
    priceValue: 100000,
    name: "Starter Website",
    positioning:
      "For a small business that needs a clear, professional first home online.",
    includes: [
      "A multi-page website; final page list agreed in the proposal",
      "Business introduction, services and contact information",
      "Mobile-friendly layout and WhatsApp contact",
      "Page titles, descriptions and search-friendly structure",
    ],
  },
  {
    id: "business-website",
    priceValue: 200000,
    name: "Business Website",
    positioning:
      "For a growing business with more to explain and more ways to enquire.",
    includes: [
      "A multi-page site: home, about, services and contact; final count agreed",
      "Dedicated product or service information",
      "Enquiry functionality and clear calls to action",
      "Analytics or content editing options, when scoped",
    ],
  },
  {
    id: "ecommerce-website",
    priceValue: 300000,
    name: "E-commerce Website",
    positioning:
      "For retailers ready to take products from discovery to ordering.",
    includes: [
      "Storefront, product listings and product detail templates",
      "Product count and category structure agreed in writing",
      "Cart, checkout and payment provider integration when scoped",
      "Order management and a handover walkthrough",
    ],
  },
].map((item) => ({
  ...item,
  includes: [
    ...item.includes,
    websiteHostingOffer.domainLabel,
    websiteHostingOffer.hostingLabel,
  ],
  price: `From ₦${item.priceValue.toLocaleString("en-NG")}`,
  availability: "Start date agreed after reviewing your brief.",
  timeframe:
    "Estimated delivery is confirmed in your proposal, after scope and content review.",
  revisions: "Review rounds and any extra-change charges agreed in writing.",
  separateFees: `${websiteHostingOffer.renewals} Business email, maintenance, paid tools and payment-provider fees are separate unless included in writing.`,
  nextStep: "Receive a written scope and quote before committing.",
  excludes: [
    "Content creation and photography unless scoped.",
    "Ongoing maintenance and third-party subscriptions unless agreed.",
  ],
}));

export const budgetOptions = [
  { value: "under-100k", label: "Below ₦100,000" },
  { value: "100k-250k", label: "₦100,000–₦250,000" },
  { value: "250k-500k", label: "₦250,000–₦500,000" },
  { value: "500k-1m", label: "₦500,000–₦1,000,000" },
  { value: "over-1m", label: "Over ₦1,000,000" },
  { value: "not-sure", label: "I’m not sure yet" },
] as const;

/** Used in visible pricing guidance and FAQs so amounts do not drift. */
export const websitePriceSummary = websitePackages
  .map((p) => `${p.name}: ${p.price.toLowerCase()}`)
  .join("; ");
