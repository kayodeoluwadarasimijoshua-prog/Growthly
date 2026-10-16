import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/supabase/admin";
import { hasSupabaseConfig } from "@/lib/supabase/server";
import { readEditorState } from "@/lib/cms/admin";
import { AdminContentManager } from "@/components/AdminContentManager";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Private website content",
  robots: { index: false, follow: false, noarchive: true },
};
export default async function ContentPage() {
  if (!hasSupabaseConfig())
    return (
      <section className="container admin-login">
        <div className="admin-login__card">
          <span className="eyebrow">Owner content workspace</span>
          <h1>Website content needs one-time setup.</h1>
          <p>
            Manage projects and images, contact numbers, website starting
            prices, page introductions and FAQs here after Supabase
            authentication, private content tables and storage are configured.
          </p>
          <p>
            No content is saved to this browser as a substitute for a database.
            Existing public content remains unchanged while CMS is disabled.
          </p>
          <p>
            Follow <code>docs/CONTENT-MANAGEMENT.md</code> to configure the
            owner account and migrations. Never give the VA your administrator
            role or service key.
          </p>
          <Link className="text-link mt-24" href="/admin/login">
            Administrator sign in
          </Link>
          <Link className="text-link mt-24" href="/admin">
            Back to admin
          </Link>
        </div>
      </section>
    );
  const auth = await getAdminContext();
  if (auth.reason === "unauthenticated") redirect("/admin/login");
  if (!auth.ok)
    return (
      <section className="container admin-login">
        <div className="admin-login__card">
          <h1>Administrator access required.</h1>
          <p>
            This account cannot edit public website content. Assistant/support
            roles are not granted this access.
          </p>
          <Link className="text-link" href="/admin/login">
            Return to sign in
          </Link>
        </div>
      </section>
    );
  let state;
  try {
    state = await readEditorState(auth.supabase);
  } catch {
    return (
      <section className="container admin-login">
        <div className="admin-login__card">
          <h1>Content storage is not ready.</h1>
          <p>
            Apply the content migration and verify owner access. Nothing has
            been changed or published by opening this page.
          </p>
          <Link className="text-link" href="/admin/content">
            Try again
          </Link>
        </div>
      </section>
    );
  }
  return (
    <AdminContentManager
      initial={state}
      userEmail={auth.user.email ?? "Authorised administrator"}
    />
  );
}
