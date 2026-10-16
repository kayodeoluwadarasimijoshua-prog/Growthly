import {
  WebsiteCapabilities,
  HandoverDecisions,
} from "@/components/WebsiteCapabilities";
import { websiteHostingOffer } from "@/config/business";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { StartProjectLink } from "@/components/ContactLinks";
import { WebsiteFAQ, Solutions } from "@/components/WebsiteSections";
import { PackageGrid } from "@/components/PackageGrid";
import { ClosingCTA } from "@/components/ClosingCTA";
import { getSiteUrl } from "@/lib/site";
import { BreadcrumbTrail } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { ProcessSteps } from "@/components/ProcessSteps";
import { WebsiteFitGuide } from "@/components/CustomerJourney";
export function WebsiteSalesPage({
  kind,
}: {
  kind: "main" | "business" | "ecommerce";
}) {
  const content = {
    main: {
      eyebrow: "Website development in Nigeria",
      title: "Professional website development for Nigerian businesses.",
      intro:
        "Turn scattered information into a professional website. Give customers one place to understand your offer, explore what you sell and take the next step.",
      problem: "Don’t make customers piece your business together.",
      text: "Social media is useful for reaching people. A website adds a stable destination you control: clear business information, organised services and a direct route to enquiry. We help the two work together.",
      items: [
        "Mobile-responsive pages and clear navigation",
        "Product or service presentation",
        "Contact forms and WhatsApp enquiry links",
        "Search-friendly structure and metadata",
        "Maps and analytics integration where appropriate",
        "Content management, ordering or payments when scoped",
      ],
    },
    business: {
      eyebrow: "Business website design for Nigerian SMEs",
      title: "Make your business easier to understand. And easier to contact.",
      intro:
        "A professional website for small and growing Nigerian businesses. Present your services, answer customers’ first questions and turn interest into a useful enquiry.",
      problem: "Answer the questions customers ask before they call.",
      text: "What do you offer? Who is it for? How do I get started? A business website brings these answers together, without relying on visitors to scroll through months of social posts. It is suitable for local service providers, consultants, retailers and growing teams.",
      items: [
        "Home, about, services and contact pages; page count agreed",
        "Clear service descriptions and enquiry calls to action",
        "Mobile-friendly layouts and click-to-call links",
        "Contact form or WhatsApp contact, as scoped",
        "Location information or maps where needed",
        "Optional FAQs, case studies, news and editable content",
      ],
    },
    ecommerce: {
      eyebrow: "E-commerce website development in Nigeria",
      title: "From a product people love to a store they can use.",
      intro:
        "Give your products a clear online shopfront. We plan product browsing, ordering and checkout around the way your business actually sells and fulfils orders.",
      problem: "An online store is more than a payment button.",
      text: "Customers need product details, stock information, delivery expectations and a trustworthy next step. We agree how you manage products, fulfil orders and handle returns before recommending a platform. A simpler catalogue with WhatsApp ordering may be a better starting point than a full checkout.",
      items: [
        "Product listings, categories and detail pages",
        "Product count, variants and stock requirements agreed",
        "Cart and checkout when included in scope",
        "Payment-provider integration after account approval",
        "Shipping, collection and order-notification rules",
        "Product-management walkthrough and launch checks",
      ],
    },
  }[kind];
  const url = getSiteUrl();
  const path =
    kind === "main"
      ? "/website-development"
      : kind === "business"
        ? "/business-websites"
        : "/ecommerce-websites";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: content.eyebrow,
        description: content.intro,
        url: `${url}${path}`,
        provider: { "@type": "Organization", name: "GROWTHLY", url },
        areaServed: { "@type": "Country", name: "Nigeria" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: url },
          {
            "@type": "ListItem",
            position: 2,
            name: content.eyebrow,
            item: `${url}${path}`,
          },
        ],
      },
    ],
  };
  return (
    <div className="professional-sales-page">
      {url && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <section className="page-hero page-hero--green">
        <div className="container">
          <BreadcrumbTrail
            schema={false}
            items={[
              {
                name:
                  kind === "main"
                    ? "Website development"
                    : kind === "business"
                      ? "Business websites"
                      : "E-commerce websites",
                path,
              },
            ]}
          />
        </div>
        <div className="container page-hero__grid">
          <div>
            <span className="eyebrow">{content.eyebrow}</span>
            <h1>{content.title}</h1>
            <p>{content.intro}</p>
            <div className="hero-actions">
              <StartProjectLink />
            </div>
          </div>
          <aside className="page-hero__aside">
            <strong>A useful website starts with a clear brief.</strong>We agree
            pages, features, content responsibilities, costs and payment
            milestones before work begins. No payment is collected here.
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container service-detail-grid">
          <div>
            <span className="eyebrow">Built around a real need</span>
            <h2>{content.problem}</h2>
            <p>{content.text}</p>
            <h2>What your project can include</h2>
            <ul className="check-list">
              {content.items.map((i) => (
                <li key={i}>
                  <Check size={18} aria-hidden="true" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside className="service-aside">
            <h3>Know what you’re paying for.</h3>
            <p>
              These are possible deliverables, not automatic inclusions in every
              package. The written proposal defines your final scope.
            </p>
            <ul>
              <li>
                One-time design and development are quoted separately from
                renewals.
              </li>
              <li>
                {websiteHostingOffer.summary} {websiteHostingOffer.renewals}{" "}
                Email and paid tools are separate unless explicitly included.
              </li>
              <li>
                You supply approved content and licensed images unless creation
                is scoped.
              </li>
              <li>
                Maintenance and payment-provider fees are not automatically
                included.
              </li>
            </ul>
            {kind === "ecommerce" && (
              <p>
                Growthly does not process payments on this site. A client store
                requires its own approved merchant account, policies and
                fulfilment setup.
              </p>
            )}
            <Link className="text-link mt-24" href="/portfolio">
              Explore our published projects{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="text-link mt-24" href="/pricing">
              Explore quotation options{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>
      <section
        className="section section--soft"
        id="website-capabilities"
        aria-label="Website capabilities and agreed scope"
      >
        <div className="container">
          <WebsiteCapabilities kind={kind} />
        </div>
      </section>
      {kind === "main" && (
        <section className="section section--soft">
          <div className="container">
            <SectionHeading
              eyebrow="Website solutions"
              title="Start with what your website needs to do."
              description="A business introduction, product catalogue, online store or campaign page each needs a different structure. We agree the right direction with you."
            />
            <Solutions />
          </div>
        </section>
      )}
      <section className="section section--mint">
        <div className="container">
          <SectionHeading
            eyebrow="A clear route to launch"
            title="Understand the plan before the build begins."
            description="Your goals, content and required functionality shape the scope. We confirm responsibilities, timing and payment milestones before starting."
          />
          <ProcessSteps />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <PackageGrid heading />
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <WebsiteFitGuide />
        </div>
      </section>
      <section className="section">
        <div className="container faq-layout">
          <div className="faq-layout__intro">
            <span className="eyebrow">Before you decide</span>
            <h2>Let’s make the details clear.</h2>
            <p>
              You don’t need every answer to start a conversation. We’ll help
              define a suitable website, then confirm the scope in writing.
            </p>
          </div>
          <WebsiteFAQ />
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <HandoverDecisions />
        </div>
      </section>
      <section className="section section--compact">
        <div className="container">
          <ClosingCTA />
        </div>
      </section>
    </div>
  );
}
