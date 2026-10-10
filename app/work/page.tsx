import type { Metadata } from "next";
import { PenTool } from "lucide-react";
import { projects } from "@/config/content";
import { ProjectCard } from "@/components/ProjectCard";
import { ClosingCTA } from "@/components/ClosingCTA";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Selected creative concepts",
  "Explore original, self-initiated GROWTHLY concepts for a product brand, a hospitality website and a creative portfolio.",
  "/work",
);

export default function WorkPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__grid">
          <div>
            <span className="eyebrow">Our work</span>
            <h1>Considered creative, with the thinking out in the open.</h1>
            <p>Browse sample directions created to show how design and digital structure can support a business goal.</p>
          </div>
          <div className="page-hero__aside">
            <strong>Important context</strong>
            GROWTHLY has not supplied client project histories for this site. Every item shown here is labelled as a self-initiated concept; none represents a commissioned client or a measured result.
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="concept-note" role="note">
            <PenTool size={17} aria-hidden="true" />
            <span>These fictional concepts are original visual samples, not client case studies. Hospitality booking, retail checkout and business results are not represented as live or verified.</span>
          </div>
          <div className="project-grid mt-32">
            {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
          </div>
        </div>
      </section>
      <section className="section section--soft section--compact">
        <div className="container"><ClosingCTA title="Have a real project to bring to life?" description="Tell us about the business behind the brief and what you’d like your next customers to understand." /></div>
      </section>
    </>
  );
}
