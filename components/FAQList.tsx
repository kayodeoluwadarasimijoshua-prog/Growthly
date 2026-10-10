import { faqs } from "@/config/content";

export function FAQList() {
  return (
    <div className="faq-list">
      {faqs.map((item) => (
        <details className="faq-item" key={item.question}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
