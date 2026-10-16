import { processSteps } from "@/config/content";
const briefSteps = [
  {
    number: "01",
    name: "Share your brief",
    description: "Tell us about your business, pages and budget.",
  },
  {
    number: "02",
    name: "Approve the scope",
    description:
      "We agree features, cost, timing and payment milestones in writing.",
  },
  {
    number: "03",
    name: "Build, review & launch",
    description:
      "We build the agreed website, review it together and hand it over.",
  },
];
export function ProcessSteps({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`process-grid${compact ? " process-grid--compact" : ""}`}>
      {(compact ? briefSteps : processSteps).map((step) => (
        <article className="process-step" key={step.number}>
          <span className="process-step__number">{step.number}</span>
          <h3>{step.name}</h3>
          <p>{step.description}</p>
        </article>
      ))}
    </div>
  );
}
