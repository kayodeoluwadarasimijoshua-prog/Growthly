"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { services } from "@/config/content";
import { budgetOptions, portfolioPackages } from "@/config/business";
import { trackLeadConversion } from "@/lib/analytics";
import { getUtmAttribution } from "@/lib/attribution";

const deadlineOptions = [
  { value: "flexible", label: "I’m flexible" },
  { value: "within-2-weeks", label: "Within 2 weeks" },
  { value: "2-4-weeks", label: "In 2–4 weeks" },
  { value: "1-2-months", label: "In 1–2 months" },
  { value: "specific-date", label: "I have a specific date" },
];

type FormState = { kind: "idle" | "submitting" | "success" | "error"; message?: string };

export function InquiryForm({
  initialService = "",
  initialPackage = "",
}: {
  initialService?: string;
  initialPackage?: string;
}) {
  const knownService = services.some((service) => service.slug === initialService) ? initialService : "";
  const knownPackage = portfolioPackages.some((item) => item.id === initialPackage) ? initialPackage : "";
  const [service, setService] = useState(knownService);
  const [packageId, setPackageId] = useState(knownPackage || "custom");
  const [deadlineChoice, setDeadlineChoice] = useState("flexible");
  const [status, setStatus] = useState<FormState>({ kind: "idle" });
  const packagesAvailable = service === "website-development";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const email = String(values.get("email") ?? "").trim();
    const phone = String(values.get("phone") ?? "").trim();
    const preferredContact = String(values.get("preferred_contact") ?? "whatsapp");
    const preferredDate = String(values.get("preferred_deadline_date") ?? "");

    if (!email && !phone) {
      setStatus({ kind: "error", message: "Add an email address or phone number so we can reply." });
      document.getElementById(preferredContact === "email" ? "email" : "phone")?.focus();
      return;
    }
    if (preferredContact === "email" && !email) {
      setStatus({ kind: "error", message: "Add an email address, or choose WhatsApp or phone as your preferred contact." });
      document.getElementById("email")?.focus();
      return;
    }
    if ((preferredContact === "whatsapp" || preferredContact === "phone") && !phone) {
      setStatus({ kind: "error", message: "Add a phone number, or choose email as your preferred contact." });
      document.getElementById("phone")?.focus();
      return;
    }
    if (deadlineChoice === "specific-date" && !preferredDate) {
      setStatus({ kind: "error", message: "Choose a preferred date or select a flexible timeframe." });
      document.getElementById("preferred_deadline_date")?.focus();
      return;
    }
    if (preferredDate && preferredDate < new Date().toISOString().slice(0, 10)) {
      setStatus({ kind: "error", message: "Choose a future preferred date or select a flexible timeframe." });
      document.getElementById("preferred_deadline_date")?.focus();
      return;
    }

    const payload = {
      full_name: String(values.get("full_name") ?? "").trim(),
      business_name: String(values.get("business_name") ?? "").trim(),
      email,
      phone,
      preferred_contact: preferredContact,
      service,
      package_id: packagesAvailable ? packageId : "custom",
      brief: String(values.get("brief") ?? "").trim(),
      budget_range: String(values.get("budget_range") ?? ""),
      preferred_deadline: deadlineChoice === "specific-date" ? preferredDate : deadlineChoice,
      website: String(values.get("website") ?? ""),
      attribution: getUtmAttribution(),
    };

    setStatus({ kind: "submitting" });
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
      if (!response.ok || result?.ok !== true) {
        setStatus({
          kind: "error",
          message:
            result?.message ??
            "We couldn’t confirm delivery. Please try again or use one of the direct contact options.",
        });
        return;
      }

      setStatus({
        kind: "success",
        message: "Your project request has been received. GROWTHLY will follow up using the contact method you selected.",
      });
      form.reset();
      setService(knownService);
      setPackageId(knownPackage || "custom");
      setDeadlineChoice("flexible");
      trackLeadConversion();
    } catch {
      setStatus({
        kind: "error",
        message: "We couldn’t reach the inquiry service. Please try again or contact GROWTHLY directly.",
      });
    }
  }

  return (
    <form className="inquiry-form" onSubmit={handleSubmit}>
      <div className="form-intro">
        <h2>Tell us what you’re working on.</h2>
        <p>Share a few details. We’ll review the fit and follow up with clear next steps.</p>
      </div>

      {status.kind === "success" ? (
        <div className="form-status form-status--success" role="status" aria-live="polite">
          <strong>Request received.</strong> {status.message}
        </div>
      ) : null}
      {status.kind === "error" ? (
        <div className="form-status form-status--error" role="alert">
          {status.message}
        </div>
      ) : null}

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="service">What do you need help with? <span aria-hidden="true">*</span></label>
          <select
            id="service"
            name="service"
            value={service}
            onChange={(event) => {
              setService(event.target.value);
              setPackageId("custom");
              setStatus({ kind: "idle" });
            }}
            required
          >
            <option value="">Select a service</option>
            {services.map((item) => <option value={item.slug} key={item.slug}>{item.title}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="package">Package or project type</label>
          <select
            id="package"
            name="package_id"
            value={packagesAvailable ? packageId : "custom"}
            onChange={(event) => setPackageId(event.target.value)}
            disabled={!packagesAvailable}
          >
            <option value="custom">Custom project / not sure</option>
            {packagesAvailable ? portfolioPackages.map((item) => (
              <option value={item.id} key={item.id}>{item.name} · {item.price}</option>
            )) : null}
          </select>
          <small>
            {packagesAvailable
              ? "Published packages are for graphic-designer portfolio websites only."
              : "Custom scope and pricing are confirmed after reviewing your brief."}
          </small>
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="business_name">Business or brand name</label>
          <input id="business_name" name="business_name" autoComplete="organization" maxLength={140} placeholder="e.g. your business name" />
        </div>
        <div className="form-field">
          <label htmlFor="budget_range">Estimated budget <span aria-hidden="true">*</span></label>
          <select id="budget_range" name="budget_range" required defaultValue="">
            <option value="" disabled>Select a range</option>
            {budgetOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
          </select>
          <small>A guide only—your written proposal will confirm the cost.</small>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="brief">What would you like to create or improve? <span aria-hidden="true">*</span></label>
        <textarea
          id="brief"
          name="brief"
          required
          minLength={20}
          maxLength={4000}
          placeholder="Tell us about your business, who you serve, what you need and what a useful result would look like."
        />
        <small>At least 20 characters. Please don’t include passwords or sensitive personal information.</small>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="deadline">Preferred timing</label>
          <select
            id="deadline"
            name="deadline_choice"
            value={deadlineChoice}
            onChange={(event) => setDeadlineChoice(event.target.value)}
          >
            {deadlineOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
          </select>
        </div>
        {deadlineChoice === "specific-date" ? (
          <div className="form-field">
            <label htmlFor="preferred_deadline_date">Preferred date <span aria-hidden="true">*</span></label>
            <input id="preferred_deadline_date" name="preferred_deadline_date" type="date" required />
          </div>
        ) : (
          <div className="form-field">
            <label htmlFor="full_name">Your name <span aria-hidden="true">*</span></label>
            <input id="full_name" name="full_name" autoComplete="name" minLength={2} maxLength={120} required placeholder="Full name" />
          </div>
        )}
      </div>
      {deadlineChoice === "specific-date" ? (
        <div className="form-field">
          <label htmlFor="full_name">Your name <span aria-hidden="true">*</span></label>
          <input id="full_name" name="full_name" autoComplete="name" minLength={2} maxLength={120} required placeholder="Full name" />
        </div>
      ) : null}

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" />
        </div>
        <div className="form-field">
          <label htmlFor="phone">WhatsApp or phone number</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" minLength={7} maxLength={30} pattern="[0-9+().\s-]+" placeholder="e.g. 0800 000 0000" />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="preferred_contact">How should we contact you? <span aria-hidden="true">*</span></label>
        <select id="preferred_contact" name="preferred_contact" defaultValue="whatsapp" required>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
          <option value="phone">Phone call</option>
        </select>
      </div>

      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <button className="button button--primary" type="submit" disabled={status.kind === "submitting"}>
        {status.kind === "submitting" ? <><LoaderCircle size={17} className="spin" aria-hidden="true" /> Sending request…</> : <>Send project request <ArrowRight size={16} aria-hidden="true" /></>}
      </button>
      <p className="form-fineprint">
        By submitting, you agree that GROWTHLY may use these details to respond to your enquiry. We don’t send your personal details to advertising or analytics platforms.
      </p>
    </form>
  );
}
