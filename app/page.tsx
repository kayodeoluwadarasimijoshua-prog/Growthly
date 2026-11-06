import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { seoPages } from "@/config/seo";
import { getSiteSettings } from "@/lib/cms/public";
import { packagesFor, priceText } from "@/lib/cms/format";
import { ServiceGateway } from "@/components/ServiceGateway";
import { pageMetadata } from "@/lib/seo";
import { StartProjectLink } from "@/components/ContactLinks";
import { HeroArtwork } from "@/components/HeroArtwork";
import { WebsiteFAQ } from "@/components/WebsiteSections";
import { WebsiteFitGuide } from "@/components/CustomerJourney";
import { SectionHeading } from "@/components/SectionHeading";
import { ProcessSteps } from "@/components/ProcessSteps";
import { PackageGrid } from "@/components/PackageGrid";
import { ClosingCTA } from "@/components/ClosingCTA";
import { WebsiteCapabilities } from "@/components/WebsiteCapabilities";

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return pageMetadata(
    seoPages.home.title,
    priceText(seoPages.home.description, settings),
    seoPages.home.path,
  );
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  const websitePackages = packagesFor(settings);
  return (
    <div className="professional-sales-page home-sales-page">
      <section
        className="hero website-hero"
        aria-label="Website development and project proof"
      >
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="status-dot" /> Website design & development in
              Nigeria
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
            <p className="hero-starting-price">
              Multi-page websites {websitePackages[0].price.toLowerCase()} NGN.
              Free .com.ng domain + hosting for the first year.
            </p>
            <div className="hero-assurances" aria-label="Website benefits">
              <span>
                <Check size={15} aria-hidden="true" /> Mobile-friendly
              </span>
              <span>
                <Check size={15} aria-hidden="true" /> Clear scope
              </span>
              <span>
                <Check size={15} aria-hidden="true" /> WhatsApp enquiries
              </span>
            </div>
            <div className="hero-actions">
              <StartProjectLink />
              <a className="text-link" href="#our-work">
                See our work <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            <p className="hero-reassurance">
              Receive a written scope and quote before you commit.
            </p>
            <a
              className="text-link hero-other-services"
              href="#choose-your-service"
            >
              Need design, video or promotion? Find your service{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <HeroArtwork />
        </div>
      </section>

      <ServiceGateway compact />

      <nav className="journey-nav" aria-label="Explore website information">
        <div className="container">
          <span>Explore</span>
          {[
            ["Website options", "website-solutions"],
            ["Features & scope", "website-features"],
            ["Our work", "our-work"],
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
        className="section"
        id="website-solutions"
        aria-label="Website options"
      >
        <div className="container">
          <WebsiteFitGuide />
          <details className="home-feature-guide" id="website-features">
            <summary>
              Explore website features and what we agree in the scope
            </summary>
            <div className="home-feature-guide__body">
              <WebsiteCapabilities preview />
            </div>
          </details>
          <div className="section-footer home-detail-links">
            <Link className="text-link" href="/website-development">
              Website development details{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="text-link" href="/industries">
              Ideas for your industry{" "}
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
            <Link className="text-link" href="/pricing">
              Compare full inclusions, timing & separate costs{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="section"
        id="our-process"
        aria-label="Website project process"
      >
        <div className="container">
          <SectionHeading
            eyebrow="From your brief to launch"
            title="Know the plan before the build begins."
            description="We agree the work, review it with you and hand over the finished website. Timing depends on the scope, content and feedback."
          />
          <ProcessSteps />
          <div className="home-commitments" id="why-growthly">
            <h3>What you can expect</h3>
            <ul className="check-list">
              {[
                "Pages, features, payment milestones and revisions agreed in writing.",
                "Domain ownership, renewal costs and support responsibilities explained before launch.",
                "A mobile review, working contact routes and a handover for the agreed scope.",
              ].map((item) => (
                <li key={item}>
                  <Check size={17} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link className="text-link" href="/about">
              About Growthly & our approach{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="section section--soft"
        id="questions"
        aria-label="Website questions and answers"
      >
        <div className="container faq-layout">
          <SectionHeading
            eyebrow="Before you get started"
            title="Your first questions, answered."
            description="Starting costs, timing and what your project needs. We confirm the details in your proposal."
            action={
              <Link className="text-link" href="/website-development">
                More website questions{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            }
          />
          <WebsiteFAQ limit={6} />
        </div>
      </section>

      <section
        className="section section--compact"
        aria-label="Request a website quote"
      >
        <div className="container">
          <ClosingCTA
            title="Tell us what your website needs to do."
            description="Share your business and your goal. We’ll discuss a suitable website, the scope and your next step."
          />
        </div>
      </section>
    </div>
  );
}
