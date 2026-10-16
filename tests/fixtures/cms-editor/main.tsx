/** Deliberately separate from Next's app tree; never a deployed owner-login bypass. */
import { createRoot } from "react-dom/client";
import { AdminContentManager } from "@/components/AdminContentManager";
import "@/app/globals.css";
const initial = await fetch("/__cms_test/state").then((r) => r.json());
createRoot(document.getElementById("root")!).render(
  <>
    <aside role="note">
      Component test fixture: synthetic owner and mocked backend. Not a real
      signed-in account.
    </aside>
    <AdminContentManager
      initial={initial}
      userEmail="synthetic-owner@example.invalid"
    />
  </>,
);
