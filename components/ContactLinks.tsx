"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { business } from "@/config/business";
import { getPhoneHref, getWhatsAppUrl } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

export function WhatsAppButton({
  label = "Message us on WhatsApp",
  message,
  light = false,
}: {
  label?: string;
  message?: string;
  light?: boolean;
}) {
  return (
    <a
      className={`button ${light ? "button--light" : "button--outline"}`}
      href={getWhatsAppUrl(message)}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackEvent("whatsapp_click")}
    >
      <MessageCircle size={16} aria-hidden="true" /> {label} <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  );
}

export function PhoneLink({ compact = false }: { compact?: boolean }) {
  return (
    <a
      className={compact ? "text-link" : "button button--outline"}
      href={getPhoneHref(business.contact.alternativePhone)}
      onClick={() => trackEvent("phone_click", { contact_type: "alternative_phone" })}
    >
      {compact ? <Phone size={15} aria-hidden="true" /> : <Phone size={16} aria-hidden="true" />}
      Call {business.contact.alternativePhone}
    </a>
  );
}

export function StartProjectLink({
  label = "Start your project",
  service,
  className = "button button--primary",
}: {
  label?: string;
  service?: string;
  className?: string;
}) {
  const href = service ? `/start-project?service=${encodeURIComponent(service)}` : "/start-project";
  return (
    <Link
      className={className}
      href={href}
      onClick={() => trackEvent("service_cta_click", service ? { service } : undefined)}
    >
      {label} <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}
