import { websitePriceSummary, websiteHostingOffer } from "@/config/business";

export const websiteTypes = [
  "Business website",
  "E-commerce website",
  "School website",
  "Real estate website",
  "Landing page",
  "Website redesign",
  "Other",
] as const;
export const websiteSolutions = [
  {
    name: "Business websites",
    summary:
      "Give customers a clear picture of your business, services and next steps.",
    href: "/business-websites",
    icon: "01",
  },
  {
    name: "E-commerce & online stores",
    summary:
      "Present products and build a suitable route to ordering and payment.",
    href: "/ecommerce-websites",
    icon: "02",
  },
  {
    name: "Product catalogues",
    summary:
      "Organise products, specifications and prices with a direct enquiry route.",
    href: "/request-a-quote?type=Other",
    icon: "03",
  },
  {
    name: "Real estate websites",
    summary:
      "Make listings easy to explore and property enquiries easy to send.",
    href: "/request-a-quote?type=Real%20estate%20website",
    icon: "04",
  },
  {
    name: "School & education websites",
    summary:
      "Help parents find programmes, admissions information and school contacts.",
    href: "/request-a-quote?type=School%20website",
    icon: "05",
  },
  {
    name: "Campaign landing pages",
    summary:
      "Give an advert one focused destination and one clear next action.",
    href: "/request-a-quote?type=Landing%20page",
    icon: "06",
  },
  {
    name: "Website redesigns",
    summary:
      "Improve outdated layouts, confusing navigation and difficult enquiry flows.",
    href: "/request-a-quote?type=Website%20redesign",
    icon: "07",
  },
];
export const industries = [
  [
    "Retailers & boutiques",
    "Product collections, size information, store details and ordering options.",
  ],
  [
    "Perfume & beauty",
    "Product stories, clear categories and helpful purchase or enquiry paths.",
  ],
  [
    "Real estate website development",
    "Property photos, listing details, location information and viewing enquiries.",
  ],
  [
    "Website design for schools",
    "Admissions guidance, programmes, term information and parent enquiries.",
  ],
  [
    "Professional services",
    "Explain your expertise, service scope and how a potential client can get started.",
  ],
  [
    "Restaurants & hospitality",
    "Menus, opening hours, room information and booking or reservation enquiries.",
  ],
  [
    "Other small businesses",
    "A practical online presence based on what your customers need to know.",
  ],
] as const;
export const websiteFAQs = [
  [
    "How much does a business website cost?",
    `${websitePriceSummary}. These are starting design-and-development prices, not a fixed quote for every project. Pages, content and integrations affect the final cost. ${websiteHostingOffer.summary} ${websiteHostingOffer.renewals} Maintenance and third-party fees are separate unless agreed in writing.`,
  ],
  [
    "How long does a website take to build?",
    "We estimate delivery after reviewing your scope. Content readiness, feedback, revision rounds and payment or booking integrations affect the timeline. A desired date is a preference, not a confirmed booking.",
  ],
  [
    "Will the website work on mobile phones?",
    "Yes. Responsive layouts and mobile usability checks are part of our website-development approach. We design for customers browsing on phones as well as larger screens.",
  ],
  [
    "Can customers contact us through WhatsApp?",
    "Yes. We can connect clear enquiry buttons to your approved business WhatsApp number with a useful prefilled message.",
  ],
  [
    "Can customers order or pay online?",
    "Yes, when included in the agreed scope. We can plan catalogue enquiries, online ordering or a store with checkout. Payment-provider account approval and transaction fees remain separate.",
  ],
  [
    "Will our website appear on Google?",
    "We build crawlable pages with useful headings and metadata. Indexing and rankings depend on search engines, competition and ongoing content; search visibility takes time and cannot be guaranteed.",
  ],
  [
    "Do we need to buy a domain?",
    `${websiteHostingOffer.summary} If you already own a domain, we can assess its setup. ${websiteHostingOffer.renewals} Business email and other domain extensions are separately scoped.`,
  ],
  [
    "Who provides website content and images?",
    "You normally supply approved business information, product details, brand assets and images you have permission to use. Writing, photography and licensed assets can be separately scoped.",
  ],
  [
    "Can Growthly redesign an existing website?",
    "Yes. We first review your current pages, useful content, hosting and enquiry flows. We plan redirects and protect existing email and domain services before making changes.",
  ],
  [
    "Do you offer maintenance?",
    "Maintenance and updates can be agreed separately. A one-time website build does not automatically include ongoing hosting support, backups, subscriptions or content changes.",
  ],
  [
    "What happens after we submit a quote request?",
    "With online delivery enabled, receipt is confirmed only after our configured system accepts the brief. Otherwise, you can prepare your brief and send it in WhatsApp. We review it, discuss the requirements and agree scope, price and payment milestones before work begins.",
  ],
] as const;
