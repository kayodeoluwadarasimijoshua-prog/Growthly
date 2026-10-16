import { BreadcrumbTrail } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import type { Metadata } from "next";
import { ProjectPreview } from "@/components/ProjectPreview";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getServicePage, sentenceServiceName } from "@/config/service-pages";
import { projects } from "@/config/content";
import { getPublishedProjects } from "@/lib/cms/public";
import { ClosingCTA } from "@/components/ClosingCTA";
import { pageMetadata } from "@/lib/seo";
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getPublishedProjects()).find((p) => p.slug === slug);
  return project
    ? pageMetadata(
        `${project.name} ${!project.service || project.service === "website-development" ? "Website" : "Creative"} Project`,
        project.summary,
        `/portfolio/${slug}`,
      )
    : {};
}
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = (await getPublishedProjects()).find((p) => p.slug === slug);
  if (!project) notFound();
  const service = getServicePage(project.service ?? "website-development")!;
  const isWebsite = service.slug === "website-development";
  return (
    <div
      className="professional-sales-page"
      data-published-project={`/portfolio/${project.slug}`}
    >
      <section className="page-hero">
        <div className="container">
          <BreadcrumbTrail
            items={[
              { name: "Our work", path: "/portfolio" },
              { name: project.name, path: `/portfolio/${slug}` },
            ]}
          />
          <Link className="text-link" href="/portfolio">
            <ArrowLeft size={16} aria-hidden="true" /> Back to our work
          </Link>
          <span className="eyebrow mt-24">
            {project.kind === "demonstration"
              ? "Self-initiated demonstration"
              : "Client project"}{" "}
            · {project.category}
          </span>
          <h1>{project.name}</h1>
          <p>{project.summary}</p>
          {project.liveUrl && (
            <a
              className="text-link mt-24"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit live website <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {project.videoUrl && (
            <a
              className="text-link mt-24"
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch video sample{" "}
              <span className="sr-only">
                on an external site (opens in a new tab)
              </span>
            </a>
          )}
        </div>
      </section>
      <section className="section">
        <div
          className={`container project-case-grid${project.image ? "" : " project-case-grid--text-only"}`}
        >
          {project.image && (
            <figure>
              <ProjectPreview project={project} priority />
              <figcaption className="project-image-credit">
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
              </figcaption>
            </figure>
          )}
          <div>
            <h2>What we delivered</h2>
            <p>{project.overview}</p>
            <ul className="case-feature-list">
              {project.scope.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="form-fineprint">{project.note}</p>
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <div className="case-purpose">
            <h2>
              {isWebsite
                ? "The purpose behind the pages"
                : "The purpose behind the work"}
            </h2>
            <p>{project.creativeIntent}</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Design & content decisions"
            title="Making the important information easier to find."
            description="These decisions describe the work and its brief, not measured commercial outcomes."
          />
          <div className="case-design-grid">
            {project.designChoices.map((choice, index) => (
              <article key={choice}>
                <span className="editorial-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3>{choice}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--compact">
        <div className="container">
          <ClosingCTA
            service={isWebsite ? undefined : service.slug}
            {...(!isWebsite
              ? {
                  title: `Let’s discuss your ${sentenceServiceName(service.label)} project.`,
                  description:
                    "Share your requirements so we can agree the right service-specific scope and quote.",
                }
              : {})}
          />
        </div>
      </section>
    </div>
  );
}
