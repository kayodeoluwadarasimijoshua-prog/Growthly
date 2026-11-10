"use client";
import { useEffect, useState } from "react";
import { creativeProjectSchema } from "@/lib/cms/creative";
import type { CmsProject } from "@/lib/cms/schema";
export function CreativeInbox({
  onImport,
}: {
  onImport: (project: CmsProject) => void;
}) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [rows, setRows] = useState<
    { id: string; project: CmsProject; status: string }[]
  >([]);
  const [message, setMessage] = useState("Loading submissions…");
  useEffect(() => {
    let active = true;
    fetch("/api/creative/projects")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        if (active) {
          setRows(
            data.projects.filter(
              (row: { project: unknown }) =>
                creativeProjectSchema.safeParse(row.project).success,
            ),
          );
          setMessage("");
        }
      })
      .catch((error) => {
        if (active) setMessage(error.message ?? "Submissions unavailable.");
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <section>
      <h2>Creative submissions</h2>
      <details className="home-feature-guide">
        <summary>Invite a graphic-design / AI-advert editor</summary>
        <div className="home-feature-guide__body">
          <p>
            The invite creates a website login with restricted draft access. It
            does not give your friend a Supabase dashboard account or owner
            permissions.
          </p>
          <form
            method="post"
            action="/api/admin/creative/invite"
            onSubmit={async (event) => {
              event.preventDefault();
              if (inviting) return;
              setInviting(true);
              setInviteMessage("");
              try {
                const response = await fetch("/api/admin/creative/invite", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: inviteEmail }),
                });
                const data = await response.json();
                setInviteMessage(data.message ?? "Please retry.");
                if (response.ok) setInviteEmail("");
              } catch {
                setInviteMessage(
                  "The invitation could not be completed. Check the account in Supabase before retrying.",
                );
              } finally {
                setInviting(false);
              }
            }}
          >
            <label className="cms-field">
              <span>Friend’s email address</span>
              <input
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                value={inviteEmail}
                disabled={inviting}
                onChange={(event) => setInviteEmail(event.target.value)}
              />
            </label>
            <button
              type="submit"
              className="button button--outline button--small"
              disabled={inviting}
            >
              {inviting ? "Sending…" : "Send creative-editor invitation"}
            </button>
          </form>
          <p role="status">{inviteMessage}</p>
        </div>
      </details>
      <p>
        Private graphic-design and AI-advert work. Import a copy into your CMS
        draft, review it and publish using your normal controls. Importing does
        not publish or replace existing projects.
      </p>
      <p role="status">{message}</p>
      {!message && !rows.length && (
        <p>No creative drafts have been submitted yet.</p>
      )}
      {rows.map((row) => (
        <article key={row.id} className="creative-card">
          <span className="eyebrow">{row.status}</span>
          <h3>{row.project.name || "Untitled project"}</h3>
          <p>{row.project.summary}</p>
          <p>{row.project.overview}</p>
          <button
            type="button"
            className="button button--outline button--small"
            onClick={() =>
              onImport({
                ...structuredClone(row.project),
                published: false,
                publicationConfirmed: false,
                featured: false,
                image: row.project.image
                  ? { ...row.project.image, permissionConfirmed: false }
                  : null,
              })
            }
          >
            Import {row.project.name || "project"} into owner draft
          </button>
        </article>
      ))}
    </section>
  );
}
