"use client";

import {
  getServicePage,
  serviceContactMessage,
  sentenceServiceName,
} from "@/config/service-pages";
import Link from "next/link";
import { useEffect, useState, useRef, type FormEvent } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { budgetOptions } from "@/config/business";
import { websiteTypes } from "@/config/websites";
import { resolveInquiryService } from "@/lib/inquiry-context";
import { validateInquiry } from "@/lib/inquiries";
import { usePublicSettings } from "@/components/PublicSiteSettings";
import { packagesFor } from "@/lib/cms/format";
import { getPhoneHref, getWhatsAppUrl } from "@/lib/site";
import { trackLeadConversion, trackEvent } from "@/lib/analytics";
import { getUtmAttribution } from "@/lib/attribution";
type Status = {
  kind: "idle" | "loading" | "success" | "error" | "handoff";
  message?: string;
};
export function InquiryForm({
  initialService = "website-development",
  initialPackage = "",
  initialType = "",
  deliveryEnabled = false,
}: {
  initialService?: string;
  initialPackage?: string;
  initialType?: string;
  deliveryEnabled?: boolean;
}) {
  // SSR and failed/delayed hydration must never leave a native GET form usable.
  const { settings, available } = usePublicSettings();
  const websitePackages = packagesFor(settings);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  const submission = useRef<{ body: string; key: string } | null>(null);
  const submitting = useRef(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [handoff, setHandoff] = useState("");
  const service = resolveInquiryService(initialService);
  const isWebsite = service.slug === "website-development";
  const knownPackage =
    isWebsite && websitePackages.some((p) => p.id === initialPackage)
      ? initialPackage
      : "custom";
  const error = (id: string) =>
    errors[id] ? (
      <small id={`${id}-error`} className="field-error">
        {errors[id]}
      </small>
    ) : null;
  const attributes = (id: string) => ({
    "aria-invalid": !!errors[id],
    "aria-describedby": errors[id] ? `${id}-error` : undefined,
  });
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const f = new FormData(form);
    const text = (name: string) => String(f.get(name) ?? "").trim();
    const payload = {
      full_name: text("full_name"),
      business_name: text("business_name"),
      phone: text("phone"),
      email: text("email"),
      preferred_contact: text("preferred_contact"),
      service: service.slug,
      website_type: text("website_type"),
      package_id: text("package_id"),
      brief: text("brief"),
      existing_url: text("existing_url"),
      industry: text("industry"),
      required_features: text("required_features"),
      budget_range: text("budget_range") || "not-sure",
      preferred_deadline: text("preferred_deadline") || "flexible",
      consent: f.get("consent") === "on",
      website: text("website"),
      attribution: getUtmAttribution(),
    };
    const parsed = validateInquiry(payload);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const key = String(i.path[0]);
        if (!next[key]) next[key] = i.message;
      });
      setErrors(next);
      setStatus({
        kind: "error",
        message: "Please check the highlighted fields.",
      });
      const invalid = form.querySelector<HTMLElement>(
        `[name="${Object.keys(next)[0]}"]`,
      );
      const details = invalid?.closest("details");
      if (details) details.open = true;
      invalid?.focus();
      return;
    }
    if (payload.website) {
      setStatus({
        kind: "error",
        message: "This request could not be accepted.",
      });
      return;
    }
    setErrors({});
    const message = [
      isWebsite
        ? "Hello GROWTHLY, I’d like a website quote."
        : serviceContactMessage(getServicePage(service.slug)),
      `Service: ${service.title}`,
      `Name: ${payload.full_name}`,
      `Business: ${payload.business_name}`,
      `Phone: ${payload.phone}`,
      payload.email ? `Email: ${payload.email}` : "",
      ...(isWebsite
        ? [
            `Website type: ${payload.website_type}`,
            `Package: ${payload.package_id}`,
          ]
        : []),
      `Preferred contact: ${payload.preferred_contact}`,
      `Budget preference: ${payload.budget_range}`,
      `${isWebsite ? "Launch" : "Timing"} preference: ${payload.preferred_deadline}`,
      payload.existing_url ? `Existing website: ${payload.existing_url}` : "",
      payload.industry ? `Industry: ${payload.industry}` : "",
      payload.required_features ? `Features: ${payload.required_features}` : "",
      `Brief: ${payload.brief}`,
    ]
      .filter(Boolean)
      .join("\n");
    setHandoff(getWhatsAppUrl(message, settings.whatsapp));
    if (!deliveryEnabled) {
      setStatus({ kind: "handoff" });
      return;
    }
    submitting.current = true;
    setStatus({ kind: "loading" });
    try {
      const body = JSON.stringify(payload);
      if (!submission.current || submission.current.body !== body) {
        submission.current = { body, key: crypto.randomUUID() };
      }
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": submission.current.key,
        },
        body,
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        setStatus({
          kind: "error",
          message:
            result.message ||
            "Delivery could not be confirmed. Your details are still here; try again or send the brief on WhatsApp.",
        });
        return;
      }
      setStatus({
        kind: "success",
        message:
          "Your enquiry has been received by our configured system. Growthly will review the brief and follow up using your preferred contact method.",
      });
      trackLeadConversion();
      form.reset();
      submission.current = null;
    } catch {
      setStatus({
        kind: "error",
        message:
          "We couldn’t confirm delivery. Your details have not been cleared. Try again or continue on WhatsApp.",
      });
    } finally {
      submitting.current = false;
    }
  }
  if (!available)
    return (
      <p role="status">
        Business contact information is temporarily unavailable. Please try
        again later; no enquiry has been sent.
      </p>
    );
  return (
    <form
      className="inquiry-form"
      aria-busy={status.kind === "loading"}
      method="post"
      action="/api/inquiries/fallback"
      data-ready={ready ? "true" : "false"}
      onSubmit={submit}
      noValidate
      onChange={() => {
        if (status.kind === "handoff") {
          setStatus({ kind: "idle" });
          setHandoff("");
        }
      }}
    >
      <div className="form-unavailable-note delivery-note" hidden={ready}>
        <h2>Contact us directly.</h2>
        <p>
          The secure form needs JavaScript. If JavaScript is disabled, blocked
          or still loading, use WhatsApp or phone to share your requirements. No
          enquiry has been sent.
        </p>
        <div className="form-direct-contact">
          <a
            className="text-link"
            href={getWhatsAppUrl(
              isWebsite
                ? undefined
                : serviceContactMessage(getServicePage(service.slug)),
              settings.whatsapp,
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp {settings.whatsapp}
          </a>
          <a
            className="text-link"
            href={getPhoneHref(settings.alternativePhone)}
          >
            Call {settings.alternativePhone}
          </a>
        </div>
      </div>
      <fieldset
        className="inquiry-form-controls"
        disabled={!ready || status.kind === "loading"}
        hidden={!ready}
      >
        <legend className="sr-only">
          {isWebsite ? "Website" : service.shortTitle} quote details
        </legend>
        <input type="hidden" name="service" value={service.slug} />
        <div className="form-intro">
          <h2>
            {isWebsite
              ? "Tell us about your website."
              : `Tell us about your ${sentenceServiceName(service.shortTitle)} project.`}
          </h2>
          <p>Requested service: {service.title}</p>
          <p>
            Required fields are marked *. Budget and{" "}
            {isWebsite ? "launch" : "project"} date are preferences, not an
            agreed price or deadline.
          </p>
        </div>
        {!deliveryEnabled && (
          <div className="delivery-note">
            <strong>Send your brief through WhatsApp.</strong>
            <p>
              Online delivery is not enabled here. This form prepares a message
              on your device; nothing is submitted to Growthly until you open
              WhatsApp and press Send. You’ll need WhatsApp access. Prefer a
              call? Use the contact options beside this form.
            </p>
          </div>
        )}
        {status.kind === "error" && (
          <div className="form-status form-status--error" role="alert">
            {status.message}
          </div>
        )}
        {status.kind === "success" && (
          <div className="form-status form-status--success" role="status">
            <strong>Request received.</strong>
            <p>{status.message}</p>
          </div>
        )}
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="full_name">Your name *</label>
            <input
              id="full_name"
              name="full_name"
              autoComplete="name"
              required
              maxLength={120}
              {...attributes("full_name")}
            />
            {error("full_name")}
          </div>
          <div className="form-field">
            <label htmlFor="business_name">Business name *</label>
            <input
              id="business_name"
              name="business_name"
              autoComplete="organization"
              required
              maxLength={140}
              {...attributes("business_name")}
            />
            {error("business_name")}
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="phone">WhatsApp or telephone number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              maxLength={30}
              {...attributes("phone")}
              aria-describedby={
                errors.phone ? "phone-purpose phone-error" : "phone-purpose"
              }
            />
            <small id="phone-purpose" className="field-help">
              Include a number Growthly can use to discuss this project. Email
              is optional.
            </small>
            {error("phone")}
          </div>
          <div className="form-field">
            <label htmlFor="email">Email, if available</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              {...attributes("email")}
            />
            {error("email")}
          </div>
        </div>
        {isWebsite ? (
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="website_type">Website type *</label>
              <select
                id="website_type"
                name="website_type"
                defaultValue={
                  websiteTypes.some((t) => t === initialType) ? initialType : ""
                }
                required
                {...attributes("website_type")}
              >
                <option value="">Select a website type</option>
                {websiteTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              {error("website_type")}
            </div>
            <div className="form-field">
              <label htmlFor="package_id">Solution you’re considering</label>
              <select
                id="package_id"
                name="package_id"
                defaultValue={knownPackage}
              >
                <option value="custom">Custom / help me choose</option>
                {websitePackages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.price}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <>
            <input type="hidden" name="website_type" value="" />
            <input type="hidden" name="package_id" value="custom" />
          </>
        )}
        <div className="form-field">
          <label htmlFor="brief">
            {isWebsite
              ? "What does your website need to do? *"
              : "What do you need help with? *"}
          </label>
          <textarea
            id="brief"
            name="brief"
            minLength={20}
            maxLength={2400}
            required
            placeholder={
              isWebsite
                ? "Tell us what you sell, who your customers are and what you want them to do on your website."
                : "Tell us your goal, audience, required deliverables and where you plan to use them."
            }
            {...attributes("brief")}
          />
          <small>
            At least 20 characters. Don’t include passwords or sensitive
            information.
          </small>
          {error("brief")}
        </div>
        <details className="form-optionals">
          <summary>Add optional project details</summary>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="existing_url">Existing website URL</label>
              <input
                id="existing_url"
                name="existing_url"
                type="url"
                placeholder="https://"
                maxLength={500}
                {...attributes("existing_url")}
              />
              {error("existing_url")}
            </div>
            <div className="form-field">
              <label htmlFor="industry">Industry</label>
              <input id="industry" name="industry" maxLength={140} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="budget_range">Budget preference</label>
              <select
                id="budget_range"
                name="budget_range"
                defaultValue="not-sure"
              >
                {budgetOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <small>
                {isWebsite
                  ? "Not Growthly’s package prices."
                  : "A preference, not a fixed quote."}
              </small>
            </div>
            <div className="form-field">
              <label htmlFor="preferred_deadline">
                {isWebsite ? "Desired launch date" : "Preferred project date"}
              </label>
              <input
                id="preferred_deadline"
                name="preferred_deadline"
                type="date"
                {...attributes("preferred_deadline")}
              />
              {error("preferred_deadline")}
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="required_features">Required features</label>
            <input
              id="required_features"
              name="required_features"
              placeholder={
                isWebsite
                  ? "e.g. product catalogue, online payment, booking"
                  : "e.g. formats, channels or integrations"
              }
              maxLength={600}
            />
          </div>
        </details>
        <div className="form-field">
          <label htmlFor="preferred_contact">Preferred follow-up method</label>
          <select
            name="preferred_contact"
            id="preferred_contact"
            defaultValue="whatsapp"
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="phone">Telephone call</option>
            <option value="email">Email</option>
          </select>
        </div>
        <div className="honeypot" aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="consent-field">
          <label>
            <input
              name="consent"
              type="checkbox"
              required
              {...attributes("consent")}
            />{" "}
            <span>
              I agree that Growthly may use these details to discuss my request
              as explained in the{" "}
              <Link className="text-link" href="/privacy-policy">
                privacy policy
              </Link>
              . *
            </span>
          </label>
          {error("consent")}
        </div>
        <button
          className="button button--primary"
          type="submit"
          hidden={status.kind === "handoff" || status.kind === "success"}
          disabled={status.kind === "loading"}
        >
          {status.kind === "loading" ? (
            <>
              <LoaderCircle size={18} className="spin" aria-hidden="true" />{" "}
              Sending enquiry…
            </>
          ) : (
            <>
              {deliveryEnabled
                ? "Send quote request"
                : "Prepare WhatsApp brief"}
              <ArrowRight size={17} aria-hidden="true" />
            </>
          )}
        </button>
        {status.kind === "handoff" && (
          <div className="form-status" role="status">
            <strong>Your brief is ready—not yet sent.</strong>
            <p>
              Open WhatsApp, review the message and press Send. This website
              cannot confirm WhatsApp delivery.
            </p>
          </div>
        )}
        {handoff && status.kind !== "success" && (
          <button
            type="button"
            className="button button--outline"
            onClick={() => {
              // A button avoids exposing the personal brief as an auto-tracked outbound link URL.
              trackEvent("whatsapp_click");
              window.open(handoff, "_blank", "noopener,noreferrer");
            }}
          >
            Open WhatsApp with my brief{" "}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        )}
        <p className="form-fineprint">
          No payment or commitment. We agree the scope and quote before your
          project begins.
        </p>
      </fieldset>
    </form>
  );
}
