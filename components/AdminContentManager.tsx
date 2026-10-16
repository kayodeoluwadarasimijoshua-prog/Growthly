"use client";
import { useEffect, useRef, useState, useId, type ChangeEvent } from "react";
import {
  cmsDocumentSchema,
  type CmsDocument,
  type CmsProject,
} from "@/lib/cms/schema";
import { servicePages } from "@/config/service-pages";
import {
  packagesFor,
  defaultPrices,
  expandPriceTokens,
} from "@/lib/cms/format";

type EditorState = {
  revision: number;
  draft: CmsDocument;
  published: CmsDocument | null;
  publishedAt: string | null;
  publicEnabled: boolean;
  history: { revision: number; published: boolean; created_at: string }[];
};
function Field({
  label,
  value,
  onChange,
  multiline = false,
  hint,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  hint?: string;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <label className="cms-field">
      <span id={`${id}-label`}>{label}</span>
      {multiline ? (
        <textarea
          aria-labelledby={`${id}-label`}
          aria-describedby={hint ? `${id}-hint` : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          disabled={disabled}
        />
      ) : (
        <input
          aria-labelledby={`${id}-label`}
          aria-describedby={hint ? `${id}-hint` : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      )}{" "}
      {hint && <small id={`${id}-hint`}>{hint}</small>}
    </label>
  );
}
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
export function AdminContentManager({
  initial,
  userEmail,
}: {
  initial: EditorState;
  userEmail: string;
}) {
  const [state, setState] = useState(initial);
  const [doc, setDoc] = useState(() => clone(initial.draft));
  const [tab, setTab] = useState("projects");
  const [active, setActive] = useState(initial.draft.projects[0]?.id ?? "");
  const [faqGroup, setFaqGroup] = useState("website-development");
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const [message, setMessage] = useState("");
  const [issues, setIssues] = useState<string[]>([]);
  const [pricingConfirmed, setPricingConfirmed] = useState(false);
  useEffect(() => {
    if (!dirty) return;
    const guard = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);
  function change(update: (d: CmsDocument) => void) {
    setDoc((old) => {
      const next = clone(old);
      update(next);
      return next;
    });
    setDirty(true);
    setPricingConfirmed(false);
    setMessage("");
    setIssues([]);
  }
  const project = doc.projects.find((p) => p.id === active);
  function projectChange(update: Partial<CmsProject>) {
    change((d) => {
      const p = d.projects.find((p) => p.id === active);
      if (p) Object.assign(p, update);
    });
  }
  async function action(
    kind: "save" | "publish" | "restore",
    restoreRevision?: number,
  ) {
    if (pending.current) return;
    if (kind !== "restore") {
      const parsed = cmsDocumentSchema.safeParse(doc);
      if (!parsed.success) {
        setIssues(
          parsed.error.issues
            .slice(0, 15)
            .map((i) => `${i.path.join(".")}: ${i.message}`),
        );
        setMessage("Check the fields below. Nothing has been saved.");
        return;
      }
    }
    if (
      kind === "restore" &&
      dirty &&
      !confirm("Replace unsaved edits with this saved revision as a draft?")
    )
      return;
    pending.current = true;
    setBusy(true);
    setIssues([]);
    setMessage("");
    try {
      const r = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: kind,
          expectedRevision: state.revision,
          ...(kind === "restore" ? { restoreRevision } : { document: doc }),
          confirmPricing: pricingConfirmed,
        }),
      });
      const result = await r.json();
      if (!r.ok) {
        setMessage(result.message ?? "The update was not saved.");
        setIssues(result.issues ?? []);
        return;
      }
      const loaded = await fetch("/api/admin/content", { cache: "no-store" });
      if (!loaded.ok) throw new Error("Reload required");
      const next: EditorState = await loaded.json();
      if (next.revision !== result.revision)
        throw new Error("Changed in another tab");
      setState(next);
      setDoc(clone(next.draft));
      if (!next.draft.projects.some((p) => p.id === active))
        setActive(next.draft.projects[0]?.id ?? "");
      setDirty(false);
      setPricingConfirmed(false);
      setMessage(result.message);
    } catch {
      setMessage(
        "We could not confirm the latest saved revision. Keep this page open, copy any unsaved text, then reload before retrying.",
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  async function upload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !project || pending.current) return;
    if (
      file.size > 2_000_000 ||
      !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ) {
      setMessage("Choose a JPEG, PNG or WebP under 2 MB.");
      return;
    }
    const id = project.id;
    pending.current = true;
    setBusy(true);
    setMessage("");
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = () => reject(new Error("File read"));
        reader.readAsDataURL(file);
      });
      const r = await fetch("/api/admin/content/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: file.type, data }),
      });
      const result = await r.json();
      if (!r.ok) {
        setMessage(result.message);
        return;
      }
      change((d) => {
        const p = d.projects.find((p) => p.id === id);
        if (p)
          p.image = {
            assetId: result.assetId,
            width: result.width,
            height: result.height,
            alt: "",
            credit: "",
            permissionConfirmed: false,
          };
      });
      setMessage(
        "Image stored privately. Add alt text, credit and permission before publishing. It is not public yet.",
      );
    } catch {
      setMessage("Image upload failed. Your project edits are still here.");
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  function addProject() {
    const id = crypto.randomUUID();
    change((d) =>
      d.projects.push({
        id,
        slug: `project-${id.slice(0, 8)}`,
        name: "",
        category: "",
        service: "website-development",
        kind: "client",
        liveUrl: "",
        videoUrl: "",
        summary: "",
        overview: "",
        creativeIntent: "",
        scope: [],
        designChoices: [],
        note: "",
        image: null,
        published: false,
        publicationConfirmed: false,
        featured: false,
      }),
    );
    setActive(id);
  }
  const faqs =
    faqGroup === "website-development"
      ? doc.settings.websiteFaqs
      : doc.settings.serviceFaqs[faqGroup];
  function updateFaqs(next: typeof faqs) {
    change((d) => {
      if (faqGroup === "website-development") {
        d.settings.websiteFaqs = next;
        d.settings.serviceFaqs[faqGroup] = next;
      } else d.settings.serviceFaqs[faqGroup] = next;
    });
  }
  const priceChanged =
    JSON.stringify(doc.settings.prices) !==
    JSON.stringify(state.published?.settings.prices ?? defaultPrices);
  return (
    <div className="admin-shell cms-editor">
      <header className="admin-header">
        <div className="container admin-header__inner">
          <a className="text-link" href="/admin">
            ← Lead dashboard
          </a>
          <span>{userEmail}</span>
          <a
            className="text-link"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open public site ↗
          </a>
        </div>
      </header>
      <section className="container admin-content">
        <span className="eyebrow">Private content workspace</span>
        <h1>Website content</h1>
        <p>
          Add projects, manage your public information and publish without
          changing code. Do not put private customer enquiries in this editor.
        </p>
        <noscript>
          <p role="alert">
            This private editor needs JavaScript to save or publish. Nothing
            will be saved while scripts are disabled. The public website still
            works without JavaScript.
          </p>
        </noscript>
        <div className="delivery-note">
          <strong>
            {state.publicEnabled
              ? "Public content editing is enabled."
              : "One-time public setup is not enabled yet."}
          </strong>
          <p>
            {state.publicEnabled
              ? "Only published changes appear on new page requests. Drafts and image uploads stay private."
              : "You can prepare drafts after storage setup. An owner-approved CMS activation and deployment are required once before stored content appears publicly."}{" "}
            This is broad administrator access, not a VA account.
          </p>
        </div>
        <p className="cms-revision">
          Revision {state.revision} ·{" "}
          {dirty ? "Unsaved changes" : "No unsaved changes"} ·{" "}
          {state.publishedAt
            ? `Last publication: ${new Date(state.publishedAt).toLocaleString()}`
            : "No stored publication yet"}
        </p>
        <a className="text-link" href="#cms-save-actions">
          Go to save / publish ↓
        </a>
        <nav className="cms-tabs" aria-label="Content sections">
          {[
            ["projects", "Projects"],
            ["business", "Contact & pricing"],
            ["copy", "Page text"],
            ["faq", "FAQs"],
            ["history", "History"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={tab === id}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div role="status" aria-live="polite" className="cms-status">
          {message}
        </div>
        {issues.length > 0 && (
          <div role="alert" className="form-status form-status--error">
            <strong>Check these fields</strong>
            <ul>
              {issues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
        <fieldset disabled={busy}>
          <legend className="sr-only">Editable website content</legend>
          {tab === "projects" && (
            <div className="cms-project-layout">
              <aside aria-label="Project list">
                <button
                  type="button"
                  className="button button--primary button--small"
                  onClick={addProject}
                  disabled={doc.projects.length >= 50}
                >
                  Add project
                </button>
                <div className="cms-project-list">
                  {doc.projects.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={active === p.id}
                      onClick={() => setActive(p.id)}
                    >
                      {p.name || "Untitled project"}
                      <small>
                        {p.published
                          ? "Included on publication"
                          : "Hidden / draft"}
                      </small>
                    </button>
                  ))}
                </div>
              </aside>
              <div>
                {project ? (
                  <>
                    <h2>{project.name || "New project"}</h2>
                    <p className="form-fineprint">
                      Save incomplete work as a draft. To make it public,
                      complete the content, confirm permissions and select
                      “Include on publication”, then Publish.
                    </p>
                    <div className="cms-field-grid">
                      <Field
                        label="Project name"
                        value={project.name}
                        onChange={(name) => {
                          const slugify = (v: string) =>
                            v
                              .normalize("NFKD")
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/^-|-$/g, "")
                              .slice(0, 80)
                              .replace(/-$/, "");
                          const locked = state.published?.projects.some(
                            (p) => p.id === project.id && p.published,
                          );
                          const auto =
                            !locked &&
                            (project.slug === slugify(project.name) ||
                              project.slug ===
                                `project-${project.id.slice(0, 8)}`);
                          projectChange({
                            name,
                            ...(auto && slugify(name)
                              ? { slug: slugify(name) }
                              : {}),
                          });
                        }}
                      />
                      <Field
                        label="URL slug"
                        value={project.slug}
                        onChange={(slug) => projectChange({ slug })}
                        disabled={
                          !!state.published?.projects.some(
                            (p) => p.id === project.id && p.published,
                          )
                        }
                        hint="Lowercase words with hyphens. Locked while the project is publicly listed."
                      />
                      <label className="cms-field">
                        <span>Service</span>
                        <select
                          aria-label="Service"
                          value={project.service}
                          onChange={(e) =>
                            projectChange({
                              service: e.target.value,
                              featured: false,
                            })
                          }
                        >
                          {servicePages.map((p) => (
                            <option key={p.slug} value={p.slug}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="cms-field">
                        <span>Work type</span>
                        <select
                          aria-label="Work type"
                          value={project.kind}
                          onChange={(e) =>
                            projectChange({
                              kind: e.target.value as CmsProject["kind"],
                              featured: false,
                            })
                          }
                        >
                          <option value="client">Genuine client work</option>
                          <option value="demonstration">
                            Self-initiated demonstration — not client work
                          </option>
                        </select>
                      </label>
                      <Field
                        label="Category"
                        value={project.category}
                        onChange={(category) => projectChange({ category })}
                      />
                      <Field
                        label="Live website URL (optional)"
                        value={project.liveUrl}
                        onChange={(liveUrl) => projectChange({ liveUrl })}
                        hint="Public HTTPS link only; not fetched or embedded."
                      />
                      <Field
                        label="External video sample URL (optional)"
                        value={project.videoUrl}
                        onChange={(videoUrl) => projectChange({ videoUrl })}
                        hint="Opens on its provider's website. No third-party video loads automatically."
                      />
                    </div>
                    <Field
                      label="Short summary"
                      value={project.summary}
                      onChange={(summary) => projectChange({ summary })}
                      multiline
                    />
                    <Field
                      label="What Growthly delivered"
                      value={project.overview}
                      onChange={(overview) => projectChange({ overview })}
                      multiline
                    />
                    <Field
                      label="Purpose / creative intent"
                      value={project.creativeIntent}
                      onChange={(creativeIntent) =>
                        projectChange({ creativeIntent })
                      }
                      multiline
                    />
                    <div className="cms-field-grid">
                      <Field
                        label="Deliverables — one per line"
                        value={project.scope.join("\n")}
                        onChange={(v) =>
                          projectChange({ scope: v.split("\n") })
                        }
                        multiline
                      />
                      <Field
                        label="Design decisions — one per line"
                        value={project.designChoices.join("\n")}
                        onChange={(v) =>
                          projectChange({ designChoices: v.split("\n") })
                        }
                        multiline
                      />
                    </div>
                    <Field
                      label="Project note / limitations"
                      value={project.note}
                      onChange={(note) => projectChange({ note })}
                      multiline
                      hint="Do not invent results, testimonials or guarantees."
                    />
                    <div className="cms-media-panel">
                      <h3>Project image</h3>
                      <label className="cms-field">
                        <span>Upload image</span>
                        <input
                          type="file"
                          aria-label="Upload image"
                          aria-describedby="cms-upload-help"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={upload}
                        />
                        <small id="cms-upload-help">
                          Up to 2 MB / 16 megapixels. Converted to WebP with
                          metadata removed. No SVG or animated images.
                        </small>
                      </label>
                      {project.image && (
                        <>
                          <div className="cms-image-preview">
                            <img
                              src={`/api/admin/content/media/${project.image.assetId}`}
                              width={project.image.width}
                              height={project.image.height}
                              alt={project.image.alt || "Private draft preview"}
                            />
                          </div>
                          <Field
                            label="Image alt text"
                            value={project.image.alt}
                            onChange={(alt) =>
                              projectChange({
                                image: { ...project.image!, alt },
                              })
                            }
                          />
                          <Field
                            label="Image source / credit"
                            value={project.image.credit}
                            onChange={(credit) =>
                              projectChange({
                                image: { ...project.image!, credit },
                              })
                            }
                          />
                          <label className="cms-check">
                            <input
                              type="checkbox"
                              checked={project.image.permissionConfirmed}
                              onChange={(e) =>
                                projectChange({
                                  image: {
                                    ...project.image!,
                                    permissionConfirmed: e.target.checked,
                                  },
                                })
                              }
                            />
                            I have permission to publish this image.
                          </label>
                          <button
                            type="button"
                            className="button button--outline button--small"
                            onClick={() => projectChange({ image: null })}
                          >
                            Remove image from project
                          </button>
                        </>
                      )}
                    </div>
                    <label className="cms-check">
                      <input
                        type="checkbox"
                        checked={project.publicationConfirmed}
                        onChange={(e) =>
                          projectChange({
                            publicationConfirmed: e.target.checked,
                          })
                        }
                      />
                      I confirm this description is truthful and I have
                      permission to publish the project information.
                    </label>
                    <label className="cms-check">
                      <input
                        type="checkbox"
                        checked={project.published}
                        onChange={(e) =>
                          projectChange({ published: e.target.checked })
                        }
                      />
                      Include this project on the next publication.
                    </label>
                    {project.service === "website-development" &&
                      project.kind === "client" && (
                        <label className="cms-check">
                          <input
                            type="checkbox"
                            checked={project.featured}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              change((d) => {
                                d.projects.forEach(
                                  (p) =>
                                    (p.featured =
                                      p.id === project.id && checked),
                                );
                              });
                            }}
                          />
                          Feature this website on Home.
                        </label>
                      )}
                    <details className="cms-draft-preview">
                      <summary>Preview this draft project</summary>
                      <p className="form-fineprint">
                        Private preview — not a public page. Images use the
                        authenticated preview route.
                      </p>
                      <span className="capability-label">
                        {project.kind === "demonstration"
                          ? "Self-initiated demonstration — not client work"
                          : "Client work (permission required)"}
                      </span>
                      <h3>{project.name || "Untitled project"}</h3>
                      <p>{project.summary}</p>
                      <p>{project.overview}</p>
                      <ul>
                        {project.scope.map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </details>
                    <div className="cms-project-actions">
                      <button
                        type="button"
                        className="button button--outline button--small"
                        onClick={() => {
                          const at = doc.projects.findIndex(
                            (p) => p.id === active,
                          );
                          if (at > 0)
                            change((d) => {
                              [d.projects[at - 1], d.projects[at]] = [
                                d.projects[at],
                                d.projects[at - 1],
                              ];
                            });
                        }}
                      >
                        Move earlier
                      </button>
                      <button
                        type="button"
                        className="button button--outline button--small"
                        onClick={() => {
                          const at = doc.projects.findIndex(
                            (p) => p.id === active,
                          );
                          if (at < doc.projects.length - 1)
                            change((d) => {
                              [d.projects[at + 1], d.projects[at]] = [
                                d.projects[at],
                                d.projects[at + 1],
                              ];
                            });
                        }}
                      >
                        Move later
                      </button>
                      <button
                        type="button"
                        className="button button--outline button--small"
                        onClick={() => {
                          if (
                            confirm(
                              "Remove this project from the draft? The public site changes only when you Publish.",
                            )
                          ) {
                            change((d) => {
                              d.projects = d.projects.filter(
                                (p) => p.id !== active,
                              );
                            });
                            setActive("");
                          }
                        }}
                      >
                        Remove project from draft
                      </button>
                      <a
                        className="text-link"
                        href={`/portfolio/${project.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open current public page ↗
                      </a>
                    </div>
                  </>
                ) : (
                  <p>
                    Select a project or add one. There is no need to create a
                    fictional client to fill this list.
                  </p>
                )}
              </div>
            </div>
          )}
          {tab === "business" && (
            <>
              <h2>Contact details and website prices</h2>
              <p>
                These values update public contact links, the hero price,
                package cards, default price guidance and metadata together.
                Package scope and year-one offers are not changed here.
              </p>
              <div className="cms-field-grid">
                {(["whatsapp", "alternativePhone", "tagline"] as const).map(
                  (key) => (
                    <Field
                      key={key}
                      label={
                        {
                          whatsapp: "WhatsApp number",
                          alternativePhone: "Alternative phone",
                          tagline: "Footer tagline",
                        }[key]
                      }
                      value={doc.settings[key]}
                      onChange={(v) =>
                        change((d) => {
                          d.settings[key] = v;
                        })
                      }
                    />
                  ),
                )}
              </div>
              <h3>Starting prices in NGN</h3>
              <div className="cms-field-grid">
                {(["starter", "business", "ecommerce"] as const).map(
                  (key, i) => (
                    <label className="cms-field" key={key}>
                      <span>
                        {
                          [
                            "Starter Website",
                            "Business Website — Recommended",
                            "E-commerce Website",
                          ][i]
                        }
                      </span>
                      <input
                        type="number"
                        aria-label={
                          [
                            "Starter Website",
                            "Business Website — Recommended",
                            "E-commerce Website",
                          ][i]
                        }
                        min="1000"
                        max="1000000000"
                        step="1"
                        value={doc.settings.prices[key]}
                        onChange={(e) =>
                          change((d) => {
                            d.settings.prices[key] = Number(e.target.value);
                          })
                        }
                      />
                      <small>{packagesFor(doc.settings)[i].price}</small>
                    </label>
                  ),
                )}
              </div>
              <p className="form-fineprint">
                Keep the starting prices in order. Publishing a price change
                requires a separate confirmation below. Existing signed
                proposals do not change.
              </p>
            </>
          )}
          {tab === "copy" && (
            <>
              <h2>Key page text</h2>
              {(
                [
                  "homeHeadline",
                  "homeEmphasis",
                  "homeIntro",
                  "aboutIntro",
                  "contactIntro",
                ] as const
              ).map((key) => (
                <Field
                  key={key}
                  label={
                    {
                      homeHeadline: "Home headline",
                      homeEmphasis: "Home headline — highlighted ending",
                      homeIntro: "Home introduction",
                      aboutIntro: "About introduction",
                      contactIntro: "Contact introduction",
                    }[key]
                  }
                  value={doc.settings[key]}
                  onChange={(v) =>
                    change((d) => {
                      d.settings[key] = v;
                    })
                  }
                  multiline={!["homeHeadline", "homeEmphasis"].includes(key)}
                  hint={
                    key === "contactIntro"
                      ? "Use {{service}} where the selected service should appear."
                      : "Plain text only. No HTML, scripts or unverified claims."
                  }
                />
              ))}
            </>
          )}
          {tab === "faq" && (
            <>
              <h2>Frequently asked questions</h2>
              <label className="cms-field">
                <span>FAQ page/group</span>
                <select
                  aria-label="FAQ page/group"
                  value={faqGroup}
                  onChange={(e) => setFaqGroup(e.target.value)}
                >
                  {servicePages.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.label}
                      {p.slug === "website-development"
                        ? " — Home and website pages"
                        : ""}
                    </option>
                  ))}
                </select>
              </label>
              <p className="form-fineprint">
                Use {"{{starter_price}}"}, {"{{business_price}}"} and{" "}
                {"{{ecommerce_price}}"} for changing prices, rather than typing
                amounts into new answers. Amount-only tokens such as{" "}
                {"{{starter_amount}}"} omit “From”. Typed amounts in custom
                answers are not updated automatically.
              </p>
              {faqs.map((f, i) => (
                <div className="cms-faq-row" key={i}>
                  <Field
                    label={`Question ${i + 1}`}
                    value={f.question}
                    onChange={(question) =>
                      updateFaqs(
                        faqs.map((v, j) => (j === i ? { ...v, question } : v)),
                      )
                    }
                  />
                  <Field
                    label={`Answer ${i + 1}`}
                    value={f.answer}
                    onChange={(answer) =>
                      updateFaqs(
                        faqs.map((v, j) => (j === i ? { ...v, answer } : v)),
                      )
                    }
                    multiline
                  />
                  <p className="form-fineprint">
                    Public answer preview:{" "}
                    {expandPriceTokens(f.answer, doc.settings)}
                  </p>
                  <button
                    type="button"
                    className="text-link"
                    disabled={faqs.length <= 1}
                    onClick={() => updateFaqs(faqs.filter((_, j) => i !== j))}
                  >
                    Remove question {i + 1}
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="button button--outline button--small"
                disabled={faqs.length >= 12}
                onClick={() =>
                  updateFaqs([...faqs, { question: "", answer: "" }])
                }
              >
                Add question
              </button>
            </>
          )}
          {tab === "history" && (
            <>
              <h2>Saved revisions</h2>
              <p>
                Restore a previous version as a draft, review it, then publish.
                History is private and does not contain customer leads.
              </p>
              <div className="cms-history">
                {state.history.map((h) => (
                  <div key={h.revision}>
                    <span>
                      Revision {h.revision} ·{" "}
                      {h.published ? "Published" : "Draft"} ·{" "}
                      {new Date(h.created_at).toLocaleString()}
                    </span>
                    <button
                      type="button"
                      className="button button--outline button--small"
                      onClick={() => action("restore", h.revision)}
                    >
                      Restore as draft
                    </button>
                  </div>
                ))}
                {!state.history.length && <p>No saved revisions yet.</p>}
              </div>
            </>
          )}
        </fieldset>
        <div className="cms-toolbar" id="cms-save-actions" tabIndex={-1}>
          {priceChanged && (
            <label className="cms-check">
              <input
                type="checkbox"
                checked={pricingConfirmed}
                onChange={(e) => setPricingConfirmed(e.target.checked)}
                disabled={busy}
              />
              I reviewed all three public starting prices and understand this
              changes new enquiries, not existing agreements.
            </label>
          )}
          <div>
            <button
              type="button"
              className="button button--outline"
              onClick={() => action("save")}
              disabled={busy}
            >
              {busy ? "Working…" : "Save draft"}
            </button>
            <button
              type="button"
              className="button button--primary"
              onClick={() => action("publish")}
              disabled={busy || (priceChanged && !pricingConfirmed)}
            >
              Publish changes
            </button>
            <button
              type="button"
              className="text-link"
              disabled={busy || !dirty}
              onClick={() => {
                if (confirm("Discard unsaved edits?")) {
                  setDoc(clone(state.draft));
                  setDirty(false);
                  setPricingConfirmed(false);
                  setIssues([]);
                  setMessage("Unsaved edits discarded.");
                }
              }}
            >
              Discard unsaved edits
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
