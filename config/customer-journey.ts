export const websiteOutcomes = [
  {
    number: "01",
    title: "Help people understand your business",
    text: "Put your offer, product details and answers in one organised place—so visitors do not have to piece them together from social posts.",
  },
  {
    number: "02",
    title: "Give interested customers confidence",
    text: "Show useful business information, genuine work and clear ways to contact you. Make the important details easy to check.",
  },
  {
    number: "03",
    title: "Make the next step feel straightforward",
    text: "Guide people towards an enquiry, a call or an order, with mobile-friendly pages and contact options that fit how you work.",
  },
] as const;

export const websiteFitChoices = [
  {
    goal: "I need a professional home for my business",
    packageId: "starter-website",
    type: "Business website",
    advice:
      "A multi-page introduction to your business, what you offer and how customers can reach you. A practical first step when the requirements are focused.",
  },
  {
    goal: "I have several services or more information to explain",
    packageId: "business-website",
    type: "Business website",
    advice:
      "A more detailed business website with dedicated service information and enquiry pathways. We agree the page list and features after reviewing your brief.",
  },
  {
    goal: "I want customers to browse and order products",
    packageId: "ecommerce-website",
    type: "E-commerce website",
    advice:
      "An online store direction, with catalogue, ordering and checkout requirements scoped around your products and fulfilment. A simpler WhatsApp catalogue is also worth discussing.",
  },
] as const;

/** Independent examples reviewed for content/navigation inspiration, never client work. */
export const independentWebsiteExamples = [
  {
    name: "Paystack",
    category: "Service-led business",
    href: "https://paystack.com/",
    lesson:
      "A direct explanation of the offer, focused feature sections and distinct routes for different customer needs.",
    takeaway:
      "For your website: introduce the offer clearly, then help visitors find the service that matters to them.",
  },
  {
    name: "IKEA",
    category: "Retail & product discovery",
    href: "https://www.ikea.com/us/en/",
    lesson:
      "Product categories and practical shopping information give visitors a route from an idea to a relevant product.",
    takeaway:
      "For your website: organise products and explain the details people need before they enquire or order.",
  },
  {
    name: "Lagos Business School",
    category: "Education & programmes",
    href: "https://www.lbs.edu.ng/",
    lesson:
      "Public programme and faculty information illustrates how an education website can serve different audiences.",
    takeaway:
      "For your website: make programmes, entry information and contact routes easy for prospective applicants to find.",
  },
] as const;

export const projectPreparation = [
  [
    "Your business",
    "What you offer, who your customers are and what makes the offer relevant to them.",
  ],
  [
    "Your website’s job",
    "Introduce services, display products, collect enquiries or support ordering.",
  ],
  [
    "Your content",
    "Your logo, approved business information, product details and images you have permission to use.",
  ],
  [
    "Your practical requirements",
    "Budget preference, desired timing, existing domain or website and any integrations you need.",
  ],
] as const;
