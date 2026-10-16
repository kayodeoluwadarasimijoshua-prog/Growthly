import { getFeaturedProject } from "@/lib/cms/public";
import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
/** One authentic project as proof, replacing the fictional hero mockup. */
export async function HeroArtwork() {
  const project = await getFeaturedProject();
  if (!project)
    return (
      <div className="hero-project service-focus-panel">
        <h2>Build around your customers’ next step.</h2>
        <p>
          Explore website features, agreed scope and the process before
          preparing your brief.
        </p>
        <Link className="text-link" href="/website-development">
          Explore website development
        </Link>
      </div>
    );
  return (
    <div className="hero-project">
      <ProjectCard project={project} priority />
    </div>
  );
}
