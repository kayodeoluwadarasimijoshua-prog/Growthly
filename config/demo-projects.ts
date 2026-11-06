import type { CmsProject } from "@/lib/cms/schema";

/** Owner-requested demo; adding the template never publishes or replaces content. */
export function autoVaultDraft(id: string): CmsProject {
  return {
    id,
    slug: "autovault-motors",
    name: "AutoVault Motors",
    category: "Automotive showroom · Demonstration website",
    service: "website-development",
    kind: "demonstration",
    liveUrl: "https://autovault-motors-nu.vercel.app/",
    videoUrl: "",
    summary:
      "A dealership website concept with 50 sample vehicle listings, combined search filters, galleries and comparison for up to three vehicles.",
    overview:
      "AutoVault Motors is a self-initiated Growthly demonstration for Nigerian car dealerships. Visitors can browse sample vehicles, filter by budget and specifications, inspect four-view galleries and prepare an enquiry. It is not a trading dealership or a paid client project.",
    creativeIntent:
      "Show how a dealership can help buyers narrow their choices and carry a vehicle reference into an enquiry, with a clear mobile browsing experience.",
    scope: [
      "Responsive homepage, inventory, vehicle details, comparison, About and Contact pages",
      "50 fictional listings across Toyota, Lexus, Honda, Mercedes-Benz and Hyundai",
      "Combined search and filters with shareable inventory URLs",
      "Four-view galleries, specifications and illustrative colour options",
      "Comparison of up to three vehicles, retained on the visitor's device",
      "Prepared WhatsApp and email enquiries; no payments, reservations or server-side enquiry storage",
    ],
    designChoices: [
      "A charcoal, warm neutral and muted green palette frames the vehicle imagery.",
      "Mobile visitors reach the offer and browsing action before the large hero illustration.",
      "Sample inventory and AI-generated vehicle imagery are disclosed as demonstration material.",
      "Contact handoffs identify the AutoVault demo; visitors review and send messages themselves.",
    ],
    note: "Self-initiated demonstration, not client work. Vehicles, prices and specifications are sample data; vehicle imagery is AI-generated. The portfolio screenshot is a real capture of the demo. No sales, conversion or traffic results are claimed. Verify the linked deployment includes the latest refinements before publishing.",
    image: null,
    published: false,
    publicationConfirmed: false,
    featured: false,
  };
}
