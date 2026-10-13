import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Brand } from "@/components/Brand";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { hasSupabaseConfig } from "@/lib/supabase/server";
import { getAdminContext } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false, noarchive: true },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (!hasSupabaseConfig()) {
    return (
      <section className="container admin-login">
        <div className="admin-login__card">
          <Brand />
          <h1>Admin setup required</h1>
          <p>
            The private lead dashboard is not available until Supabase
            authentication, the lead table and server-only keys are configured.
            Follow the setup instructions in <code>README.md</code>.
          </p>
          <p className="form-fineprint" style={{ marginTop: 18 }}>
            Do not add credentials to source files or send them in chat.
          </p>
        </div>
      </section>
    );
  }

  const auth = await getAdminContext();
  if (auth.ok) redirect("/admin");

  const message =
    auth.reason === "forbidden"
      ? "This signed-in account does not have the GROWTHLY administrator role. Sign in with an authorised admin account."
      : undefined;

  return (
    <section className="container admin-login">
      <div className="admin-login__card">
        <Brand />
        <h1>Lead management</h1>
        <p>Sign in with your authorised GROWTHLY administrator account.</p>
        <AdminLoginForm initialMessage={message} />
      </div>
    </section>
  );
}
