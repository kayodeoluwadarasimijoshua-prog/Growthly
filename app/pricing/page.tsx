import { PackageGrid } from "@/components/PackageGrid";
import { ClosingCTA } from "@/components/ClosingCTA";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Website packages & quotation options",
  "Compare Growthly’s Starter, Business and E-commerce website options. Understand what is scoped and which ongoing costs are separate.",
  "/pricing",
);
const costs = [
  [
    "Design & development",
    "A one-time project charge based on pages, features, revisions and integrations. Confirmed in writing before a deposit is due.",
  ],
  [
    "Domain & hosting",
    "Domain registration and renewals, hosting and business email are separate unless your proposal includes them. Account ownership and renewal responsibility are agreed.",
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
export default function Page() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Clear scope before commitment</span>
          <h1>
            A website that fits.
            <br />A quote you can understand.
          </h1>
          <p>
            No unapproved fixed prices. Tell us what your business needs and
            we’ll recommend a suitable solution, with a written page list,
            features, timeline and cost.
          </p>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <PackageGrid />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <h2 className="mb-32">
            One-time work. Ongoing costs. Clearly separated.
          </h2>
          <div className="industry-grid">
            {costs.map(([title, text]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="mt-32">
            Custom websites are quotation-based. Final page counts, review
            rounds and delivery estimates are agreed after the brief; the
            package descriptions are planning options, not a contract. Work
            begins after approval and the agreed deposit, not when you submit a
            request.
          </p>
        </div>
      </section>
      <section className="section section--compact">
        <div className="container">
          <ClosingCTA />
        </div>
      </section>
    </>
  );
}
