"use client";

import { usePublicSettings } from "@/components/PublicSiteSettings";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { business } from "@/config/business";
import { getServicePage } from "@/config/service-pages";
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
  const { settings, available } = usePublicSettings();
  if (!available)
    return (
      <span role="status">Contact information is temporarily unavailable.</span>
    );
  return (
    <a
      className={`button ${light ? "button--light" : "button--outline"}`}
      href={getWhatsAppUrl(message, settings.whatsapp)}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackEvent("whatsapp_click")}
    >
      <MessageCircle size={16} aria-hidden="true" /> {label}{" "}
      <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  );
}

export function PhoneLink({ compact = false }: { compact?: boolean }) {
  const { settings, available } = usePublicSettings();
  if (!available)
    return (
      <span role="status">Contact information is temporarily unavailable.</span>
    );
  return (
    <a
      className={compact ? "text-link" : "button button--outline"}
      href={getPhoneHref(settings.alternativePhone)}
      onClick={() =>
        trackEvent("phone_click", { contact_type: "alternative_phone" })
      }
    >
      {compact ? (
        <Phone size={15} aria-hidden="true" />
      ) : (
        <Phone size={16} aria-hidden="true" />
      )}
      Call {settings.alternativePhone}
    </a>
  );
}

export function StartProjectLink({
  label,
  service,
  className = "button button--primary",
}: {
  label?: string;
  service?: string;
  className?: string;
}) {
  const href = service
    ? `${business.primaryCTA.href}?service=${encodeURIComponent(service)}`
    : business.primaryCTA.href;
  return (
    <Link
      className={className}
      href={href}
      onClick={() =>
        trackEvent("quote_cta_click", service ? { service } : undefined)
      }
    >
      {label ?? getServicePage(service)?.cta ?? business.primaryCTA.label}{" "}
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}
