"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MessageCircle, X, ArrowRight } from "lucide-react";
export function StudioGuide({
  answers,
  aiEnabled,
}: {
  answers: { question: string; answer: string }[];
  aiEnabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const pending = useRef<AbortController | null>(null);
  const path = usePathname();
  useEffect(() => {
    if (open) title.current?.focus();
    return () => pending.current?.abort();
  }, [open, path]);
  if (path.startsWith("/admin") || path.startsWith("/creative")) return null;
  function close() {
    pending.current?.abort();
    setOpen(false);
    setQuestion("");
    setAnswer("");
    setBusy(false);
    trigger.current?.focus();
  }
  async function ask() {
    setBusy(true);
    setAnswer("");
    const controller = new AbortController();
    pending.current = controller;
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      if (!controller.signal.aborted) setAnswer(data.answer);
    } catch (error) {
      if (!controller.signal.aborted)
        setAnswer(
          error instanceof Error ? error.message : "Please contact the team.",
        );
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  }
  return (
    <div
      className="studio-guide"
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="studio-guide-toggle"
        aria-expanded={open}
        aria-controls="growthly-guide"
        onClick={() => (open ? close() : setOpen(true))}
      >
        <MessageCircle size={18} aria-hidden="true" />
        {open ? "Close guide" : "Quick questions"}
      </button>
      {open && (
        <section
          id="growthly-guide"
          className="studio-guide-panel"
          role="region"
          aria-labelledby="guide-title"
        >
          <div className="studio-guide-heading">
            <h2 id="guide-title" tabIndex={-1} ref={title}>
              Ask Growthly
            </h2>
            <button
              type="button"
              aria-label="Close Growthly guide"
              onClick={close}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <p className="form-fineprint">
            {aiEnabled
              ? "Quick answers and an AI assistant. Confirm project scope and prices with the team."
              : "Quick answers from Growthly’s published website."}
          </p>
          <div className="studio-guide-questions">
            {answers.map((item) => (
              <button
                key={item.question}
                type="button"
                disabled={busy}
                onClick={() => setAnswer(item.answer)}
              >
                {item.question}
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            ))}
          </div>
          {aiEnabled && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!busy) void ask();
              }}
            >
              <label htmlFor="guide-question">Your question</label>
              <input
                id="guide-question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                minLength={3}
                maxLength={600}
                required
              />
              <p className="form-fineprint">
                Your question goes to our AI provider when you ask. Don’t
                include private, account or payment details. This website does
                not save a chat history.
              </p>
              <button
                className="button button--primary button--small"
                disabled={busy}
                type="submit"
              >
                {busy ? "Thinking…" : "Ask AI"}
              </button>
            </form>
          )}
          <p role="status" aria-live="polite" className="studio-guide-answer">
            {answer}
          </p>
          {aiEnabled && answer && (
            <p className="form-fineprint">
              AI answers may be mistaken. Please confirm important details with
              the team.
            </p>
          )}
          <div className="studio-guide-links">
            <Link href="/services" onClick={close}>
              Explore services
            </Link>
            <Link href="/contact" onClick={close}>
              Talk to a person
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
