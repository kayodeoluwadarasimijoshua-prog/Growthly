import type { Metadata } from "next";
import { ArrowRight, ClipboardCheck, Handshake, Lightbulb, ScanLine } from "lucide-react";
import Link from "next/link";
import { ClosingCTA } from "@/components/ClosingCTA";
import { ProcessSteps } from "@/components/ProcessSteps";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "About",
  "Learn how GROWTHLY approaches design, websites and marketing support for Nigerian businesses—with clear scope, practical thinking and straightforward communication.",
  "/about",
);

const principles = [
  {
    icon: ScanLine,
    number: "01",
    title: "Understand the actual need",
    text: "We ask what the business is trying to explain, improve or make easier before suggesting a service.",
  },
  {
    icon: ClipboardCheck,
    number: "02",
    title: "Make the scope visible",
    text: "Deliverables, review rounds, timing, responsibilities and separate costs belong in the proposal—not in assumptions.",
  },
  {
    icon: Lightbulb,
    number: "03",
    title: "Use tools with a reason",
    text: "New technology can help, but only when it suits the task, the people using it and the information involved.",
  },
  {
    icon: Handshake,
    number: "04",
    title: "Keep the working relationship human",
    text: "A good project needs useful feedback, clear approvals and a direct way to ask questions.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero page-hero--green">
        <div className="container page-hero__grid">
          <div>
            <span className="eyebrow">About GROWTHLY</span>
            <h1>Helping businesses scale up—with work that has a clear purpose.</h1>
            <p>GROWTHLY brings design, web and marketing support together for businesses building their next stage.</p>
          </div>
          <div className="page-hero__aside">
            <strong>Our point of view</strong>
            Digital work should make it easier for a real customer to understand a real offer. The right next step can be focused and practical; it doesn’t need to be the biggest project.
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container about-split">
          <div className="about-split__title">
            <span className="eyebrow">A practical creative partner</span>
            <h2>Useful work, made with intention.</h2>
          </div>
          <div className="about-split__body">
            <p>
              GROWTHLY supports small businesses, entrepreneurs and growing brands with the parts of their online presence that customers notice: the way an offer is presented, how a website guides a visitor and how a campaign shows up.
            </p>
            <p>
              The service list is broad because business needs vary. The process stays simple: understand the brief, agree a written scope, create the work and review it together before handover.
            </p>
            <div className="about-principles">
              {principles.map(({ icon: Icon, number, title, text }) => (
                <article className="about-principle" key={number}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>{number} · GROWTHLY PRINCIPLE</span>
                    <Icon size={16} aria-hidden="true" color="var(--green-dark)" />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <span className="eyebrow">How a project moves</span>
          <h2 className="mt-24">A clear path, agreed together.</h2>
          <ProcessSteps />
        </div>
      </section>
      <section className="section section--compact">
        <div className="container">
          <div className="concept-note" role="note">
            <Lightbulb size={18} aria-hidden="true" />
            <span>Our current portfolio uses original concept work because no commissioned project histories or testimonials were provided for publication. We’ll only add real client work with approval and accurate context.</span>
          </div>
          <div style={{ marginTop: 30 }}>
            <Link className="text-link" href="/work">See the concept portfolio <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
      <section className="section section--compact">
        <div className="container"><ClosingCTA title="Start with the challenge you’re facing." description="Share what you need to make clearer or easier. We’ll talk through a suitable next step." /></div>
      </section>
    </>
  );
}
