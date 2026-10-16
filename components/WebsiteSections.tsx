import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Smartphone,
  Search,
  MessageCircle,
} from "lucide-react";
import { websiteSolutions, industries } from "@/config/websites";
import { getPublishedProjects, getSiteSettings } from "@/lib/cms/public";
import { expandPriceTokens } from "@/lib/cms/format";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectCard } from "@/components/ProjectCard";
export function Solutions() {
  return (
    <div className="solution-grid">
      {websiteSolutions.map((s) => (
        <Link className="solution-card" href={s.href} key={s.name}>
          <span className="solution-number">
            {s.icon}
            <ArrowUpRight size={20} aria-hidden="true" />
          </span>
          <h3>{s.name}</h3>
          <p>{s.summary}</p>
        </Link>
      ))}
    </div>
  );
}
export async function WorkPreview() {
  const projects = (await getPublishedProjects()).filter(
    (p) =>
      (p.service ?? "website-development") === "website-development" &&
      p.kind === "client",
  );
  if (!projects.length) return null;
  return (
    <section className="section section--soft">
      <div className="container">
        <SectionHeading
          eyebrow="Selected website work"
          title="Real projects. Clear purpose."
          description="Explore approved website projects and the decisions behind them."
          action={
            <Link className="text-link" href="/portfolio">
              View all our work <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          }
        />
        <div className="project-grid project-grid--clients">
          {projects
            .filter((p) => p.kind === "client")
            .map((p) => (
              <ProjectCard key={p.slug} project={p} headingLevel={3} />
            ))}
        </div>
      </div>
    </section>
  );
}
export async function WebsiteFAQ({ compact = false }: { compact?: boolean }) {
  const settings = await getSiteSettings();
  const websiteFAQs = settings.websiteFaqs.map((f) => [
    f.question,
    expandPriceTokens(f.answer, settings),
  ]);
  const visible = compact
    ? websiteFAQs.filter(([q]) =>
        [
          "How much does a business website cost?",
          "How long does a website take to build?",
          "Do we need to buy a domain?",
        ].includes(q),
      )
    : websiteFAQs;
  return (
    <div className="faq-list">
      {visible.map(([q, a]) => (
        <details className="faq-item" key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
export function IndustriesList({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  return (
    <div className="industry-grid">
      {industries.map(([name, text]) => (
        <article key={name}>
          <Heading>{name}</Heading>
          <p>{text}</p>
        </article>
      ))}
    </div>
  );
}
export function Standards() {
  return (
    <div className="standards">
      {[
        [Smartphone, "Mobile-first layouts"],
        [MessageCircle, "Easy ways to enquire"],
        [Search, "Search-friendly foundations"],
      ].map(([Icon, title]) => {
        const I = Icon as typeof Check;
        return (
          <div key={String(title)}>
            <I size={20} aria-hidden="true" />
            <span>{String(title)}</span>
          </div>
        );
      })}
    </div>
  );
}
export function WhyGrowthly() {
  return (
    <div className="why-grid">
      <div className="why-grid__intro">
        <span className="eyebrow">Why Growthly</span>
        <h2>
          Built for your customers.
          <br />
          Planned for your business.
        </h2>
        <p>
          Your website should make the important things easier. We start with
          what people need to know—and what you want them to do next.
        </p>
      </div>
      <div className="principle-list">
        {[
          [
            "A clear offer, not just a pretty page",
            "Products and services organised so customers can understand your business without guesswork.",
          ],
          [
            "A practical route to the next step",
            "Contact, WhatsApp and ordering options selected around your actual requirements.",
          ],
          [
            "No surprises in the scope",
            "Page lists, revisions, content responsibilities, budgets and separate costs agreed before work begins.",
          ],
        ].map(([title, text]) => (
          <article className="principle" key={title}>
            <span className="principle__icon">
              <Check size={18} aria-hidden="true" />
            </span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
