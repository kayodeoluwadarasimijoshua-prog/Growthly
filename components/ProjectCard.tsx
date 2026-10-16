import { ArrowUpRight } from "lucide-react";
import type { PortfolioProject } from "@/config/content";
import { ProjectPreview } from "@/components/ProjectPreview";
import Link from "next/link";
export function ProjectCard({
  project,
  priority = false,
  headingLevel = 2,
}: {
  project: PortfolioProject;
  priority?: boolean;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article
      className={`project-card project-card--client${project.image ? "" : " project-card--text-only"}`}
    >
      {project.image && (
        <Link
          className="project-card__visual"
          href={`/portfolio/${project.slug}`}
        >
          <span className="sr-only">{project.name} project details. </span>
          <ProjectPreview project={project} priority={priority} />
          <span
            className={`project-card__tag project-card__tag--client${project.image.kind === "screenshot" ? " project-card__tag--screenshot" : ""}`}
          >
            {project.kind === "demonstration"
              ? "Demonstration"
              : !project.service || project.service === "website-development"
                ? "Client website"
                : "Client project"}
          </span>
        </Link>
      )}
      <div className="project-card__body">
        <div className="project-card__meta">{project.category}</div>
        {project.kind === "demonstration" && (
          <p className="capability-label">
            Self-initiated demonstration · not client work
          </p>
        )}
        <Heading>{project.name}</Heading>
        <p>{project.summary}</p>
        <div className="project-card__links">
          <Link className="text-link" href={`/portfolio/${project.slug}`}>
            View project details{" "}
            <span className="sr-only">for {project.name}</span>{" "}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          {project.liveUrl && (
            <a
              className="text-link"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit live website <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only">
                {" "}
                for {project.name} (opens in a new tab)
              </span>
            </a>
          )}
          {project.videoUrl && (
            <a
              className="text-link"
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch video sample
              <span className="sr-only">
                {" "}
                on an external site (opens in a new tab)
              </span>
            </a>
          )}
        </div>
        {project.image && (
          <p className="project-image-credit">
            {project.image.kind === "screenshot"
              ? "Website screenshot."
              : project.image.kind === "artwork"
                ? "Project artwork."
                : "Homepage photo, not a website screenshot."}{" "}
            {project.image.credit}
            {!project.image.permissionConfirmed && (
              <span className="project-image-approval">
                {" "}
                Preview only — client publication permission pending.
              </span>
            )}
          </p>
        )}
      </div>
    </article>
  );
}
