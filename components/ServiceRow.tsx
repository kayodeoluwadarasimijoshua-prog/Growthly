import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ServiceDefinition } from "@/config/content";

export function ServiceRow({
  service,
  index,
}: {
  service: ServiceDefinition;
  index: number;
}) {
  return (
    <article className="service-row">
      <span className="service-row__number">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3>{service.shortTitle}</h3>
      <p>{service.summary}</p>
      <Link
        className="service-row__link"
        href={`/services/${service.slug}`}
        aria-label={`Learn about ${service.title}`}
      >
        <ArrowUpRight size={18} aria-hidden="true" />
      </Link>
    </article>
  );
}
