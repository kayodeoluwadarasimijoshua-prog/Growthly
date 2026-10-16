import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ServiceGateway } from "@/components/ServiceGateway";
import { servicePages } from "@/config/service-pages";

describe("early website-first service discovery", () => {
  it("provides six direct canonical choices without a mixed quote or invented prices", () => {
    const html = renderToStaticMarkup(<ServiceGateway />);
    for (const page of servicePages)
      expect(html).toContain(`href="${page.path}"`);
    expect(html.match(/<h3/g)).toHaveLength(6);
    expect(html).not.toMatch(/<input|<form|<script|request-a-quote|₦/);
  });
  it("makes the primary focus and independent commissioning explicit", () => {
    const html = renderToStaticMarkup(<ServiceGateway />);
    expect(html.match(/service-gateway__card--primary/g)).toHaveLength(1);
    expect(html).toContain("Our main focus");
    expect(html).toContain("commission the other services independently");
    expect(html).toContain("What does your business need next?");
  });
});
