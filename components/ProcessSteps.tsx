import { processSteps } from "@/config/content";

export function ProcessSteps({ compact = false }: { compact?: boolean }) {
  const visibleSteps = compact ? processSteps.slice(0, 6) : processSteps;
  return (
    <div className="process-grid">
      {visibleSteps.map((step) => (
        <article className="process-step" key={step.number}>
          <span className="process-step__number">{step.number}</span>
          <h3>{step.name}</h3>
          <p>{step.description}</p>
        </article>
      ))}
    </div>
  );
}
