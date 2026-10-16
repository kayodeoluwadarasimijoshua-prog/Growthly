import projectImages from "@/config/project-images.json";
import {
  readProjectImage,
  isProjectImageReviewEnabled,
  type ProjectImage,
} from "@/lib/project-images";
import { websitePriceSummary, websiteHostingOffer } from "@/config/business";

export type ServiceDefinition = {
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  summary: string;
  introduction: string;
  bestFor: string;
  deliverables: string[];
  workingStyle: string;
  boundaries: string[];
};

export const services: ServiceDefinition[] = [
  {
    slug: "graphic-design",
    title: "Graphic & campaign design",
    shortTitle: "Graphic design",
    eyebrow: "Make the message easy to notice",
    summary:
      "Thoughtful visual assets for the moments your business needs to show up clearly.",
    introduction:
      "From a product launch to an everyday social post, each design starts with the message, the people it needs to reach and the places it will appear.",
    bestFor:
      "Small businesses, creators and service providers who need consistent promotional graphics without losing sight of the message.",
    deliverables: [
      "Social and digital campaign graphics sized for agreed channels",
      "Promotional flyers, menus, event artwork and presentation layouts",
      "A practical visual direction to keep a campaign feeling consistent",
      "Final exports in agreed web-ready formats",
    ],
    workingStyle:
      "We agree the audience, message, formats and revision rounds before design begins. You provide approved copy, logos and product information unless copy support is included in the written scope.",
    boundaries: [
      "Print production, stock assets and specialist illustration are quoted separately when needed.",
      "A full brand identity or large campaign is scoped as a separate project.",
      "Final artwork follows the approved brief; additional directions may require a new quote.",
    ],
  },
  {
    slug: "website-development",
    title: "Website design & development",
    shortTitle: "Websites",
    eyebrow: "Give your business a useful home online",
    summary:
      "Clear, responsive websites that explain what you do and make the next step obvious.",
    introduction:
      "A good website should answer a visitor’s first questions quickly. We shape the page structure, visual presentation and enquiry path around the job the site needs to do.",
    bestFor:
      "Businesses ready to launch, refresh an outdated site or give their work a more credible place to live.",
    deliverables: [
      "A mobile-first layout shaped around your offer and audience",
      "Core pages and calls to action agreed in the proposal",
      "Basic on-page SEO foundations and social-sharing metadata",
      "A pre-launch review and handover for the delivered scope",
    ],
    workingStyle:
      "We confirm the page list, content responsibilities, integrations and hosting approach before quoting. The site is reviewed on common mobile and desktop sizes before handover.",
    boundaries: [
      "Website packages include the approved first-year .com.ng domain and hosting offer. Renewals, paid themes and third-party subscriptions are separate unless listed in the proposal.",
      "Copywriting, e-commerce, booking and custom integrations require explicit scoping.",
      "Ongoing maintenance is separate from a one-time build unless agreed in writing.",
    ],
  },
  {
    slug: "ai-video-adverts",
    title: "AI-assisted video adverts",
    shortTitle: "AI video adverts",
    eyebrow: "Turn a clear idea into a short moving story",
    summary:
      "Short promotional video concepts and edits, using AI-assisted tools where they genuinely help.",
    introduction:
      "We shape a focused message, agree the format and create a short advert suited to the channels you plan to use. AI is a production tool—not a substitute for a useful brief or a clear review process.",
    bestFor:
      "Product and service businesses that need a concise campaign asset for a launch, offer or social channel.",
    deliverables: [
      "A short concept and storyboard or shot outline",
      "An agreed-duration video edit in selected aspect ratios",
      "Supplied brand elements, product details and approved claims incorporated",
      "A final export plus agreed revision round(s), defined in the proposal",
    ],
    workingStyle:
      "Before work begins, we agree the script or key message, source assets, format, duration and usage. Any generated or licensed elements are reviewed as part of that scope.",
    boundaries: [
      "Platform, voice, stock and AI-tool subscriptions may incur separate fees.",
      "Paid media placement and campaign management are not included unless quoted.",
      "Rights, likeness, product claims and any required approvals must be confirmed before publication.",
    ],
  },
  {
    slug: "social-media-management",
    title: "Social media management",
    shortTitle: "Social media",
    eyebrow: "Show up with more intention",
    summary:
      "A considered content rhythm, useful creative and practical account support for your chosen channels.",
    introduction:
      "Good social content is more than a run of graphics. We agree what the channel should do for your business, plan a manageable rhythm and create the assets and copy included in your scope.",
    bestFor:
      "Founders and small teams who need a clearer plan and reliable creative support for selected social accounts.",
    deliverables: [
      "A focused content plan or calendar for an agreed period",
      "A defined number and format of approved posts or short-form assets",
      "Captions and calls to action within the agreed content scope",
      "Publishing support where access and platform tools allow it",
    ],
    workingStyle:
      "The proposal specifies channels, post volume, approvals, account access and who responds to messages. We begin with a brief and a review of existing brand materials.",
    boundaries: [
      "Community management, inbox replies and same-day publishing are not assumed; they must be explicitly scoped.",
      "Photography, video shoots, paid creator fees and advertising spend are separate.",
      "Audience growth and sales outcomes depend on many factors and are not guaranteed.",
    ],
  },
  {
    slug: "ai-integration-automation",
    title: "AI integration & automation",
    shortTitle: "AI & automation",
    eyebrow: "Make repetitive work a little simpler",
    summary:
      "Practical workflow reviews and scoped automations using tools that fit the way your business works.",
    introduction:
      "We start with the task that costs your team time, map the current steps and check whether a lightweight automation is suitable before proposing a build.",
    bestFor:
      "Small teams with a repeatable, well-understood process and a clear owner for the tools involved.",
    deliverables: [
      "A short workflow discovery and feasibility review",
      "A written outline of the proposed workflow and its limits",
      "Configuration of the agreed supported tools and handover notes",
      "A practical test with sample or approved business data",
    ],
    workingStyle:
      "We agree data access, tool subscriptions, failure handling and a human review step where needed. The project only proceeds when the proposed approach is appropriate for the information involved.",
    boundaries: [
      "Third-party subscriptions and usage charges are paid separately by the business.",
      "Sensitive, regulated or high-impact decisions are not automated without a suitable specialist review.",
      "Ongoing monitoring, custom software and support are separate unless written into the scope.",
    ],
  },
  {
    slug: "digital-advertising",
    title: "Digital advertising & growth support",
    shortTitle: "Advertising support",
    eyebrow: "Put a clear offer in front of the right audience",
    summary:
      "Campaign planning and setup support for businesses ready to test paid digital promotion.",
    introduction:
      "We help clarify the offer, destination and campaign basics before launch. Advertising is treated as a test-and-learn channel, with decisions grounded in the information available.",
    bestFor:
      "Businesses with a defined offer, a working destination page and a separate budget for platform media spend.",
    deliverables: [
      "A campaign brief, audience assumptions and agreed objective",
      "Campaign setup support for selected advertising platforms",
      "Creative and landing-page recommendations within the agreed scope",
      "A review of available campaign reporting and practical next steps",
    ],
    workingStyle:
      "The proposal names the platform, account owner, campaign period, reporting cadence and what is included. The client retains ownership of the advertising account and pays the platform directly.",
    boundaries: [
      "Media spend, taxes, platform fees and third-party production costs are separate.",
      "Platform approval, reach, leads and sales cannot be guaranteed.",
      "Complex tracking, landing pages and ongoing optimisation are scoped separately.",
    ],
  },
];

export type ClientProject = {
  kind: "client" | "demonstration";
  service?: string;
  featured?: boolean;
  videoUrl?: string;
  slug: string;
  name: string;
  category: string;
  liveUrl: string;
  previewSummary: string;
  image?: Omit<ProjectImage, "kind"> & {
    kind: ProjectImage["kind"] | "artwork";
  };
  services: string[];
  summary: string;
  overview: string;
  creativeIntent: string;
  designChoices: string[];
  scope: string[];
  note: string;
};
export type PortfolioProject = ClientProject;
/** Only owner-approved published projects. Removed demos and Daily Life Review are not public work. */
export const projects: PortfolioProject[] = [
  {
    kind: "client",
    slug: "starxco",
    name: "StarXCO",
    category: "Energy, maritime & trade · Business website",
    liveUrl: "https://starxco.com.ng/",
    // A genuine image is enabled only after the owner's approved local import.
    image: readProjectImage(
      (projectImages as Record<string, unknown>).starxco,
      "starxco",
      isProjectImageReviewEnabled(),
    ),
    previewSummary:
      "Commercial facilitation across energy, maritime, logistics & trade.",
    services: ["Website development"],
    summary:
      "A business website presenting commercial facilitation services across energy, maritime, logistics and trade.",
    overview:
      "StarXCO connects commercial participants across energy, maritime, transport and commodity markets. Its website brings the company introduction, service information, working process and enquiry options into one place. This is a Growthly website-development project.",
    creativeIntent:
      "Help visitors understand what StarXCO facilitates, find a relevant service and provide the details of a commercial requirement.",
    designChoices: [
      "A company introduction explains its role as a commercial facilitator and intermediary.",
      "Dedicated service and sector pages organise the offer around the visitor’s requirements.",
      "A visible working process explains how a requirement moves from assessment through coordination to execution.",
      "Contact and quote-request pages give visitors a clear next step.",
    ],
    scope: [
      "Business website with company, service and sector information",
      "Process and documentation information pages",
      "Requirement form covering product, vessel, equipment, origin, destination and timing details",
      "Contact and enquiry pathways",
    ],
    note: "The live website may change over time. No traffic, revenue or enquiry-growth results are claimed; the external form’s delivery was not tested for this portfolio update.",
  },
];

export const processSteps = [
  {
    number: "01",
    name: "Tell us about your business",
    description:
      "Share your customers, offer and the job your website needs to do.",
  },
  {
    number: "02",
    name: "Agree the right solution",
    description:
      "We recommend an approach and confirm scope, price, timeline and deposit in writing.",
  },
  {
    number: "03",
    name: "Design, build & test",
    description:
      "We create the agreed pages, review them together and check the enquiry journey.",
  },
  {
    number: "04",
    name: "Approve & launch",
    description:
      "After approval and agreed payment milestones, we launch and hand over the website.",
  },
] as const;

export const faqs = [
  {
    question: "How much does a project cost?",
    answer: `${websitePriceSummary}. ${websiteHostingOffer.summary} Final quotes depend on pages, content and integrations. The written proposal confirms inclusions, exclusions and separate fees.`,
  },
  {
    question: "How do payments work?",
    answer:
      "There is no payment checkout on this site. After reviewing your brief, GROWTHLY sends a written scope and payment schedule. Work starts after you approve the proposal and pay the agreed deposit; the remaining milestones are stated before you commit.",
  },
  {
    question: "How many revisions are included?",
    answer:
      "The revision allowance is stated in your written proposal. For custom projects, the proposal will state the number of consolidated review rounds and how extra changes are handled.",
  },
  {
    question: "How long will my project take?",
    answer:
      "Timing depends on the agreed scope and how quickly content and feedback are supplied. Website start dates and delivery timing are confirmed in writing after the brief is reviewed; custom timelines are also confirmed in your proposal.",
  },
  {
    question: "Do you provide a domain and hosting?",
    answer: `${websiteHostingOffer.summary} ${websiteHostingOffer.renewals}`,
  },
  {
    question: "Can you maintain my website after launch?",
    answer:
      "Ongoing updates, hosting support and maintenance are not automatically included in a one-time build. Ask for them in your brief and they can be scoped separately where suitable.",
  },
  {
    question: "What happens after I send a project request?",
    answer:
      "GROWTHLY reviews the details and follows up using the contact method you choose. If the project is a fit, you receive a written scope, timing and quote before any work or payment begins.",
  },
] as const;
