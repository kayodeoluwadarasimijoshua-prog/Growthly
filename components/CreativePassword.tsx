"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function CreativePassword() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <form
      method="post"
      action="/api/creative/password"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        if (data.get("password") !== data.get("confirm")) {
          setMessage("The passwords do not match.");
          return;
        }
        setBusy(true);
        setMessage("");
        try {
          const response = await fetch("/api/creative/password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: data.get("password") }),
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.message);
          form.reset();
          router.replace("/creative");
          router.refresh();
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Please retry.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="cms-field">
        <span>New password</span>
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
          disabled={busy}
        />
      </label>
      <label className="cms-field">
        <span>Confirm password</span>
        <input
          type="password"
          name="confirm"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
          disabled={busy}
        />
      </label>
      <button className="button button--primary" disabled={busy} type="submit">
        {busy ? "Saving…" : "Set password & open workspace"}
      </button>
      <p role="status">{message}</p>
    </form>
  );
}
