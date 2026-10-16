import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IndustriesList } from "@/components/WebsiteSections";
import { ClosingCTA } from "@/components/ClosingCTA";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Website Design for Schools, Property & Retail",
  "Explore practical website features for Nigerian retail, beauty, real estate, education, hospitality and professional service businesses.",
  "/industries",
);
const questions = [
  [
    "What do customers need to know?",
    "A parent may need admissions information. A property buyer needs listing details. A shopper needs product specifications and ordering information.",
  ],
  [
    "What should they do next?",
    "Make an enquiry, request a viewing, discuss a service or place an order. We make the appropriate action visible and easy to understand.",
  ],
  [
    "Who will keep it useful?",
    "We discuss the owner of your content, how often details change and any editing, maintenance or integration requirements before choosing the approach.",
  ],
];
export default function IndustriesPage() {
  return (
    <div className="professional-sales-page">
      <PageIntro
        label="Industries"
        path="/industries"
        eyebrow="Built around your customers"
        title="Different businesses. Different website needs."
        description="A school’s admissions page has a different job from a retailer’s product catalogue. We plan around the information your customers need and the action you want them to take."
        aside={
          <>
            <strong>Applications, not claimed experience.</strong>These are
            practical website directions. We assess your actual requirements and
            do not imply a specialist client history in every industry.
          </>
        }
      />
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="What useful can look like"
            title="Make your business information work harder."
            description="The right pages help people understand your offer before they contact you. Features are selected and scoped for your business, not added automatically."
          />
          <IndustriesList headingLevel={3} />
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            eyebrow="Start with the customer’s task"
            title="Three questions shape a better website brief."
            description="The answers help separate essential features from unnecessary complexity."
          />
          <div className="outcome-grid">
            {questions.map(([title, text], index) => (
              <article className="outcome-card" key={title}>
                <span className="editorial-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container editorial-split">
          <div>
            <span className="eyebrow">Keep the technical scope realistic</span>
            <h2>
              Useful information first. More complex systems when they are
              justified.
            </h2>
          </div>
          <div className="prose">
            <p>
              A school information website is not automatically a student
              portal. A property website is not automatically connected to a
              listing feed. A restaurant page is not automatically a live
              reservation system.
            </p>
            <p>
              Portals, booking engines, property feeds and other integrations
              need a separate technical scope, approved accounts and an
              explanation of ongoing costs. A clear website with a direct
              enquiry route can be a sensible starting point.
            </p>
            <Link
              className="text-link mt-24"
              href="/portfolio#website-examples"
            >
              Explore independent website references{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <div className="inline-links">
              <Link className="text-link" href="/pricing">
                See starting packages{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--compact">
        <div className="container">
          <ClosingCTA
            title="Let’s plan a website around the people you serve."
            description="Tell us about your business, your customers and the information they need. We’ll discuss a practical direction and agree the scope."
          />
        </div>
      </section>
    </div>
  );
}
