import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ServiceGateway } from "@/components/ServiceGateway";
import { servicePages } from "@/config/service-pages";

describe("clear core-service discovery", () => {
  it("provides six direct canonical choices without a mixed quote or invented prices", () => {
    const html = renderToStaticMarkup(<ServiceGateway />);
    for (const page of servicePages)
      expect(html).toContain(`href="${page.path}"`);
    expect(html.match(/<h3/g)).toHaveLength(6);
    expect(html).not.toMatch(/<input|<form|<script|request-a-quote|₦/);
  });
  it("gives websites, graphic design and AI adverts equal core prominence", () => {
    const html = renderToStaticMarkup(<ServiceGateway />);
    expect(html.match(/service-gateway__card--primary/g)).toHaveLength(3);
    expect(html).toContain("Core service");
    expect(html).toContain("Websites, graphic design and AI adverts are our core services.");
    expect(html).toContain("What does your business need next?");
  });
});
