"use client";
import { useEffect, useState } from "react";
import { blankCreativeProject } from "@/lib/cms/creative";
import type { CmsProject } from "@/lib/cms/schema";
import { WritingAssistant } from "@/components/WritingAssistant";
type Draft = {
  id: string;
  revision: number;
  project: CmsProject;
  status: string;
};
export function CreativeWorkspace() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [project, setProject] = useState<CmsProject | null>(null);
  const [revision, setRevision] = useState(0);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  async function load() {
    const response = await fetch("/api/creative/projects");
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message ?? "Draft storage is unavailable.");
    setDrafts(data.projects);
    return data.projects as Draft[];
  }
  useEffect(() => {
    let active = true;
    fetch("/api/creative/projects")
      .then(async (r) => {
        const d = await r.json();
        if (!active) return;
        if (!r.ok) throw new Error(d.message);
        setDrafts(d.projects);
      })
      .catch((error) => {
        if (active)
          setMessage(error.message ?? "Draft storage is unavailable.");
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!dirty) return;
    const guard = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);
  function update(patch: Partial<CmsProject>) {
    setProject((old) => (old ? { ...old, ...patch } : old));
    setDirty(true);
  }
  function select(draft?: Draft) {
    if (dirty && !confirm("Discard unsaved changes?")) return;
    setProject(
      draft
        ? structuredClone(draft.project)
        : blankCreativeProject(crypto.randomUUID()),
    );
    setRevision(draft?.revision ?? 0);
    setMessage("");
    setDirty(false);
  }
  async function save(status: "draft" | "submitted") {
    if (!project) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/creative/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project, expectedRevision: revision, status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setRevision(data.revision);
      setDirty(false);
      setMessage(data.message);
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not save. Keep your unsaved text and retry.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function upload(file?: File) {
    if (!project || !file) return;
    if (
      file.size > 2_000_000 ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ) {
      setMessage("Use JPEG, PNG or WebP under 2 MB.");
      return;
    }
    setBusy(true);
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const response = await fetch("/api/creative/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: file.type, data }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      update({
        image: {
          assetId: result.assetId,
          width: result.width,
          height: result.height,
          alt: "",
          credit: "",
          permissionConfirmed: false,
        },
      });
      setMessage(
        "Private image uploaded. Add a description and source credit before submitting.",
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="container admin-content creative-workspace">
      <span className="eyebrow">Private creative workspace</span>
      <h1>Your creative projects</h1>
      <p>
        Graphic design and AI adverts only. Save privately or submit for the
        owner to review. You cannot publish, change prices or access customer
        enquiries here.
      </p>
      <a className="text-link" href="/admin/login">
        Sign-in options
      </a>
      <p role="status" className="cms-status">
        {message}
      </p>
      <div className="creative-layout">
        <aside aria-label="Your creative drafts">
          <button
            type="button"
            className="button button--primary"
            onClick={() => select()}
            disabled={busy}
          >
            Add creative project
          </button>
          {drafts.map((draft) => (
            <button
              type="button"
              className="creative-card"
              key={draft.id}
              onClick={() => select(draft)}
              disabled={busy}
            >
              {draft.project.name || "Untitled project"}
              <small> · {draft.status}</small>
            </button>
          ))}
        </aside>
        {project ? (
          <fieldset disabled={busy}>
            <legend>
              Project draft ·{" "}
              {dirty ? "unsaved changes" : `revision ${revision}`}
            </legend>
            <label className="cms-field">
              <span>Service</span>
              <select
                value={project.service}
                onChange={(e) => update({ service: e.target.value })}
              >
                <option value="ai-video-adverts">AI video adverts</option>
                <option value="graphic-design">Graphic design</option>
              </select>
            </label>
            <label className="cms-field">
              <span>Project type</span>
              <select
                value={project.kind}
                onChange={(e) =>
                  update({ kind: e.target.value as CmsProject["kind"] })
                }
              >
                <option value="client">Actual client work</option>
                <option value="demonstration">
                  Self-initiated demonstration
                </option>
              </select>
            </label>
            {(
              [
                ["name", "Project name"],
                ["category", "Category"],
                ["summary", "Short summary"],
                ["overview", "Description / factual notes"],
                ["creativeIntent", "Creative purpose"],
                ["videoUrl", "Public video sample URL (optional)"],
                ["liveUrl", "Public project URL (optional)"],
                ["note", "Limitations / project note"],
              ] as const
            ).map(([key, label]) => (
              <label className="cms-field" key={key}>
                <span id={`creative-${key}-label`}>{label}</span>
                {["summary", "overview", "note", "creativeIntent"].includes(
                  key,
                ) ? (
                  <textarea
                    aria-labelledby={`creative-${key}-label`}
                    value={project[key]}
                    onChange={(e) => update({ [key]: e.target.value })}
                    maxLength={
                      key === "summary" ? 300 : key === "overview" ? 2000 : 1000
                    }
                  />
                ) : (
                  <input
                    aria-labelledby={`creative-${key}-label`}
                    value={project[key]}
                    onChange={(e) => update({ [key]: e.target.value })}
                    maxLength={
                      key === "name" ? 100 : key === "category" ? 140 : 2000
                    }
                  />
                )}
              </label>
            ))}
            <WritingAssistant
              service={project.service}
              source={project.overview}
              onApply={(overview) => update({ overview })}
            />
            {(
              [
                ["scope", "Deliverables — one per line"],
                ["designChoices", "Design decisions — one per line"],
              ] as const
            ).map(([key, label]) => (
              <label className="cms-field" key={key}>
                <span id={`creative-${key}-label`}>{label}</span>
                <textarea
                  aria-labelledby={`creative-${key}-label`}
                  value={project[key].join("\n")}
                  onChange={(e) =>
                    update({ [key]: e.target.value.split("\n") })
                  }
                />
              </label>
            ))}
            <label className="cms-field">
              <span>Project image (JPEG, PNG, WebP; under 2 MB)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => upload(e.target.files?.[0])}
              />
            </label>
            {project.image && (
              <>
                <img
                  className="creative-preview"
                  src={`/api/creative/media/${project.image.assetId}`}
                  width={project.image.width}
                  height={project.image.height}
                  alt={project.image.alt || "Private draft preview"}
                />
                <label className="cms-field">
                  <span>Image description</span>
                  <input
                    value={project.image.alt}
                    onChange={(e) =>
                      update({
                        image: { ...project.image!, alt: e.target.value },
                      })
                    }
                    maxLength={300}
                  />
                </label>
                <label className="cms-field">
                  <span>Image source / credit</span>
                  <input
                    value={project.image.credit}
                    onChange={(e) =>
                      update({
                        image: { ...project.image!, credit: e.target.value },
                      })
                    }
                    maxLength={300}
                  />
                </label>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => update({ image: null })}
                >
                  Remove image from draft
                </button>
              </>
            )}
            <p className="form-fineprint">
              For videos, supply a public HTTPS sample link. No automatic video
              embed or video file hosting is added. The owner reviews project
              and image publication permissions.
            </p>
            <div className="creative-actions">
              <button
                type="button"
                className="button button--outline"
                onClick={() => save("draft")}
              >
                Save private draft
              </button>
              <button
                type="button"
                className="button button--primary"
                onClick={() => save("submitted")}
              >
                Submit for owner review
              </button>
            </div>
          </fieldset>
        ) : (
          <p>Select a draft or add a creative project to get started.</p>
        )}
      </div>
      <noscript>
        This private workspace requires JavaScript. No draft will be saved while
        it is disabled.
      </noscript>
    </section>
  );
}
