import { getSiteSettings } from "@/lib/cms/public";
import Link from "next/link";
import { HandoverDecisions } from "@/components/WebsiteCapabilities";
import { ArrowRight, Check } from "lucide-react";
import { ClosingCTA } from "@/components/ClosingCTA";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { ProcessSteps } from "@/components/ProcessSteps";
import { ProjectPreparation } from "@/components/CustomerJourney";
import { pageMetadata } from "@/lib/seo";
import { seoPages } from "@/config/seo";
export const metadata = pageMetadata(
  seoPages.about.title,
  seoPages.about.description,
  "/about",
);
const principles = [
  [
    "Understand the business first",
    "We start with your customers, your offer and the job your website needs to do. The design should support those needs, not distract from them.",
  ],
  [
    "Make the scope visible",
    "Pages, features, content responsibilities, review rounds, costs and timing belong in a written proposal—not assumptions.",
  ],
  [
    "Use technology with a reason",
    "A useful website does not need every tool on the market. We discuss integrations, accounts and ongoing costs before making them part of your project.",
  ],
  [
    "Keep the relationship human",
    "Useful feedback and clear approvals matter. You have a direct WhatsApp or phone route to discuss the work, not an automated sales maze.",
  ],
];
export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <div className="professional-sales-page">
      <PageIntro
        label="About Growthly"
        path="/about"
        eyebrow="Website-first. Business-focused."
        title="Good websites begin with understanding your business."
        description={settings.aboutIntro}
        aside={
          <>
            <strong>Our point of view</strong>A website should help a real
            customer understand a real business. Clarity, thoughtful
            presentation and useful contact routes come before unnecessary
            complexity.
          </>
        }
      />
      <section className="section">
        <div className="container editorial-split">
          <div>
            <span className="eyebrow">About Growthly</span>
            <h2>A practical partner for your next step online.</h2>
          </div>
          <div className="prose">
            <p>
              For many growing businesses, social media is where the
              conversation starts. A website adds a place where your information
              stays organised: what you do, who it is for, the products or
              services you offer and how an interested customer can reach you.
            </p>
            <p>
              We shape that online presence around your business. Website
              development is our primary service, supported by graphic design,
              AI-assisted video, social media and digital advertising when they
              have a clear role in the brief.
            </p>
            <p>
              You do not have to arrive with a technical specification. We help
              turn your goals into a suitable direction, then confirm the scope,
              price and responsibilities before work begins.
            </p>
            <Link className="text-link mt-24" href="/services">
              Explore our website & supporting services{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            eyebrow="How we approach the work"
            title="Clear thinking. Considered design. Practical decisions."
            description="The way we work should be as understandable as the website we create."
          />
          <div className="principles-grid">
            {principles.map(([title, text], index) => (
              <article key={title}>
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
            <span className="eyebrow">Who we work with</span>
            <h2>
              Businesses with something useful to offer—and a clearer story to
              tell.
            </h2>
          </div>
          <div>
            <p>
              Our website solutions can suit entrepreneurs, service businesses,
              retailers, schools, property businesses and growing teams. We
              assess each project on its actual requirements rather than assume
              every business needs the same pages or systems.
            </p>
            <ul className="check-list mt-24">
              {[
                "A first professional website beyond social media",
                "Clearer services, products and enquiry routes",
                "An online store or a more useful product catalogue",
                "A focused redesign of an existing website",
              ].map((item) => (
                <li key={item}>
                  <Check size={17} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link className="text-link mt-24" href="/portfolio">
              See our published work & website examples{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="section section--mint">
        <div className="container">
          <SectionHeading
            eyebrow="From first conversation to handover"
            title="You should know what happens next."
            description="We discuss the brief, agree the plan, build and review, then launch after approval and the agreed payment milestones."
          />
          <ProcessSteps />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ProjectPreparation />
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            eyebrow="A shared project, clear responsibilities"
            title="We shape the website. You remain the source of truth about your business."
            description="A good working relationship needs useful information, timely decisions and an agreed scope—not technical knowledge on your side."
          />
          <div className="handover-grid">
            <article>
              <h3>Growthly’s role</h3>
              <p>
                Translate the agreed brief into a page structure and design,
                build the scoped functionality, review it with you and test the
                delivered journey before approved launch. We explain proposed
                technical choices and identify accounts or paid tools that need
                your decision.
              </p>
            </article>
            <article>
              <h3>Your role</h3>
              <p>
                Supply or approve accurate business information and assets you
                can use, identify the right contact destinations and review the
                work against the brief. You approve the content and scope;
                specialist claims, product policies and required third-party
                accounts remain your business’s responsibility.
              </p>
            </article>
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
          <ClosingCTA
            title="Let’s give your business a website with a clear purpose."
            description="Share your business, your customers and what you want to make easier. We’ll discuss a practical direction and a written scope."
          />
        </div>
      </section>
    </div>
  );
}
