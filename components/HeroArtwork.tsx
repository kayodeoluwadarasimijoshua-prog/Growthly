import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  getFeaturedProject,
  getPublishedProjects,
  getContentState,
} from "@/lib/cms/public";
import { ProjectPreview } from "@/components/ProjectPreview";

export async function HeroArtwork() {
  const state = await getContentState();
  const featured = await getFeaturedProject();
  const projects = await getPublishedProjects();
  const visual = featured?.image
    ? featured
    : !state.enabled
      ? projects.find(
          (project) =>
            project.image &&
            (project.service ?? "website-development") ===
              "website-development",
        )
      : undefined;
  if (!visual)
    return (
      <aside
        className="hero-project studio-hero-note"
        aria-label="Our approach"
      >
        <span className="eyebrow">Clear work. Clear next steps.</span>
        <h2>{featured?.name ?? "Build around your customers’ next step."}</h2>
        <p>
          {featured?.summary ??
            "A website, a visual identity or an advert should make your offer easier to understand."}
        </p>
        <Link
          className="text-link"
          href={featured ? `/portfolio/${featured.slug}` : "/portfolio"}
        >
          Explore the work <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <ul>
          <li>Purpose and scope explained</li>
          <li>Client work and demos labelled</li>
          <li>A written quote before you commit</li>
        </ul>
      </aside>
    );
  return (
    <aside
      className="hero-project studio-browser"
      aria-label="A preview of Growthly’s work"
    >
      <div className="studio-browser__bar">
        <span className="browser-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>{visual.name} · website preview</span>
        <ArrowUpRight size={14} aria-hidden="true" />
      </div>
      <Link
        href={`/portfolio/${visual.slug}`}
        className="studio-browser__screen"
        aria-label={`Explore ${visual.name} project`}
      >
        <ProjectPreview project={visual} priority />
      </Link>
      <div className="studio-browser__caption">
        <span className="eyebrow">
          {visual.kind === "client"
            ? "Client website"
            : "Self-initiated demo · not client work"}
        </span>
        <h2>{visual.name}</h2>
        <p>
          A real project preview. Explore its scope and the decisions behind it.
        </p>
      </div>
    </aside>
  );
}
