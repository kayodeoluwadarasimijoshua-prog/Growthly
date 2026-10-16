import { services } from "@/config/content";

/** Only configured service slugs can change the quote journey. Unknown/duplicate
 * query values fall back to the primary website offer with a visible notice. */
export function resolveInquiryService(value: unknown) {
  return (
    services.find((service) => service.slug === value) ??
    services.find((service) => service.slug === "website-development")!
  );
}
