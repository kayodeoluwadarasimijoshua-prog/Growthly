"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";

export function AdminLoginForm({ initialMessage }: { initialMessage?: string }) {
  const router = useRouter();
  const [error, setError] = useState(initialMessage ?? "");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const values = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.get("email"), password: values.get("password") }),
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
      if (!response.ok || result?.ok !== true) {
        setError(result?.message ?? "Sign-in failed. Check your details and try again.");
        setBusy(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Sign-in is temporarily unavailable. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form className="admin-login__form" onSubmit={submit}>
      {error ? <div className="form-status form-status--error" role="alert">{error}</div> : null}
      <div className="form-field">
        <label htmlFor="admin-email">Email address</label>
        <input id="admin-email" type="email" name="email" autoComplete="username" required maxLength={254} />
      </div>
      <div className="form-field">
        <label htmlFor="admin-password">Password</label>
        <input id="admin-password" type="password" name="password" autoComplete="current-password" required maxLength={1024} />
      </div>
      <button className="button button--primary" type="submit" disabled={busy}>
        {busy ? <><LoaderCircle size={16} aria-hidden="true" /> Signing in…</> : <>Sign in <ArrowRight size={16} aria-hidden="true" /></>}
      </button>
    </form>
  );
}
