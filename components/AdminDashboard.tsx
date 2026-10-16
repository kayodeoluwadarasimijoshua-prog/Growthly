"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownToLine, LogOut, RefreshCw } from "lucide-react";
import { Brand } from "@/components/Brand";
import { budgetOptions, websitePackages } from "@/config/business";
import { services } from "@/config/content";
import {
  depositStatuses,
  leadStatuses,
  type LeadRecord,
  type LeadStatus,
} from "@/lib/leads";

const statusLabel = (status: LeadStatus) =>
  leadStatuses.find((item) => item.value === status)?.label ?? status;
const serviceLabel = (slug: string) =>
  services.find((item) => item.slug === slug)?.shortTitle ?? slug;
const packageLabel = (slug: string) =>
  websitePackages.find((item) => item.id === slug)?.name ??
  (slug === "custom" ? "Custom project" : slug);
const budgetLabel = (value: string) =>
  budgetOptions.find((item) => item.value === value)?.label ?? value;
const deadlineLabel = (value: string) =>
  ({
    flexible: "Flexible",
    "within-2-weeks": "Within 2 weeks",
    "2-4-weeks": "In 2–4 weeks",
    "1-2-months": "In 1–2 months",
  })[value] ?? value;

function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf())
    ? value
    : new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(date);
}

function safeCsvCell(value: unknown) {
  let text = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function AdminDashboard({
  initialLeads,
  userEmail,
}: {
  initialLeads: LeadRecord[];
  userEmail: string;
}) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [activeId, setActiveId] = useState(initialLeads[0]?.id ?? null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [pageMessage, setPageMessage] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;
      const haystack = [
        lead.full_name,
        lead.business_name,
        lead.email,
        lead.phone,
        lead.service,
        lead.brief,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesStatus && (!needle || haystack.includes(needle));
    });
  }, [leads, query, statusFilter]);

  const activeLead = leads.find((lead) => lead.id === activeId) ?? null;

  function updateLead(updated: LeadRecord) {
    setLeads((current) =>
      current.map((lead) => (lead.id === updated.id ? updated : lead)),
    );
  }

  function exportCsv() {
    const columns = [
      "created_at",
      "full_name",
      "business_name",
      "email",
      "phone",
      "preferred_contact",
      "service",
      "package",
      "budget",
      "preferred_deadline",
      "brief",
      "status",
      "assigned_to",
      "quoted_amount",
      "deposit_status",
      "follow_up_date",
      "internal_notes",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ];
    const rows = filtered.map((lead) => [
      lead.created_at,
      lead.full_name,
      lead.business_name,
      lead.email,
      lead.phone,
      lead.preferred_contact,
      serviceLabel(lead.service),
      packageLabel(lead.package_id),
      budgetLabel(lead.budget_range),
      deadlineLabel(lead.preferred_deadline),
      lead.brief,
      statusLabel(lead.status),
      lead.assigned_to,
      lead.quoted_amount,
      lead.deposit_status,
      lead.follow_up_date,
      lead.internal_notes,
      lead.attribution?.utm_source,
      lead.attribution?.utm_medium,
      lead.attribution?.utm_campaign,
      lead.attribution?.utm_term,
      lead.attribution?.utm_content,
    ]);
    const csv = [columns, ...rows]
      .map((row) => row.map(safeCsvCell).join(","))
      .join("\r\n");
    const objectUrl = URL.createObjectURL(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = `growthly-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  }

  async function signOut() {
    setSigningOut(true);
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) {
        setPageMessage(
          "Sign-out could not be completed. Please close this browser session and try again.",
        );
        setSigningOut(false);
        return;
      }
      router.replace("/admin/login");
      router.refresh();
    } catch {
      setPageMessage(
        "Sign-out failed. Close this browser session and try again.",
      );
      setSigningOut(false);
    }
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="container admin-header__inner">
          <Brand />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a
              className="button button--outline button--small"
              href="/admin/content"
            >
              Website content
            </a>
            <span className="muted" style={{ fontSize: 12 }}>
              {userEmail}
            </span>
            <button
              className="button button--outline button--small"
              type="button"
              onClick={signOut}
              disabled={signingOut}
            >
              <LogOut size={15} aria-hidden="true" />{" "}
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      </header>
      <section className="container admin-content">
        <div className="admin-title-row">
          <div>
            <span className="eyebrow">Private workspace</span>
            <h1>Project enquiries</h1>
            <p>
              Lead details are available only to signed-in GROWTHLY
              administrators.
            </p>
          </div>
          <button
            className="button button--outline button--small"
            type="button"
            onClick={exportCsv}
            disabled={!filtered.length}
          >
            <ArrowDownToLine size={15} aria-hidden="true" /> Export filtered CSV
            ({filtered.length})
          </button>
        </div>
        {pageMessage ? (
          <div className="form-status form-status--error" role="alert">
            {pageMessage}
          </div>
        ) : null}
        <div className="admin-panel">
          <div className="admin-filters">
            <label className="sr-only" htmlFor="lead-search">
              Search leads
            </label>
            <input
              className="admin-input"
              id="lead-search"
              type="search"
              placeholder="Search name, business, service…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <label className="sr-only" htmlFor="status-filter">
              Filter by status
            </label>
            <select
              className="admin-select"
              id="status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              {leadStatuses.map((status) => (
                <option value={status.value} key={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <span className="muted" style={{ fontSize: 12 }}>
              {filtered.length} of {leads.length} loaded
            </span>
          </div>
          {filtered.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Enquiry</th>
                    <th scope="col">Service</th>
                    <th scope="col">Budget</th>
                    <th scope="col">Status</th>
                    <th scope="col">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <button
                          className="admin-table__lead-button"
                          type="button"
                          aria-pressed={lead.id === activeId}
                          onClick={() => setActiveId(lead.id)}
                        >
                          {lead.full_name}
                        </button>
                        <div className="muted" style={{ fontSize: 11 }}>
                          {lead.business_name || lead.preferred_contact}
                        </div>
                      </td>
                      <td>{serviceLabel(lead.service)}</td>
                      <td>{budgetLabel(lead.budget_range)}</td>
                      <td>
                        <span className="status-pill">
                          {statusLabel(lead.status)}
                        </span>
                      </td>
                      <td>{dateLabel(lead.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-empty">
              {leads.length
                ? "No enquiries match those filters."
                : "No enquiries have been saved yet. New project requests will appear here when the form backend is configured."}
            </div>
          )}
          <p className="form-fineprint" style={{ marginTop: 17 }}>
            The dashboard loads up to 1,000 most recent records. Use CSV export
            for the currently filtered records; configure pagination before the
            lead volume reaches that limit.
          </p>
        </div>

        {activeLead ? (
          <LeadDetail
            key={activeLead.id}
            lead={activeLead}
            onUpdated={updateLead}
          />
        ) : null}
      </section>
    </div>
  );
}

function LeadDetail({
  lead,
  onUpdated,
}: {
  lead: LeadRecord;
  onUpdated: (lead: LeadRecord) => void;
}) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [assignee, setAssignee] = useState(lead.assigned_to ?? "");
  const [notes, setNotes] = useState(lead.internal_notes ?? "");
  const [quotedAmount, setQuotedAmount] = useState(
    lead.quoted_amount === null ? "" : String(lead.quoted_amount),
  );
  const [depositStatus, setDepositStatus] = useState(lead.deposit_status);
  const [followUpDate, setFollowUpDate] = useState(lead.follow_up_date ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    const amount = quotedAmount.trim() === "" ? null : Number(quotedAmount);
    if (amount !== null && (!Number.isFinite(amount) || amount < 0)) {
      setError("Enter a valid quoted amount or leave it blank.");
      setBusy(false);
      return;
    }
    const update = {
      status,
      assigned_to: assignee.trim() || null,
      internal_notes: notes,
      quoted_amount: amount,
      deposit_status: depositStatus,
      follow_up_date: followUpDate || null,
    };
    try {
      const response = await fetch(
        `/api/admin/leads/${encodeURIComponent(lead.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(update),
        },
      );
      const result = (await response.json().catch(() => null)) as {
        message?: string;
        lead?: Partial<LeadRecord>;
      } | null;
      if (!response.ok || !result?.lead) {
        setError(
          result?.message ??
            "The lead could not be updated. Refresh and try again.",
        );
        setBusy(false);
        return;
      }
      const updated = { ...lead, ...result.lead } as LeadRecord;
      onUpdated(updated);
      setMessage("Lead details saved.");
      setBusy(false);
    } catch {
      setError(
        "The lead could not be updated. Check your connection and try again.",
      );
      setBusy(false);
    }
  }

  const attribution = Object.entries(lead.attribution ?? {}).filter(
    ([, value]) => Boolean(value),
  );

  return (
    <form className="admin-detail" onSubmit={save}>
      <section
        className="admin-detail__main"
        aria-labelledby="lead-detail-title"
      >
        <div>
          <span className="eyebrow">Enquiry details</span>
          <h2 id="lead-detail-title" style={{ marginTop: 10 }}>
            {lead.full_name}
          </h2>
        </div>
        <div className="admin-detail__meta">
          {lead.business_name ? (
            <span>
              <strong>Business:</strong> {lead.business_name}
            </span>
          ) : null}
          {lead.email ? (
            <span>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${lead.email}`}>{lead.email}</a>
            </span>
          ) : null}
          {lead.phone ? (
            <span>
              <strong>Phone:</strong>{" "}
              <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}>
                {lead.phone}
              </a>
            </span>
          ) : null}
          <span>
            <strong>Preferred contact:</strong> {lead.preferred_contact}
          </span>
          <span>
            <strong>Received:</strong> {dateLabel(lead.created_at)}
          </span>
          <span>
            <strong>Service:</strong> {serviceLabel(lead.service)} ·{" "}
            {packageLabel(lead.package_id)}
          </span>
          <span>
            <strong>Budget:</strong> {budgetLabel(lead.budget_range)}
          </span>
          <span>
            <strong>Preferred timing:</strong>{" "}
            {deadlineLabel(lead.preferred_deadline)}
          </span>
        </div>
        <div>
          <h3>Project brief</h3>
          <p className="admin-detail__brief" style={{ marginTop: 9 }}>
            {lead.brief}
          </p>
        </div>
        <div>
          <h3>Campaign attribution</h3>
          {attribution.length ? (
            <div className="admin-detail__meta" style={{ marginTop: 8 }}>
              {attribution.map(([key, value]) => (
                <span key={key}>
                  <strong>{key.replace("utm_", "")}:</strong> {value}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ marginTop: 8, fontSize: 12 }}>
              No UTM campaign values were provided.
            </p>
          )}
        </div>
      </section>

      <section
        className="admin-detail__side"
        aria-label="Lead management fields"
      >
        <h3>Manage lead</h3>
        <div className="admin-detail__grid">
          <div className="admin-field">
            <label htmlFor="lead-status">Status</label>
            <select
              className="admin-select"
              id="lead-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as LeadStatus)}
            >
              {leadStatuses.map((item) => (
                <option value={item.value} key={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="admin-field">
            <label htmlFor="lead-deposit">Deposit status</label>
            <select
              className="admin-select"
              id="lead-deposit"
              value={depositStatus}
              onChange={(event) =>
                setDepositStatus(event.target.value as typeof depositStatus)
              }
            >
              {depositStatuses.map((item) => (
                <option value={item.value} key={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="admin-field">
          <label htmlFor="lead-assignee">Assigned to</label>
          <input
            className="admin-input"
            id="lead-assignee"
            maxLength={120}
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            placeholder="Team member name"
          />
        </div>
        <div className="admin-detail__grid">
          <div className="admin-field">
            <label htmlFor="lead-quote">Quoted amount (₦)</label>
            <input
              className="admin-input"
              id="lead-quote"
              type="number"
              min="0"
              step="0.01"
              value={quotedAmount}
              onChange={(event) => setQuotedAmount(event.target.value)}
              placeholder="Not quoted"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="lead-follow-up">Follow-up date</label>
            <input
              className="admin-input"
              id="lead-follow-up"
              type="date"
              value={followUpDate}
              onChange={(event) => setFollowUpDate(event.target.value)}
            />
          </div>
        </div>
        <div className="admin-field">
          <label htmlFor="lead-notes">Private internal notes</label>
          <textarea
            className="admin-textarea"
            id="lead-notes"
            maxLength={5000}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Visible only to authorised administrators"
          />
        </div>
        {error ? (
          <div className="form-status form-status--error" role="alert">
            {error}
          </div>
        ) : null}
        {message ? (
          <div className="form-status form-status--success" role="status">
            {message}
          </div>
        ) : null}
        <button
          className="button button--primary"
          type="submit"
          disabled={busy}
        >
          {busy ? (
            <>
              <RefreshCw size={15} aria-hidden="true" /> Saving…
            </>
          ) : (
            "Save lead details"
          )}
        </button>
      </section>
    </form>
  );
}
