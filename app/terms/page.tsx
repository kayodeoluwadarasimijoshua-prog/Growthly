import { websiteHostingOffer } from "@/config/business";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { BreadcrumbTrail } from "@/components/PageIntro";
export const metadata = pageMetadata(
  "Terms of service",
  "Website-use terms and how Growthly agrees scope, content responsibilities, payments, revisions and project handover.",
  "/terms",
);
const sections = [
  [
    "Using this website",
    "This website introduces Growthly’s services and lets you enquire about a project. Do not submit unlawful content, interfere with the site or send credentials or sensitive personal information.",
  ],
  [
    "Enquiries and proposals",
    "An enquiry is not an order, contract or guaranteed start date. Growthly reviews your requirements and, if suitable, provides a written proposal. The signed or otherwise accepted project agreement governs that project and takes precedence over general service descriptions here.",
  ],
  [
    "Scope and changes",
    "The proposal defines pages, features, integrations, content responsibilities, review rounds and exclusions. Requests outside the approved scope may change the quote and timeline; any extra work must be agreed before it begins.",
  ],
  [
    "Payments and launch",
    "Prices, deposits, payment milestones, applicable taxes and cancellation or refund arrangements are set out in the project agreement. This site takes no payments. Work starts after approval and the agreed deposit; launch follows approval and the agreed payment milestones.",
  ],
  [
    "Content and account responsibility",
    "You must have permission to use supplied logos, text, photos and other assets. Domain, hosting, payment and third-party accounts require authorised access. Ownership, licences and access at handover are agreed in your proposal. Never share account passwords through the enquiry form.",
  ],
  [
    "Timing and third-party services",
    `Delivery depends on scope, content readiness, feedback and external service approvals. ${websiteHostingOffer.summary} ${websiteHostingOffer.renewals} Paid integrations, payment-provider fees and ongoing maintenance are separate unless included in writing. Third-party availability and terms are outside Growthly’s control.`,
  ],
  [
    "Results and support",
    "A website can support discovery and enquiries, but Growthly does not guarantee traffic, rankings, sales or revenue. Maintenance and post-launch support are limited to the scope agreed in writing. Nothing in these terms removes rights that cannot lawfully be excluded.",
  ],
  [
    "Questions and privacy",
    "Contact Growthly through the contact page if you have questions about these terms or a proposal. Personal information is handled as described in the privacy policy. These website terms may change; project-specific changes require agreement.",
  ],
];
export default function Page() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <BreadcrumbTrail items={[{ name: "Terms of service", path: "/terms" }]} />
          <span className="eyebrow">Last updated · 13 October 2026</span>
          <h1>Clear terms for a clear working relationship.</h1>
          <p>
            General website-use terms. Your written project agreement defines
            the work you commission.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container legal-content">
          <aside className="legal-content__aside">
            <strong>Before you commit</strong>No work or payment begins solely
            because you send an enquiry. Review your proposal and ask about
            anything that is unclear.
          </aside>
          <div className="legal-content__body">
            {sections.map(([title, text]) => (
              <section key={title}>
                <h2>{title}</h2>
                <p>{text}</p>
              </section>
            ))}
            <Link className="text-link" href="/contact">
              Contact Growthly
            </Link>
            <br />
            <Link className="text-link" href="/privacy-policy">
              Read the privacy policy
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
