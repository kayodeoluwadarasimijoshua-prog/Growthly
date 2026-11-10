"use client";
import { useState } from "react";
export function WritingAssistant({
  service,
  source,
  onApply,
}: {
  service: string;
  source: string;
  onApply: (text: string) => void;
}) {
  const [suggestion, setSuggestion] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function refine() {
    setBusy(true);
    setStatus("");
    setSuggestion("");
    try {
      const response = await fetch("/api/creative/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, source }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.message ?? "The writing assistant is unavailable.",
        );
      setSuggestion(data.refinement);
      setStatus(
        "Review this suggestion before applying it. It has not been saved or published.",
      );
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "The writing assistant is unavailable.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="writing-assistant">
      <button
        className="button button--outline button--small"
        type="button"
        disabled={busy || source.trim().length < 20 || source.length > 2500}
        onClick={refine}
      >
        {busy ? "Refining…" : "Refine description with AI"}
      </button>
      <p className="form-fineprint">
        Reword your actual project notes. Don’t include private customer
        information. No facts, permissions or publication status are changed
        automatically.
      </p>
      <p aria-live="polite">{status}</p>
      {suggestion && (
        <>
          <label className="cms-field">
            <span>AI writing suggestion — review before use</span>
            <textarea
              value={suggestion}
              onChange={(event) => setSuggestion(event.target.value)}
              maxLength={2000}
              rows={6}
            />
          </label>
          <button
            className="button button--outline button--small"
            type="button"
            onClick={() => {
              onApply(suggestion);
              setSuggestion("");
              setStatus(
                "Suggestion applied to your unsaved draft. Review all facts before saving.",
              );
            }}
          >
            Apply to draft
          </button>
        </>
      )}
    </div>
  );
}
