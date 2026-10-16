import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { getSiteSettings, getFeaturedProject } from "@/lib/cms/public";
import { packagesFor } from "@/lib/cms/format";
import {
  websiteOutcomes,
  websiteFitChoices,
  independentWebsiteExamples,
  projectPreparation,
} from "@/config/customer-journey";
import { SectionHeading } from "@/components/SectionHeading";

export function WebsiteOutcomes() {
  return (
    <div className="outcome-grid">
      {websiteOutcomes.map((item) => (
        <article className="outcome-card" key={item.number}>
          <span className="editorial-number" aria-hidden="true">
            {item.number}
          </span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  );
}

/** Native disclosure is useful with or without JavaScript. No input data or tracking. */
export async function WebsiteFitGuide() {
  const websitePackages = packagesFor(await getSiteSettings());
  return (
    <div className="fit-guide">
      <div className="fit-guide__intro">
        <span className="eyebrow">Find your starting point</span>
        <h2>Not sure which website fits?</h2>
        <p>
          Choose the goal closest to yours. This is a starting direction—not a
          final quote or a fixed list of pages.
        </p>
      </div>
      <div className="fit-guide__choices">
        {websiteFitChoices.map((choice) => {
          const offer = websitePackages.find(
            (item) => item.id === choice.packageId,
          )!;
          return (
            <details
              className="fit-choice"
              name="website-fit"
              key={choice.packageId}
            >
              <summary>{choice.goal}</summary>
              <div className="fit-choice__body">
                <h3>{offer.name}</h3>
                <p className="fit-choice__price">{offer.price} NGN</p>
                <p>{choice.advice}</p>
                <Link
                  className="text-link mt-24"
                  href={`/request-a-quote?service=website-development&package=${choice.packageId}&type=${encodeURIComponent(choice.type)}`}
                >
                  Get a Website Quote{" "}
                  <span className="sr-only">for {offer.name}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}

export async function ProjectSpotlight() {
  const project = await getFeaturedProject();
  if (!project) return null;
  return (
    <div className="case-spotlight">
      <div className="case-spotlight__intro">
        <span className="eyebrow">A website you can explore</span>
        <h2>Business information, brought together with purpose.</h2>
        <p>{project.creativeIntent}</p>
        <div className="inline-links">
          <Link className="text-link" href={`/portfolio/${project.slug}`}>
            Read the {project.name} case study{" "}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link className="text-link" href="/portfolio">
            Website work & examples <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="case-spotlight__details">
        <span className="case-spotlight__label">
          {project.name} · Client website
        </span>
        <h3>A clear route from interest to enquiry.</h3>
        <ul className="check-list">
          {project.designChoices.slice(0, 3).map((item) => (
            <li key={item}>
              <Check size={17} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {project.liveUrl && (
          <a
            className="text-link mt-24"
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore the live {project.name} website{" "}
            <ArrowUpRight size={16} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        <p className="form-fineprint mt-24">
          Published work, not a promise of traffic or sales. External websites
          may change.
        </p>
      </div>
    </div>
  );
}

export function IndependentWebsiteExamples() {
  return (
    <div className="website-examples" id="website-examples">
      <SectionHeading
        eyebrow="Ideas for your own website"
        title="See the details that make a website useful."
        description="Independent examples to discuss—not Growthly projects. Look at the information and navigation, rather than copying an entire platform."
      />
      <div className="example-grid">
        {independentWebsiteExamples.map((example, index) => (
          <article className="example-card" key={example.name}>
            <span className="example-card__category">
              {String(index + 1).padStart(2, "0")} / {example.category}
            </span>
            <h3>{example.name}</h3>
            <p>{example.lesson}</p>
            <p className="example-card__takeaway">{example.takeaway}</p>
            <a
              className="text-link"
              href={example.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              View {example.name} <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </article>
        ))}
      </div>
      <p className="form-fineprint mt-24">
        These websites belong to their respective organisations. Growthly did
        not build them and is not affiliated with them. Their platforms and
        budgets differ; similar content or design directions require a
        separately agreed scope. No external screenshots, logos or tracking are
        loaded here.
      </p>
    </div>
  );
}

export function ProjectPreparation({ heading = true }: { heading?: boolean }) {
  return (
    <div className="preparation-block">
      {heading && (
        <SectionHeading
          eyebrow="A useful first conversation"
          title="You bring the business. We help shape the website."
          description="You do not need to arrive with technical answers. These details help us recommend a sensible next step."
        />
      )}
      <div className="preparation-grid">
        {projectPreparation.map(([title, text], index) => (
          <article key={title}>
            <span className="editorial-number" aria-hidden="true">
              0{index + 1}
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
