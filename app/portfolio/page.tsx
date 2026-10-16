import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedProjects } from "@/lib/cms/public";
import { seoPages } from "@/config/seo";
import { pageMetadata } from "@/lib/seo";
import { ProjectCard } from "@/components/ProjectCard";
import { ClosingCTA } from "@/components/ClosingCTA";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import {
  IndependentWebsiteExamples,
  ProjectPreparation,
} from "@/components/CustomerJourney";
export const metadata = pageMetadata(
  seoPages.portfolio.title,
  seoPages.portfolio.description,
  "/portfolio",
);
export default async function PortfolioPage() {
  const projects = await getPublishedProjects();
  return (
    <div className="professional-sales-page">
      <PageIntro
        label="Our work"
        path="/portfolio"
        eyebrow="Published work & useful directions"
        title="Real work. Clear ideas for what comes next."
        description="Explore published Growthly work, understand the decisions behind it and use clearly labelled independent references to discuss your project."
        aside={
          <>
            <strong>Work and inspiration stay separate.</strong>Client projects
            are identified below. Independent website examples are not
            commissions, endorsements or evidence of Growthly results.
          </>
        }
      />
      <section className="section" aria-label="Growthly published projects">
        <div className="container">
          <SectionHeading
            eyebrow="Published Growthly projects"
            title="Explore the work and the thinking behind it."
            description="Each project identifies the service provided, purpose and actual work. Client work and self-initiated demonstrations are labelled separately, without unmeasured traffic, conversion or sales claims."
          />
          <div className="portfolio-layout">
            {projects.length === 0 && (
              <p>
                No projects are currently published. Explore our services to
                discuss your brief.
              </p>
            )}
            {projects.map((project) => (
              <ProjectCard
                project={project}
                headingLevel={3}
                key={project.slug}
              />
            ))}
            <aside className="portfolio-context">
              <span className="eyebrow">What to look for</span>
              <h3>Look beyond the first screen.</h3>
              <p>
                How is the business explained? Can a visitor find the right
                service? Is the next step clear on mobile?
              </p>
              <p>
                A good project conversation considers those details alongside
                the visual direction.
              </p>
              <Link className="text-link mt-24" href="/website-development">
                Explore website solutions{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </div>
      </section>
      <section
        className="section section--soft"
        aria-label="Independent website inspiration"
      >
        <div className="container">
          <IndependentWebsiteExamples />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ProjectPreparation />
          <div className="section-footer">
            <p>
              Have a website you like? Share the public link and tell us which
              details are useful—not just “make it exactly the same”.
            </p>
            <Link className="text-link" href="/contact">
              Discuss your website direction{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            eyebrow="Turn a reference into a useful brief"
            title="Tell us what works for your customers—not just which website looks good."
            description="A reference is a conversation aid. Your website should have its own content, identity and realistic scope."
          />
          <div className="outcome-grid">
            {[
              [
                "Identify the detail you like",
                "Is it the service explanation, product categorisation, programme information or contact route? A specific observation is more useful than asking for a whole site to be copied.",
              ],
              [
                "Explain the job it needs to do",
                "Tell us who would use that feature and what they need to find or complete. A useful information pattern may transfer without needing the reference site’s entire platform.",
              ],
              [
                "Separate design from functionality",
                "A similar layout does not mean the same payment system, account portal, inventory tools or integrations. We assess those requirements and costs independently before committing.",
              ],
            ].map(([title, text], index) => (
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
      <section className="section section--compact">
        <div className="container">
          <ClosingCTA
            title="Your business deserves its own considered website."
            description="Tell us what you offer and which ideas matter to you. We’ll discuss a suitable design direction and a realistic scope."
          />
        </div>
      </section>
    </div>
  );
}
