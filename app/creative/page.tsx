import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getStudioContext } from "@/lib/supabase/studio";
import { CreativeWorkspace } from "@/components/CreativeWorkspace";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Private creative workspace",
  robots: { index: false, follow: false, noarchive: true },
};
export default async function CreativePage() {
  const auth = await getStudioContext();
  if (!auth.ok) {
    if (auth.reason === "unauthenticated") redirect("/admin/login");
    return (
      <section className="container admin-login">
        <h1>Creative workspace needs setup.</h1>
        <p>
          An invited website login with the creative-editor role is required.
          This page does not create or grant an account.
        </p>
        <Link className="text-link" href="/admin/login">
          Sign in to your workspace
        </Link>
      </section>
    );
  }
  if (auth.role === "admin") redirect("/admin/content");
  return <CreativeWorkspace />;
}
