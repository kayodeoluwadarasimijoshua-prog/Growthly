import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { seoPages } from "@/config/seo";
import { getSiteSettings } from "@/lib/cms/public";
import { packagesFor, priceText } from "@/lib/cms/format";
import { ServiceGateway } from "@/components/ServiceGateway";
import { SupportingServiceSections } from "@/components/SupportingServiceSections";
import { pageMetadata } from "@/lib/seo";
import { StartProjectLink } from "@/components/ContactLinks";
import { HeroArtwork } from "@/components/HeroArtwork";
import {
  Solutions,
  WebsiteFAQ,
  IndustriesList,
  WhyGrowthly,
} from "@/components/WebsiteSections";
import {
  WebsiteOutcomes,
  WebsiteFitGuide,
  ProjectSpotlight,
} from "@/components/CustomerJourney";
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
            </div>
            <p className="hero-reassurance">
              Tell us what you need. We agree the scope and price before you
              commit.
            </p>
            <a
              className="text-link hero-other-services"
              href="#choose-your-service"
            >
              Looking for design, video or promotion? Find your service{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
          <HeroArtwork />
        </div>
      </section>
      <ServiceGateway />
      <nav className="journey-nav" aria-label="Explore website information">
        <div className="container">
          <span>Explore</span>
          {[
            ["Website solutions", "website-solutions"],
            ["Website features", "website-features"],
            ["Why Growthly", "why-growthly"],
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
      <section className="section" aria-labelledby="website-purpose-title">
        <div className="container">
          <div className="section-head">
            <div className="section-head__copy">
              <span className="eyebrow">More than an online address</span>
              <h2 id="website-purpose-title">
                Give interested customers a reason to take the next step.
              </h2>
              <p>
                Social media starts conversations. Your website gives those
                conversations a home: your offer, your information and a clear
                way to reach you.
              </p>
            </div>
            <p className="section-side-note">
              Designed around what your customers need to know—not just what
              looks good on a screen.
            </p>
          </div>
          <WebsiteOutcomes />
        </div>
      </section>
      <section
        className="section section--soft"
        id="website-solutions"
        aria-label="Website solutions"
      >
        <div className="container">
          <SectionHeading
            eyebrow="The right website for your business"
            title="Different goals. A website that fits."
            description="A service business, a shop and a school need different information. We plan the pages and features around your offer and the people you want to reach."
          />
          <Solutions />
          <div className="section-footer">
            <p>
              Already have a website? We can review what is useful and plan a
              focused redesign.
            </p>
            <Link className="text-link" href="/website-development">
              Explore website development{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section
        className="section"
        id="website-features"
        aria-label="Website features and scope"
      >
        <div className="container">
          <WebsiteCapabilities preview />
        </div>
      </section>
      <section
        className="section"
        id="why-growthly"
        aria-label="Why choose Growthly"
      >
        <div className="container">
          <WhyGrowthly />
          <div className="section-footer">
            <p>
              Website development is our primary focus. Communication and scope
              stay clear from the first brief to handover.
            </p>
            <Link className="text-link" href="/about">
              About Growthly & our approach{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section
        className="section section--mint"
        id="our-work"
        aria-label="Real website work"
      >
        <div className="container">
          <ProjectSpotlight />
        </div>
      </section>
      <section
        className="section"
        id="packages"
        aria-label="Website packages and prices"
      >
        <div className="container">
          <PackageGrid heading />
          <div className="section-footer">
            <p>
              Starter, Business and E-commerce—all with an agreed scope and
              first-year domain/hosting offer.
            </p>
            <Link className="text-link" href="/pricing">
              Compare packages & separate costs{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section
        className="section section--soft"
        aria-label="Find a suitable website package"
      >
        <div className="container">
          <WebsiteFitGuide />
        </div>
      </section>
      <section
        className="section"
        id="our-process"
        aria-label="Website project process"
      >
        <div className="container">
          <SectionHeading
            eyebrow="From first brief to launch"
            title="A clear process. No guessing what comes next."
            description="We agree the scope before we build, review the work with you and check the customer journey before launch. Timing depends on your content and requirements."
          />
          <ProcessSteps />
        </div>
      </section>
      <section
        className="section section--soft"
        aria-label="Websites for different businesses"
      >
        <div className="container">
          <SectionHeading
            eyebrow="Built around your customers"
            title="Your business has its own story. Let’s make it easy to understand."
            description="Practical website applications for retailers, schools, property businesses, professional services and more—not claims of specialist client experience."
          />
          <IndustriesList headingLevel={3} />
          <div className="section-footer">
            <p>
              We choose features for your needs rather than add complexity you
              will not use.
            </p>
            <Link className="text-link" href="/industries">
              Website ideas for your industry{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section
        className="section supporting-section"
        aria-label="Supporting creative and marketing services"
      >
        <div className="container">
          <SectionHeading
            eyebrow="Support beyond the website"
            title="Bring your website, visuals and campaigns into the same conversation."
            description="You can commission graphic design, AI video adverts, social media, ads and promotion, or scoped automation separately. Choose the relevant service below; you do not have to buy a website first."
            action={
              <Link className="text-link" href="/services">
                All Growthly services{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            }
          />
          <SupportingServiceSections />
        </div>
      </section>
      <section
        className="section section--soft"
        id="questions"
        aria-label="Website questions and answers"
      >
        <div className="container faq-layout">
          <SectionHeading
            eyebrow="Before you invest"
            title="Good questions. Straightforward answers."
            description="Understand the cost, content, domain, process and ongoing responsibilities before choosing your website."
            action={
              <Link className="text-link" href="/contact">
                Ask Growthly a question{" "}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            }
          />
          <WebsiteFAQ />
        </div>
      </section>
      <section
        className="section section--compact"
        aria-label="Request a website quote"
      >
        <div className="container">
          <ClosingCTA />
        </div>
      </section>
    </div>
  );
}
