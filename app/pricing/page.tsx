import { getSiteSettings } from "@/lib/cms/public";
import { packagesFor, priceText } from "@/lib/cms/format";
import { HandoverDecisions } from "@/components/WebsiteCapabilities";
import { BreadcrumbTrail } from "@/components/PageIntro";
import { websiteHostingOffer } from "@/config/business";
import { seoPages } from "@/config/seo";
import { PackageGrid } from "@/components/PackageGrid";
import { ClosingCTA } from "@/components/ClosingCTA";
import { pageMetadata } from "@/lib/seo";
export async function generateMetadata() {
  const settings = await getSiteSettings();
  return pageMetadata(
    seoPages.pricing.title,
    priceText(seoPages.pricing.description, settings),
    seoPages.pricing.path,
  );
}
const costs = [
  [
    "Design & development",
    "A one-time project charge based on pages, features, revisions and integrations. Confirmed in writing before a deposit is due.",
  ],
  [
    "Domain & hosting",
    `${websiteHostingOffer.summary} ${websiteHostingOffer.renewals} Business email is separately scoped.`,
  ],
  [
    "Paid tools & payments",
    "Themes, premium plugins, subscriptions and payment-provider transaction fees are separate. We identify required accounts before building.",
  ],
  [
    "Content & maintenance",
    "Copywriting, photography and ongoing updates, monitoring or backups require their own scope. A launch does not automatically include ongoing support.",
  ],
];
export default async function Page() {
  const settings = await getSiteSettings();
  const websitePriceSummary = packagesFor(settings)
    .map((p) => `${p.name}: ${p.price.toLowerCase()}`)
    .join("; ");
  return (
    <div className="professional-sales-page">
      <section className="page-hero">
        <div className="container">
          <BreadcrumbTrail
            items={[{ name: "Website packages", path: "/pricing" }]}
          />
          <span className="eyebrow">Clear scope before commitment</span>
          <h1>
            A website that fits.
            <br />A quote you can understand.
          </h1>
          <p>
            {websitePriceSummary}. Every package includes a free .com.ng domain
            and hosting for year one. Compare below, then request your written
            quote.
          </p>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <PackageGrid heading />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2>What affects the cost of a website in Nigeria?</h2>
          <p className="mt-24 mb-32">
            Pages, product data, content and integrations affect the final
            quote. We agree the scope and price before work begins.
          </p>

          <div className="industry-grid">
            {costs.map(([title, text]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container editorial-split">
          <div>
            <span className="eyebrow">Compare scope, not only the number</span>
            <h2>A written quote should make the differences visible.</h2>
            <p className="mt-24">
              Two websites can have similar starting prices and very different
              requirements. Confirm the actual work and ongoing responsibilities
              before choosing.
            </p>
          </div>
          <div>
            <ul className="proposal-checklist">
              {[
                "The agreed page list and the purpose of each page",
                "Products, content and licensed assets: what is supplied and by whom",
                "Forms, ordering, payments or other integrations and required accounts",
                "Review rounds, milestones and the estimated delivery conditions",
                "First-year domain/hosting limits, ownership and renewal responsibility",
                "Separate fees, subscriptions, maintenance and changes outside scope",
                "Launch checks, access and the agreed handover",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section">
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
