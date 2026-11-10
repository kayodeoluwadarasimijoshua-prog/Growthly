import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublishedProjects } from "@/lib/cms/public";
import { getServicePage } from "@/config/service-pages";
import {
  portfolioServices,
  getPortfolioService,
  galleryPath,
} from "@/config/portfolio-services";
import { pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/PageIntro";
import { ProjectCard } from "@/components/ProjectCard";
import { PortfolioNavigation } from "@/components/PortfolioNavigation";
import { ClosingCTA } from "@/components/ClosingCTA";

export function generateStaticParams() {
  return portfolioServices.map((s) => ({ service: s.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const selected = getPortfolioService((await params).service);
  return selected
    ? pageMetadata(
        `${selected.label} Projects`,
        selected.description,
        galleryPath(selected.slug),
      )
    : {};
}
export default async function GalleryPage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const selected = getPortfolioService((await params).service);
  if (!selected) notFound();
  const service = getServicePage(selected.slug)!;
  const projects = (await getPublishedProjects()).filter(
    (p) => (p.service ?? "website-development") === selected.slug,
  );
  return (
    <div className="professional-sales-page gallery-page">
      <PageIntro
        label={`${selected.label} projects`}
        path={galleryPath(selected.slug)}
        eyebrow="Growthly portfolio"
        title={selected.title}
        description={selected.description}
      />
      <section className="section">
        <div className="container">
          <PortfolioNavigation active={selected.slug} />
          {projects.length ? (
            <div className="project-grid gallery-grid">
              {projects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  headingLevel={2}
                />
              ))}
            </div>
          ) : (
            <div className="gallery-empty" data-reveal>
              <span className="eyebrow">Project gallery</span>
              <h2>More work will appear here as it is published.</h2>
              <p>
                There are no published {selected.label.toLowerCase()} examples
                in this gallery yet. Explore the service, or tell us about your
                brief to discuss a suitable approach.
              </p>
              <Link className="text-link" href={service.path}>
                Explore {selected.label.toLowerCase()} services →
              </Link>
            </div>
          )}
        </div>
      </section>
      <section className="section section--compact">
        <div className="container">
          <ClosingCTA
            service={selected.slug}
            title="Have a project in mind? Let’s talk it through."
            description="Share your goal, the audience and any references you like. We’ll discuss the work and agree the scope before you commit."
          />
        </div>
      </section>
    </div>
  );
}
