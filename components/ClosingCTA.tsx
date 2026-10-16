import { StartProjectLink } from "@/components/ContactLinks";
export function ClosingCTA({
  service,
  title = "Ready to give your business a stronger online presence?",
  description = "Tell us what your business needs. We’ll review your requirements and discuss a suitable website solution.",
}: {
  service?: string;
  title?: string;
  description?: string;
}) {
  return (
    <div className="closing-cta">
      <div>
        <span className="eyebrow">Let’s build your next step</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="stack-md">
        <StartProjectLink service={service} className="button button--light" />
      </div>
    </div>
  );
}
