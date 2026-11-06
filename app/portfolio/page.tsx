import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedProjects } from "@/lib/cms/public";
import { seoPages } from "@/config/seo";
import { pageMetadata } from "@/lib/seo";
import { ProjectCard } from "@/components/ProjectCard";
import { ClosingCTA } from "@/components/ClosingCTA";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { IndependentWebsiteExamples } from "@/components/CustomerJourney";
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
        eyebrow="Published Growthly work"
        title="See the work. Understand the decisions."
        description="Explore Growthly’s published projects, the work delivered and the decisions behind each website. Start with the actual scope, then discuss what your business needs."
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
          <details className="home-feature-guide portfolio-inspiration">
            <summary>
              Independent website references — not Growthly projects
            </summary>
            <div className="home-feature-guide__body">
              <IndependentWebsiteExamples />
            </div>
          </details>
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
