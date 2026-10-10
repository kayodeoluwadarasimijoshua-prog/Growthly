import { business } from "@/config/business";

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return configured ? configured.replace(/\/$/, "") : undefined;
}

export function toInternationalPhoneNumber(number: string) {
  const digits = number.replace(/\D/g, "");
  const international = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
  return `+${international}`;
}

export function getWhatsAppUrl(message = "Hello GROWTHLY, I’d like to discuss a project.") {
  return `https://wa.me/${toInternationalPhoneNumber(business.contact.whatsapp).replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function getPhoneHref(number: string) {
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}
