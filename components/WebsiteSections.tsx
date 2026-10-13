import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Smartphone,
  Search,
  MessageCircle,
} from "lucide-react";
import { websiteSolutions, websiteFAQs, industries } from "@/config/websites";
import { projects } from "@/config/content";
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
export function WorkPreview() {
  return (
    <section className="section section--soft">
      <div className="container">
        <SectionHeading
          eyebrow="A look at what’s possible"
          title="Small businesses. Thoughtful websites."
          description="Original, self-initiated website concepts. Demonstration work—not commissioned client projects or evidence of business results."
          action={
            <Link className="text-link" href="/portfolio">
              View all our work <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          }
        />
        <div className="project-grid">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
export function WebsiteFAQ() {
  return (
    <div className="faq-list">
      {websiteFAQs.map(([q, a]) => (
        <details className="faq-item" key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
export function IndustriesList() {
  return (
    <div className="industry-grid">
      {industries.map(([name, text]) => (
        <article key={name}>
          <h3>{name}</h3>
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
