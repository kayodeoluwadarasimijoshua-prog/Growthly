import { getSiteSettings } from "@/lib/cms/public";
import { priceText } from "@/lib/cms/format";
import { faqs } from "@/config/content";

export async function FAQList() {
  const settings = await getSiteSettings();
  return (
    <div className="faq-list">
      {faqs.map((item) => (
        <details className="faq-item" key={item.question}>
          <summary>{item.question}</summary>
          <p>{priceText(item.answer, settings)}</p>
        </details>
      ))}
    </div>
  );
}
