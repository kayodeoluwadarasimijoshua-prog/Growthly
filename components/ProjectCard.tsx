import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ProjectConcept } from "@/config/content";
import Link from "next/link";

export function ProjectCard({ project }: { project: ProjectConcept }) {
  return (
    <article className="project-card">
      <Link
        className="project-card__visual"
        href={`/portfolio/${project.slug}`}
        aria-label={`Self-initiated concept: read the ${project.name} case study`}
      >
        <Image
          src={project.image}
          alt={project.imageAlt}
          width={1200}
          height={840}
          sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
        />
        <span className="project-card__tag">Self-initiated concept</span>
      </Link>
      <div className="project-card__body">
        <div className="project-card__meta">{project.category}</div>
        <h3>{project.name}</h3>
        <p>{project.summary}</p>
        <Link className="text-link" href={`/portfolio/${project.slug}`}>
          Explore the concept <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
