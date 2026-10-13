import { IndustriesList } from "@/components/WebsiteSections";
import { ClosingCTA } from "@/components/ClosingCTA";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Website solutions by industry",
  "Explore practical website features for Nigerian retail, beauty, real estate, education, hospitality and professional service businesses.",
  "/industries",
);
export default function Page() {
  return (
    <>
      <section className="page-hero page-hero--green">
        <div className="container">
          <span className="eyebrow">Built around your customers</span>
          <h1>
            Different businesses.
            <br />
            Different website needs.
          </h1>
          <p>
            A school’s admissions page has a different job from a retailer’s
            product catalogue. We plan around the information your customers
            need and the action you want them to take.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <IndustriesList />
          <div className="concept-note mt-32">
            These are examples of suitable applications, not claims of
            specialist experience. Integrations such as school portals, booking
            engines and property feeds require a separate technical scope. We
            start with your actual requirements and budget.
          </div>
        </div>
      </section>
      <section className="section section--compact">
        <div className="container">
          <ClosingCTA />
        </div>
      </section>
    </>
  );
}
