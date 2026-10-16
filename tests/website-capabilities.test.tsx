import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  WebsiteCapabilities,
  HandoverDecisions,
} from "@/components/WebsiteCapabilities";
import {
  websiteCapabilities,
  handoverDecisions,
} from "@/config/website-capabilities";

describe("substantive website buying information", () => {
  for (const kind of ["main", "business", "ecommerce"] as const) {
    it(`explains ${kind} customer tasks and scope without collecting information`, () => {
      const html = renderToStaticMarkup(<WebsiteCapabilities kind={kind} />);
      expect(websiteCapabilities[kind].length).toBeGreaterThanOrEqual(5);
      for (const item of websiteCapabilities[kind]) {
        expect(item.customerTask.length).toBeGreaterThan(80);
        expect(item.scope.length).toBeGreaterThan(80);
      }
      expect(html).toContain(
        "not a promise that every package includes every feature",
      );
      expect(html).not.toMatch(/<form|<input|<iframe|<script/);
      expect(html.match(/<h2/g)).toHaveLength(1);
      expect(html.match(/<h3/g)).toHaveLength(websiteCapabilities[kind].length);
    });
  }
  it("the homepage offers four concrete explanations and a deeper destination", () => {
    const html = renderToStaticMarkup(<WebsiteCapabilities preview />);
    expect(html.match(/class="capability-row"/g)).toHaveLength(4);
    expect(html).toContain("/website-development#website-capabilities");
  });
  it("handover distinguishes first-year offers, accounts and separate support", () => {
    const html = renderToStaticMarkup(<HandoverDecisions />);
    expect(handoverDecisions).toHaveLength(4);
    expect(html).toContain("not lifetime hosting");
    expect(html).toContain("passwords sent in an enquiry form");
    expect(html).toContain("separate written scope");
  });
});
