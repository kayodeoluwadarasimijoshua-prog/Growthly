import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Compass, FileCheck2, MessageSquareText, PenTool } from "lucide-react";
import { HeroArtwork } from "@/components/HeroArtwork";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceRow } from "@/components/ServiceRow";
import { ProcessSteps } from "@/components/ProcessSteps";
import { PackageGrid } from "@/components/PackageGrid";
import { FAQList } from "@/components/FAQList";
import { ClosingCTA } from "@/components/ClosingCTA";
import { StartProjectLink } from "@/components/ContactLinks";
import { services, projects } from "@/config/content";
import { pageMetadata } from "@/lib/seo";

const homeMetadata = pageMetadata(
  "Digital services for growing Nigerian businesses",
  "Professional graphic design, websites, AI-assisted video and practical marketing support for Nigerian small businesses and growing brands.",
  "/",
);

export const metadata: Metadata = {
  ...homeMetadata,
  title: "Digital services for growing Nigerian businesses | GROWTHLY",
};

const principles = [
  {
    icon: MessageSquareText,
    title: "Clear communication",
    text: "You know what happens next, what we need from you and who to contact throughout the project.",
  },
  {
    icon: FileCheck2,
    title: "Defined deliverables",
    text: "The written scope names what is included, the review rounds, timing and costs that sit outside it.",
  },
  {
    icon: Compass,
    title: "Practical choices",
    text: "Recommendations start with your business goals and current setup—not a tool or trend looking for a use.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Creative support for growing businesses</span>
            <h1>Your business has potential. <em>Let’s help it grow.</em></h1>
            <p className="lede">
              Professional design, websites and marketing solutions built around your business goals.
            </p>
            <div className="hero-actions">
              <StartProjectLink label="Start your project" />
              <Link className="button button--outline" href="/work">
                View our work <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="hero-proof" aria-label="How GROWTHLY works">
              <span><Check size={14} aria-hidden="true" /> Clear scope</span>
              <span><Check size={14} aria-hidden="true" /> Thoughtful execution</span>
              <span><Check size={14} aria-hidden="true" /> Human communication</span>
            </div>
          </div>
          <HeroArtwork />
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeading
            eyebrow="Selected creative concepts"
            title="Thoughtful ideas, made tangible."
            description="These self-initiated concepts show the kind of design thinking GROWTHLY can bring to a project. They are clearly labelled sample work—not commissioned client projects."
            action={<Link className="text-link" href="/work">Explore all concepts <ArrowRight size={16} aria-hidden="true" /></Link>}
          />
          <div className="project-grid">
            {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
          </div>
          <div className="concept-note mt-32">
            <PenTool size={17} aria-hidden="true" />
            <span>GROWTHLY is building its commissioned portfolio. Each project shown today is an original, self-initiated concept; no client results or project histories are implied.</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="What we can help with"
            title="The right support for your next step."
            description="Choose one service or bring us a broader brief. We’ll confirm the deliverables and fit before recommending a way forward."
            action={<Link className="text-link" href="/services">See all services <ArrowRight size={16} aria-hidden="true" /></Link>}
          />
          <div className="service-list">
            {services.map((service, index) => <ServiceRow key={service.slug} service={service} index={index} />)}
          </div>
        </div>
      </section>

      <section className="section section--mint">
        <div className="container">
          <div className="why-grid">
            <div className="why-grid__intro">
              <span className="eyebrow">A thoughtful partner</span>
              <h2>Good work starts with a clear brief.</h2>
              <p>
                GROWTHLY brings creative and practical digital support together. We keep the conversation direct, the scope visible and the next step easy to understand.
              </p>
            </div>
            <div className="principle-list">
              {principles.map(({ icon: Icon, title, text }) => (
                <article className="principle" key={title}>
                  <span className="principle__icon"><Icon size={17} aria-hidden="true" /></span>
                  <div><h3>{title}</h3><p>{text}</p></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="A simple, shared process"
            title="From first conversation to final handover."
            description="We agree the work before it starts, then make room for useful feedback at the right moments."
          />
          <ProcessSteps />
          <div className="mt-32"><StartProjectLink label="Tell us about your project" /></div>
        </div>
      </section>

      <section className="section section--soft" id="pricing">
        <div className="container">
          <PackageGrid heading />
          <p className="form-fineprint mt-24">
            Looking for graphic design, video, social media, advertising or automation? Those services are quoted separately from a brief; these package prices do not apply to them.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container faq-layout">
          <div className="faq-layout__intro">
            <span className="eyebrow">Good to know</span>
            <h2>Before we begin.</h2>
            <p>Clear answers now make the first conversation easier.</p>
            <Link className="text-link mt-24" href="/contact">Ask a different question <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <FAQList />
        </div>
      </section>

      <section className="section section--compact">
        <div className="container"><ClosingCTA /></div>
      </section>
    </>
  );
}
