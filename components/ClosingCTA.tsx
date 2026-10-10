import { StartProjectLink } from "@/components/ContactLinks";

export function ClosingCTA({
  title = "Ready to take your business to the next level?",
  description = "Tell us where you want to go. We’ll help you work out the right next step.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="closing-cta">
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <StartProjectLink label="Let’s discuss your project" className="button button--light" />
    </div>
  );
}
