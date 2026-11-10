import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getStudioContext } from "@/lib/supabase/studio";
import { CreativePassword } from "@/components/CreativePassword";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Set your creative workspace password",
  robots: { index: false, follow: false },
};
export default async function PasswordPage() {
  const auth = await getStudioContext();
  if (!auth.ok || auth.role !== "creative_editor") redirect("/admin/login");
  return (
    <section className="container admin-login">
      <div className="admin-login__card">
        <h1>Set your website password.</h1>
        <p>
          This account is for graphic-design and AI-advert drafts. It does not
          grant owner, enquiry or Supabase dashboard access.
        </p>
        <CreativePassword />
      </div>
    </section>
  );
}
