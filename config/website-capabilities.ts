export type WebsiteCapability = {
  title: string;
  customerTask: string;
  scope: string;
};

/** Customer-facing explanations of possible scope, never universal package inclusions. */
export const websiteCapabilities: Record<
  "main" | "business" | "ecommerce",
  WebsiteCapability[]
> = {
  main: [
    {
      title: "An organised page structure",
      customerTask:
        "Find your business introduction, the right service or product information, and your contact details without searching through disconnected posts.",
      scope:
        "We agree the page list, navigation and content priorities. A Starter website is multi-page; no fixed page count is assumed.",
    },
    {
      title: "Useful service & product pages",
      customerTask:
        "Understand what you offer, who it suits and the details needed before making an enquiry. Genuine photos, specifications or work can help explain the offer.",
      scope:
        "We confirm the services or products to cover, who supplies approved copy/images and whether content writing or photography needs its own scope.",
    },
    {
      title: "A practical enquiry route",
      customerTask:
        "Move from a relevant page to WhatsApp, a call or a project form with a clear idea of what to ask and what happens next.",
      scope:
        "Contact destinations, form fields, validation, delivery and privacy requirements are agreed. A button click is not proof that an enquiry was received.",
    },
    {
      title: "Mobile & search foundations",
      customerTask:
        "Read important information and use the contact route on a phone. Clear headings and descriptive pages also help search engines understand the content.",
      scope:
        "Responsive layouts, page titles, descriptions and crawlable structure are part of the approach. Indexing, search rankings and sales are not guaranteed.",
    },
    {
      title: "Editing that fits your team",
      customerTask:
        "See current business information rather than an outdated offer, old opening hours or a product that is no longer available.",
      scope:
        "We discuss who updates the site and whether an editing system is needed. Content editing, account access, training and ongoing maintenance must be specified.",
    },
    {
      title: "Integrations with a clear purpose",
      customerTask:
        "Use ordering, payments, booking or other functionality when it genuinely supports how your business serves customers.",
      scope:
        "These are separately assessed features, not automatic inclusions. Provider approval, subscriptions, data handling, failure cases and ownership need agreement before activation.",
    },
  ],
  business: [
    {
      title: "A company introduction people can check",
      customerTask:
        "Understand the business, the offer, the audience and the genuine information behind it before deciding whether to get in touch.",
      scope:
        "We organise approved company information. Team details, locations, qualifications, testimonials and client logos are used only when supplied, accurate and permitted.",
    },
    {
      title: "Services explained in the right detail",
      customerTask:
        "Find the relevant service, understand what it covers and distinguish it from other options. Answers to buying questions can sit beside the offer.",
      scope:
        "The proposal identifies the services and dedicated pages. Copywriting, specialist information and extra pages are not assumed to be included.",
    },
    {
      title: "Genuine work with useful context",
      customerTask:
        "Look at actual work and understand its purpose, delivered scope and decisions—not just an unexplained image or unsupported result.",
      scope:
        "Case studies need approved project information and asset permission. We do not invent clients, testimonials, sales figures or before-and-after outcomes.",
    },
    {
      title: "An enquiry that reaches the right destination",
      customerTask:
        "Ask a focused question, request a quote or call the business using a visible contact route on the page that matters.",
      scope:
        "We agree the WhatsApp number or form-delivery setup, required information, permissions and receipt testing. Contact links and forms are not a CRM by default.",
    },
    {
      title: "Business information kept current",
      customerTask:
        "Find up-to-date services, contact details, availability or business news without relying on an old social post.",
      scope:
        "An editing system and handover can be scoped around your team. Maintenance, content updates and any recurring software charges are agreed separately.",
    },
  ],
  ecommerce: [
    {
      title: "Products customers can understand",
      customerTask:
        "Browse appropriate categories, compare relevant details and check what a product includes before considering an order.",
      scope:
        "We agree the product count, categories, images, descriptions, variants and any stock requirements. Product-data preparation is a real part of the brief.",
    },
    {
      title: "The right route to ordering",
      customerTask:
        "Ask about a product on WhatsApp or use a cart and checkout, depending on the ordering journey your business can support.",
      scope:
        "A catalogue with enquiries and a transactional store are different scopes. We decide which fits your products, fulfilment and budget before quoting.",
    },
    {
      title: "Payments with approved accounts",
      customerTask:
        "Understand available payment methods and receive clear feedback about a payment attempt, including unsuccessful or pending outcomes.",
      scope:
        "A scoped checkout needs the business’s approved merchant account. Provider approval, transaction fees, account ownership and test acceptance remain separate requirements.",
    },
    {
      title: "Delivery & collection information",
      customerTask:
        "Check where you deliver, whether collection is possible and what delivery costs or conditions apply before placing an order.",
      scope:
        "You confirm fulfilment rules, charges and customer policies. Shipping calculations, courier connections and advanced delivery logic are separately scoped.",
    },
    {
      title: "A workable order-management process",
      customerTask:
        "Receive the agreed order communication while your team can identify, process and follow up on orders using the planned workflow.",
      scope:
        "We agree order statuses, notification destinations, staff access and failure handling. Inventory, accounting or marketplace connections are not included automatically.",
    },
    {
      title: "A store your team can maintain",
      customerTask:
        "See current product details and availability as your catalogue changes, instead of information that becomes stale after launch.",
      scope:
        "Product-management access and walkthrough are defined at handover. Ongoing product entry, maintenance, licences and subscriptions require an explicit agreement.",
    },
  ],
};

export const handoverDecisions = [
  {
    title: "Domain & hosting",
    detail:
      "Confirm the domain registrant, account ownership, hosting limits and who handles renewals. The approved first-year offer is not lifetime hosting or an automatic business-email service.",
  },
  {
    title: "Content & account access",
    detail:
      "Identify which delivered content can be edited, the appropriate account owner and any third-party licences. Access is transferred through an agreed secure process, not passwords sent in an enquiry form.",
  },
  {
    title: "A usable walkthrough",
    detail:
      "Agree the handover format and, where editing or order management is included, the tasks your team needs to understand. A custom administration system is not assumed.",
  },
  {
    title: "Support after launch",
    detail:
      "Set out what happens when information changes or an issue is reported. Maintenance, backups, monitoring, response expectations and extra changes require a separate written scope unless included.",
  },
] as const;
