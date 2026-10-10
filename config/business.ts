export const business = {
  name: "GROWTHLY",
  tagline: "Helping Businesses Scale Up.",
  description:
    "Practical design, websites and marketing support for Nigerian businesses ready to grow.",
  contact: {
    whatsapp: "08129391626",
    alternativePhone: "09162994183",
  },
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
 * These are the only published fixed-price packages. They apply to portfolio
 * websites for graphic designers, not to every GROWTHLY service.
 * Update this file when scope, availability or pricing changes.
 */
export const portfolioPackages: PackageDefinition[] = [
  {
    id: "starter-portfolio",
    name: "Starter Portfolio",
    price: "₦50,000",
    priceValue: 50000,
    availability: "Availability and start date confirmed after the brief.",
    positioning: "A focused first home on the web for an independent designer.",
    includes: [
      "A tailored, single-page portfolio layout",
      "About, selected work, services and contact sections",
      "A gallery for up to 6 supplied projects",
      "Responsive design for mobile and desktop",
      "Basic page title and description setup",
    ],
    excludes: [
      "Writing or sourcing portfolio content and images",
      "Custom booking, payment or client-login features",
      "Domain registration, hosting and paid third-party tools",
    ],
    timeframe:
      "Delivery timing and start date are confirmed in the written proposal after the brief, scope and content are reviewed.",
    revisions: "2 rounds of consolidated design revisions.",
    separateFees:
      "Domain, hosting, email, subscriptions and any third-party fees are separate.",
    nextStep:
      "Send your brief. GROWTHLY will confirm fit, scope and timing in writing before any work begins.",
  },
  {
    id: "professional-portfolio",
    name: "Professional Portfolio",
    price: "₦100,000",
    priceValue: 100000,
    availability: "Availability and start date confirmed after the brief.",
    positioning: "More room to explain your offer and present a fuller body of work.",
    includes: [
      "Up to 5 coordinated pages, scoped from the agreed brief",
      "A custom visual direction for your portfolio",
      "A gallery for up to 12 supplied projects",
      "Responsive design and clear enquiry calls to action",
      "Basic page title and description setup",
    ],
    excludes: [
      "Writing or sourcing portfolio content and images",
      "Custom booking, payment or client-login features",
      "Domain registration, hosting and paid third-party tools",
    ],
    timeframe:
      "Delivery timing and start date are confirmed in the written proposal after the brief, scope and content are reviewed.",
    revisions: "2 rounds of consolidated design revisions.",
    separateFees:
      "Domain, hosting, email, subscriptions and any third-party fees are separate.",
    nextStep:
      "Send your brief. GROWTHLY will confirm fit, scope and timing in writing before any work begins.",
  },
  {
    id: "premium-creative-studio",
    name: "Premium Creative Studio",
    price: "₦180,000+",
    priceValue: 180000,
    availability: "Availability and start date confirmed after the brief.",
    positioning:
      "A more bespoke portfolio experience for a designer or creative studio with a larger story to tell.",
    includes: [
      "A tailored website plan of up to 8 pages, subject to the agreed scope",
      "Bespoke visual direction and project presentation system",
      "Responsive layouts and clear enquiry pathways",
      "Basic page title and description setup",
      "A handover walkthrough for the delivered site",
    ],
    excludes: [
      "Writing or sourcing portfolio content and images",
      "Custom booking, payment, e-commerce or client-login features",
      "Domain registration, hosting and paid third-party tools",
    ],
    timeframe:
      "Confirmed after reviewing the brief; a larger or more involved scope may take longer.",
    revisions: "3 rounds of consolidated design revisions.",
    separateFees:
      "Domain, hosting, email, subscriptions and any third-party fees are separate.",
    nextStep:
      "Share your goals and references. GROWTHLY will return a written scope and quote for approval.",
  },
];

export const budgetOptions = [
  { value: "under-100k", label: "Below ₦100,000" },
  { value: "100k-250k", label: "₦100,000–₦250,000" },
  { value: "250k-500k", label: "₦250,000–₦500,000" },
  { value: "500k-1m", label: "₦500,000–₦1,000,000" },
  { value: "over-1m", label: "Over ₦1,000,000" },
  { value: "not-sure", label: "I’m not sure yet" },
] as const;
