import React from "react";
import { createRoot } from "react-dom/client";
import { CreativeWorkspace } from "../../../components/CreativeWorkspace";
import { AdminContentManager } from "../../../components/AdminContentManager";
import "../../../app/globals.css";
import "../../../app/studio.css";
const initial = await fetch("/__cms_test/state").then((response) =>
  response.json(),
);
createRoot(document.getElementById("root")!).render(
  new URLSearchParams(location.search).has("owner") ? (
    <AdminContentManager
      initial={initial}
      userEmail="synthetic-owner@example.com"
    />
  ) : (
    <CreativeWorkspace />
  ),
);
