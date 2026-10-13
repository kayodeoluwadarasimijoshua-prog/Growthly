import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { projects } from "@/config/content";
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
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  return pageMetadata(
    `${project.name} concept`,
    project.summary,
    `/portfolio/${project.slug}`,
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <>
      <section className="case-hero">
        <div className="container">
          <Link className="text-link" href="/portfolio">
            <ArrowLeft size={16} aria-hidden="true" /> Back to concepts
          </Link>
          <div className="page-hero__grid" style={{ marginTop: 35 }}>
            <div>
              <span className="eyebrow">
                Self-initiated concept · {project.category}
              </span>
              <h1 style={{ marginTop: 18 }}>{project.name}</h1>
              <p>{project.summary}</p>
              <div className="case-hero__meta">
                <span>
                  <strong>Concept scope:</strong> {project.services.join(" · ")}
                </span>
              </div>
            </div>
            <div className="page-hero__aside">
              <strong>What this page represents</strong>A fictional,
              self-initiated sample created to explore a possible creative
              direction. It is not a commissioned client project.
            </div>
          </div>
          <figure className="case-hero__image" style={{ marginTop: 42 }}>
            <Image
              src={project.image}
              alt={project.imageAlt}
              width={1200}
              height={840}
              priority
              sizes="(max-width: 760px) 100vw, 1200px"
            />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="container case-content">
          <div>
            <span className="eyebrow">Concept overview</span>
            <p className="case-content__lead" style={{ marginTop: 18 }}>
              {project.concept}
            </p>
            <div className="case-disclaimer">{project.note}</div>
          </div>
          <div className="case-content__body">
            <h2>Design intent</h2>
            <p>{project.creativeIntent}</p>
            <h2>Design choices</h2>
            <ul className="check-list">
              {project.designChoices.map((choice) => (
                <li key={choice}>
                  <Check size={16} aria-hidden="true" />
                  <span>{choice}</span>
                </li>
              ))}
            </ul>
            <h2>Illustrative scope</h2>
            <ul className="check-list">
              {project.scope.map((item) => (
                <li key={item}>
                  <Check size={16} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: 25, fontSize: 13 }}>
              The ideas shown here are illustrative only. Any real project would
              begin with a client brief and an approved proposal.
            </p>
          </div>
        </div>
      </section>
      <section className="section section--soft section--compact">
        <div className="container">
          <ClosingCTA
            title="Let’s shape a direction around your business."
            description="Start with the work your business needs and the people you want to reach."
          />
        </div>
      </section>
    </>
  );
}
