import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { StartProjectLink } from "@/components/ContactLinks";
import { HeroArtwork } from "@/components/HeroArtwork";
import { SectionHeading } from "@/components/SectionHeading";
import {
  Solutions,
  WorkPreview,
  WebsiteFAQ,
  IndustriesList,
  Standards,
  WhyGrowthly,
} from "@/components/WebsiteSections";
import { ProcessSteps } from "@/components/ProcessSteps";
import { PackageGrid } from "@/components/PackageGrid";
import { ClosingCTA } from "@/components/ClosingCTA";
export const metadata = pageMetadata(
  "Website development for Nigerian businesses",
  "Get a professional business website, online store or landing page from Growthly. Explore original website concepts and request a scoped quote.",
  "/",
);
export default function HomePage() {
  return (
    <>
      <section className="hero website-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="status-dot" /> Website development for Nigerian
              businesses
            </span>
            <h1>
              Your business deserves more than just <em>social media.</em>
            </h1>
            <p>
              Get a professional website that helps customers discover your
              business, explore your products or services, and contact you with
              confidence.
            </p>
            <div className="hero-actions">
              <StartProjectLink />
              <Link className="button button--outline" href="/portfolio">
                View Our Work <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
            <div className="hero-assurances">
              <span>
                <Check size={15} aria-hidden="true" /> Clear scope
              </span>
              <span>
                <Check size={15} aria-hidden="true" /> Mobile-first
              </span>
              <span>
                <Check size={15} aria-hidden="true" /> Built around your
                business
              </span>
            </div>
          </div>
          <HeroArtwork />
        </div>
      </section>
      <div className="container">
        <Standards />
      </div>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Your next step online"
            title="The right website for the way you do business."
            description="From a simple business presence to an online store, we shape the website around your offer, your customers and your next stage."
          />
          <Solutions />
          <div className="secondary-services">
            <span>Need more than a website?</span>
            <p>
              AI video adverts · Graphic design · Social media management ·
              Digital advertising
            </p>
            <Link className="text-link" href="/services">
              Explore supporting services{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <WorkPreview />
      <section className="section section--mint">
        <div className="container">
          <WhyGrowthly />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="From brief to launch"
            title="A clear process. No guessing what comes next."
            description="We agree the scope before we build. Timelines depend on content readiness, revisions and the integrations your project needs."
          />
          <ProcessSteps />
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <PackageGrid heading />
          <div className="mt-24">
            <Link className="text-link" href="/pricing">
              Understand packages & separate costs{" "}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Different businesses. Practical solutions."
            title="A website that speaks your customers’ language."
            description="These are possible website applications, not claims of specialist client experience."
          />
          <IndustriesList />
        </div>
      </section>
      <section className="section section--soft">
        <div className="container faq-layout">
          <div className="faq-layout__intro">
            <span className="eyebrow">Good questions, honest answers</span>
            <h2>Before you invest in a website.</h2>
            <p>Know what’s involved, what’s separate and how to get started.</p>
            <Link className="text-link mt-24" href="/contact">
              Ask us a question <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <WebsiteFAQ />
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
