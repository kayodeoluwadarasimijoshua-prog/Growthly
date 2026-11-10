import Link from "next/link";
import { ArrowRight, Check, Code2, Palette, Clapperboard } from "lucide-react";
import { seoPages } from "@/config/seo";
import { getSiteSettings, getPublishedProjects } from "@/lib/cms/public";
import { packagesFor, priceText } from "@/lib/cms/format";
import { ServiceGateway } from "@/components/ServiceGateway";
import { pageMetadata } from "@/lib/seo";
import { HeroArtwork } from "@/components/HeroArtwork";
import { WebsiteFAQ } from "@/components/WebsiteSections";
import { WebsiteFitGuide } from "@/components/CustomerJourney";
import { SectionHeading } from "@/components/SectionHeading";
import { ProcessSteps } from "@/components/ProcessSteps";
import { PackageGrid } from "@/components/PackageGrid";
import { ClosingCTA } from "@/components/ClosingCTA";
import { WebsiteCapabilities } from "@/components/WebsiteCapabilities";
import { ProjectCard } from "@/components/ProjectCard";
import { PortfolioNavigation } from "@/components/PortfolioNavigation";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return pageMetadata(
    seoPages.home.title,
    priceText(seoPages.home.description, settings),
    "/",
  );
}
export default async function HomePage() {
  const settings = await getSiteSettings();
  const packages = packagesFor(settings);
  const projects = (await getPublishedProjects()).slice(0, 2);
  return (
    <div className="professional-sales-page home-sales-page studio-home">
      <section
        className="hero website-hero"
        aria-label="Websites, design and AI adverts for Nigerian businesses"
      >
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="status-dot" /> A creative & digital studio for
              Nigerian businesses
            </span>
            <h1>
              {settings.homeHeadline}
              {settings.homeEmphasis && (
                <>
                  {" "}
                  <em>{settings.homeEmphasis}</em>
                </>
              )}
            </h1>
            <p>{settings.homeIntro}</p>
            <div className="studio-offer-tags" aria-label="Our core services">
              <span>
                <Code2 size={16} aria-hidden="true" />
                Websites
              </span>
              <span>
                <Palette size={16} aria-hidden="true" />
                Graphic design
              </span>
              <span>
                <Clapperboard size={16} aria-hidden="true" />
                AI adverts
              </span>
            </div>
            <div className="hero-actions">
              <Link className="button button--primary" href="/services">
                Find your service <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a className="text-link" href="#our-work">
                See our work <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            <p className="hero-reassurance">
              <Check size={15} aria-hidden="true" /> Clear scope. A written
              quote. Work you can review.
            </p>
            <p className="hero-starting-price">
              Business websites {packages[0].price.toLowerCase()}. Graphic
              design and AI adverts quoted to your brief.
            </p>
          </div>
          <HeroArtwork />
        </div>
      </section>
      <nav className="journey-nav" aria-label="Explore Growthly">
        <div className="container">
          <span>Explore</span>
          {[
            ["Our work", "our-work"],
            ["Services", "choose-your-service"],
            ["Website options", "website-solutions"],
            ["Packages", "packages"],
            ["Our process", "our-process"],
            ["Questions", "questions"],
          ].map(([label, id]) => (
            <a href={`#${id}`} key={id}>
              {label}
            </a>
          ))}
        </div>
      </nav>
      <section
        className="section section--soft studio-work"
        id="our-work"
        aria-label="Selected Growthly projects"
      >
        <div className="container">
          <SectionHeading
            eyebrow="Work you can explore"
            title="See what we do. Understand the thinking."
            description="Actual client work and self-initiated demonstrations, clearly labelled. Explore the scope, the visual direction and the decisions behind each project."
            action={
              <Link className="text-link" href="/portfolio">
                All projects <ArrowRight size={16} aria-hidden="true" />
              </Link>
            }
          />
          <PortfolioNavigation />
          <div className="studio-work-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project.slug}
                project={project}
                headingLevel={3}
              />
            ))}
          </div>
          {!projects.length && (
            <p>
              Explore our services and share your brief. Approved projects will
              appear here when they are published.
            </p>
          )}
        </div>
      </section>
      <ServiceGateway compact />
      <section
        className="section"
        id="website-solutions"
        aria-label="Website options"
      >
        <div className="container">
          <details className="home-feature-guide">
            <summary>
              Planning a website? Compare the right starting points.
            </summary>
            <div className="home-feature-guide__body">
              <WebsiteFitGuide />
            </div>
          </details>
          <details className="home-feature-guide" id="website-features">
            <summary>
              Explore website features and what we agree in the scope
            </summary>
            <div className="home-feature-guide__body">
              <WebsiteCapabilities preview />
            </div>
          </details>
          <div className="home-detail-links">
            <Link className="text-link" href="/website-development">
              Explore website development{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section
        className="section section--soft"
        id="packages"
        aria-label="Website packages and prices"
      >
        <div className="container">
          <PackageGrid heading compact />
          <div className="section-footer">
            <p>
              First-year .com.ng domain and hosting included in website
              packages. Renewals and separate costs are confirmed in writing.
            </p>
            <Link className="text-link" href="/pricing">
              Compare inclusions & separate costs{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section
        className="section"
        id="our-process"
        aria-label="Our project process"
      >
        <div className="container">
          <SectionHeading
            eyebrow="A clear way to work together"
            title="From your first idea to the finished work."
            description="We discuss the goal, agree the scope, create and review the work, then deliver the agreed outcome. Timing depends on the project, content and feedback."
          />
          <ProcessSteps />
          <div className="home-commitments" id="why-growthly">
            <h3>Know what you’re agreeing to.</h3>
            <ul className="check-list">
              {[
                "Deliverables, payment milestones and revisions agreed in writing.",
                "Project permissions, ownership, recurring costs and responsibilities explained.",
                "A review of the finished work and a handover for the agreed scope.",
              ].map((item) => (
                <li key={item}>
                  <Check size={17} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link className="text-link" href="/about">
              Meet the team & our approach{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section
        className="section section--soft"
        id="questions"
        aria-label="Common project questions"
      >
        <div className="container faq-layout">
          <SectionHeading
            eyebrow="Before we get started"
            title="A few things you might be wondering."
            description="Not sure which service fits? Tell us your goal. We’ll explain what is included and confirm the details in your proposal."
          />
          <WebsiteFAQ limit={6} includeStudio />
        </div>
      </section>
      <section className="section section--compact">
        <div className="container">
          <ClosingCTA
            chooseService
            title="Let’s make your next project a clear step forward."
            description="A website, a design or an advert: tell us what you need and who it is for. We’ll discuss a practical direction and an honest scope."
          />
        </div>
      </section>
    </div>
  );
}
