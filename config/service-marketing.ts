export type ServiceMarketing = {
  headline: string;
  distinction: string;
  useCases: { title: string; text: string }[];
  preparation: string[];
  steps: { name: string; description: string }[];
  faqs: [string, string][];
};

export const serviceMarketing: Record<string, ServiceMarketing> = {
  "graphic-design": {
    headline: "Make your offer clear, wherever it appears.",
    distinction:
      "This service creates visual communication assets. Website development, full brand identity, print production and paid advertising are different scopes—not automatic additions.",
    useCases: [
      {
        title: "Promotions & launches",
        text: "Give a product, service or event a focused visual message. We discuss the key information, the intended audience and the formats you need.",
      },
      {
        title: "Everyday business communication",
        text: "Plan useful flyers, menus, social graphics or presentation layouts around approved information, instead of squeezing everything into one crowded design.",
      },
      {
        title: "A consistent campaign direction",
        text: "Keep the agreed message and visual direction recognisable across selected placements. Asset volume and sizes are confirmed in the brief.",
      },
    ],
    preparation: [
      "Your approved message and the action the design should support",
      "Your logo, existing visual guidelines and assets you can use",
      "The channels, formats and any print specifications required",
      "The deliverables, preferred timing and budget direction",
    ],
    steps: [
      {
        name: "Agree the message",
        description:
          "Confirm the audience, purpose, approved copy and required formats.",
      },
      {
        name: "Set the design direction",
        description:
          "Agree visual references, supplied assets and the written scope before production.",
      },
      {
        name: "Design & review",
        description:
          "Develop the agreed artwork and collect focused feedback within the scoped review rounds.",
      },
      {
        name: "Deliver approved exports",
        description:
          "Supply the agreed formats after approval and payment milestones. Source files and print production depend on scope.",
      },
    ],
    faqs: [
      [
        "Can you design flyers and social graphics?",
        "Yes. Promotional flyers and selected social/digital campaign graphics can be scoped. Share the message, destination, formats and number of assets you need.",
      ],
      [
        "Is a full logo or brand identity included?",
        "Not automatically. A full identity, specialist illustration, stock assets or print production needs an explicit quote. We can work with approved existing brand materials.",
      ],
      [
        "How are design prices and revisions agreed?",
        "We quote after understanding the deliverables, formats and content readiness. The proposal confirms price, review rounds, exports and any additional-change charges.",
      ],
    ],
  },
  "ai-video-adverts": {
    headline: "Turn a clear offer into a focused video advert.",
    distinction:
      "AI video adverts are creative production. Running a paid campaign is the separate Ads & promotion service; media spend, placement and campaign management are not included unless explicitly quoted.",
    useCases: [
      {
        title: "A product or service introduction",
        text: "Explain one useful offer in a short video direction, with a clear audience and an appropriate next step rather than a long list of competing messages.",
      },
      {
        title: "An offer or launch message",
        text: "Shape an approved promotion into a concise concept. Product claims, terms and supplied details need confirmation before they appear in the advert.",
      },
      {
        title: "Creative for selected channels",
        text: "Discuss the duration, aspect ratios, captions and delivery formats needed for your chosen placements. Versions and production requirements are scoped in advance.",
      },
    ],
    preparation: [
      "The product or service, target audience and intended message",
      "Approved claims, offer details, logo and permitted source assets",
      "The intended channel, preferred format and creative references",
      "Whether you need video production only or separately scoped campaign support",
    ],
    steps: [
      {
        name: "Clarify the offer",
        description:
          "Agree the message, audience, intended destination and content permissions.",
      },
      {
        name: "Approve the concept",
        description:
          "Confirm the script or storyboard, duration, formats and production scope.",
      },
      {
        name: "Produce & review",
        description:
          "Create the agreed edit using AI-assisted tools where appropriate, with review of generated and licensed elements.",
      },
      {
        name: "Deliver the approved video",
        description:
          "Supply the agreed exports after approval and payment milestones. Advertising placement remains separate.",
      },
    ],
    faqs: [
      [
        "Does an AI video advert include paid promotion?",
        "No, not automatically. This page covers video creative. Ad accounts, campaign setup, management and platform media spend require a separate advertising scope.",
      ],
      [
        "Can I choose the voice, style and format?",
        "We discuss the creative direction before quoting. Voice, music, likeness, stock and generated-element rights must be confirmed; specific production requirements can change scope or tool costs.",
      ],
      [
        "How long will the video be and what will it cost?",
        "Duration, aspect ratios, versions, review rounds and price are agreed after your brief. No fixed duration, turnaround or universal video price is promised here.",
      ],
    ],
  },
  "social-media-management": {
    headline: "A clearer content plan. A more considered way to show up.",
    distinction:
      "Social media support covers the agreed content and account workflow. Paid advertising, inbox replies, photography and video shoots are not automatically included.",
    useCases: [
      {
        title: "A content plan with a purpose",
        text: "Identify what selected channels should explain about your business and develop a manageable content direction around that purpose.",
      },
      {
        title: "Approved posts & creative",
        text: "Scope a defined set of captions, graphics or short-form assets. The content volume, formats and review process are agreed—not assumed to be unlimited.",
      },
      {
        title: "A practical publishing workflow",
        text: "Decide who approves content, who publishes and who answers customer messages. Account access and platform capabilities shape what is possible.",
      },
    ],
    preparation: [
      "The channels you use and what they should do for your business",
      "Existing public account links and approved brand materials",
      "Your offers, content priorities and approval contact",
      "Whether publishing, inbox support or paid promotion is actually required",
    ],
    steps: [
      {
        name: "Review the channels",
        description:
          "Understand the offer, audience and existing public content.",
      },
      {
        name: "Agree the content scope",
        description:
          "Specify channels, period, formats, volume, responsibilities and approvals.",
      },
      {
        name: "Create & approve",
        description:
          "Prepare the scoped assets and copy, then review them before any authorised publishing.",
      },
      {
        name: "Publish & review the plan",
        description:
          "Provide the agreed publishing/support workflow where tools and permissions allow. Ongoing periods need an explicit agreement.",
      },
    ],
    faqs: [
      [
        "How many posts are included?",
        "The number, formats, channels and period are defined in the proposal. There is no default unlimited-content package or invented monthly plan on this page.",
      ],
      [
        "Will you answer messages and comments?",
        "Only if community or inbox management is explicitly included. We agree ownership, access and responsibilities before starting.",
      ],
      [
        "Do you guarantee followers or sales?",
        "No. We can plan and produce agreed content, but audience growth and business outcomes depend on many factors. Paid promotion and production costs are separate unless scoped.",
      ],
    ],
  },
  "digital-advertising": {
    headline:
      "Give your promotion a clear offer, destination and campaign plan.",
    distinction:
      "Ads & promotion covers scoped campaign planning and setup support. Platform media spend is separate. AI-video production, graphic design and a new landing page are separate deliverables unless listed in the proposal.",
    useCases: [
      {
        title: "An offer ready for promotion",
        text: "Clarify what you are promoting, who it is intended for and what an interested person should do after seeing the advert.",
      },
      {
        title: "A relevant destination",
        text: "Send the visitor to a page or contact journey that matches the advert. We review the message and next step; building a new page needs its own agreed scope.",
      },
      {
        title: "A test-and-learn campaign",
        text: "Agree objectives, account ownership, creative requirements and the reporting available. Recommendations should use actual information, not promised sales or rankings.",
      },
    ],
    preparation: [
      "The offer, audience and intended objective",
      "The destination page or contact route customers should use",
      "The selected platform, account owner and available permissions",
      "A separate media budget, campaign period and approved creative",
    ],
    steps: [
      {
        name: "Understand the offer",
        description:
          "Review the objective, audience assumptions and destination before proposing a campaign.",
      },
      {
        name: "Agree the campaign scope",
        description:
          "Specify the platform, account owner, period, media budget and included work.",
      },
      {
        name: "Prepare & approve setup",
        description:
          "Review creative, destination and account requirements. Activation requires the relevant approval and permissions.",
      },
      {
        name: "Review available reporting",
        description:
          "Discuss reporting and practical next steps within the agreed scope. Platform approvals and outcomes are not guaranteed.",
      },
    ],
    faqs: [
      [
        "Is advertising spend included in the service price?",
        "No, unless explicitly listed. Platform media spend, taxes and fees are separate; the client retains account ownership and pays the platform directly.",
      ],
      [
        "Is this the same as an AI video advert?",
        "No. AI video is creative production. Ads & promotion concerns the campaign around approved creative and a destination. You can discuss one or both, with separate scopes.",
      ],
      [
        "Will a campaign guarantee enquiries or sales?",
        "No. We agree the objective, setup and reporting work, but results depend on the offer, audience, competition, destination and platform. No campaign is activated simply by visiting this page.",
      ],
    ],
  },
  "ai-integration-automation": {
    headline: "Start with the repetitive task—not another tool.",
    distinction:
      "Automation begins with feasibility and an agreed workflow. It is not a default chatbot, an automatically activated subscription or a promise to automate sensitive decisions.",
    useCases: [
      {
        title: "A repeatable task worth reviewing",
        text: "Identify a well-understood routine and the people responsible for it. We assess whether automation is appropriate before proposing a build.",
      },
      {
        title: "A workflow with defined limits",
        text: "Map the inputs, tools, access, outputs and points that still need a person. A clear exception route is as important as the normal path.",
      },
      {
        title: "A manageable handover",
        text: "Discuss who owns the workflow, how it is tested and what happens when a provider or step fails. Ongoing monitoring is separately scoped.",
      },
    ],
    preparation: [
      "The current task, its steps and the tools already used",
      "The process owner and the information involved—without sending private data",
      "The expected output and the situations that need human review",
      "Approved account access, budget and any ongoing support requirements",
    ],
    steps: [
      {
        name: "Map the current task",
        description:
          "Understand the routine, owners, information and existing tools.",
      },
      {
        name: "Check feasibility",
        description:
          "Identify limits, access, costs, privacy considerations and human review requirements.",
      },
      {
        name: "Build & test the agreed workflow",
        description:
          "Configure supported tools and test with sample or approved information after scope and permissions are agreed.",
      },
      {
        name: "Handover & responsibilities",
        description:
          "Document the agreed workflow, ownership and failure handling. Monitoring and ongoing changes need explicit scope.",
      },
    ],
    faqs: [
      [
        "Do you add AI chatbots to every website?",
        "No. A chatbot is not a default inclusion. We first review whether a workflow or integration is useful and appropriate; provider activation needs explicit approval.",
      ],
      [
        "Are subscriptions and usage charges included?",
        "No, unless written into the proposal. Tool subscriptions, usage costs and ongoing monitoring require a clear owner and budget.",
      ],
      [
        "Can you automate sensitive decisions?",
        "Sensitive, regulated or high-impact decisions need suitable specialist review and human oversight. We do not proceed merely because a tool can technically perform a step.",
      ],
    ],
  },
};

export const serviceLandingTitles: Record<string, string> = {
  "graphic-design": "Graphic Design Services in Nigeria",
  "ai-video-adverts": "AI Video Adverts & Creative Production in Nigeria",
  "social-media-management": "Social Media Management Services in Nigeria",
  "digital-advertising": "Digital Advertising & Promotion Services in Nigeria",
  "ai-integration-automation":
    "AI Integration & Workflow Automation in Nigeria",
};
