import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertCircle, ArrowRight } from "lucide-react";
import { AdminDashboard } from "@/components/AdminDashboard";
import { hasSupabaseConfig } from "@/lib/supabase/server";
import { getAdminContext } from "@/lib/supabase/admin";
import type { LeadRecord } from "@/lib/leads";

export const metadata: Metadata = {
  title: "Private lead dashboard",
  robots: { index: false, follow: false, noarchive: true },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!hasSupabaseConfig()) {
    return (
      <section className="container admin-login">
        <div className="admin-login__card">
          <AlertCircle size={24} color="var(--green-dark)" aria-hidden="true" />
          <h1>Lead management needs setup.</h1>
          <p>Configure Supabase Auth, the private inquiry table and its server-only service key using the deployment guide before managing private lead records.</p>
          <Link className="text-link mt-24" href="/admin/login">Admin setup <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
    );
  }

  const auth = await getAdminContext();
  if (auth.reason === "unauthenticated") redirect("/admin/login");
  if (auth.reason === "forbidden") {
    return (
      <section className="container admin-login">
        <div className="admin-login__card">
          <AlertCircle size={24} color="var(--danger)" aria-hidden="true" />
          <h1>Administrator access required.</h1>
          <p>This signed-in account does not have the GROWTHLY admin role. Use an authorised account to view private inquiries.</p>
          <Link className="text-link mt-24" href="/admin/login">Return to sign in <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
    );
  }
  if (!auth.ok) redirect("/admin/login");

  const { data, error } = await auth.supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) {
    return (
      <section className="container admin-login">
        <div className="admin-login__card">
          <AlertCircle size={24} color="var(--danger)" aria-hidden="true" />
          <h1>Lead records could not be loaded.</h1>
          <p>Check that the database migration has been applied, row-level security is enabled and this account has the admin role.</p>
          <Link className="text-link mt-24" href="/admin">Try again <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
    );
  }

  return <AdminDashboard initialLeads={(data ?? []) as LeadRecord[]} userEmail={auth.user.email ?? "GROWTHLY admin"} />;
}
