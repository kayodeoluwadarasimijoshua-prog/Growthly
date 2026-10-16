/** Explicit, isolated QA server. Not loaded by Next and never used as production persistence. */
import { createServer } from "vite";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
const root = fileURLToPath(new URL("../", import.meta.url));
let state;
let defaultDocument;
let schema;
let failProvider = false;
let conflict = false;
let history = [];
const uploaded = new Map();
const image = Buffer.from(
  "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEAAUAmJaQAA3AA/v89WAAAAA==",
  "base64",
);
const send = (res, status, data) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
};
const fixture = () => ({
  name: "explicit-cms-test-fixture",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (
        !req.url?.startsWith("/__cms_test/") &&
        !req.url?.startsWith("/api/admin/content") &&
        !req.url?.startsWith("/rest/v1/") &&
        !req.url?.startsWith("/storage/v1/")
      )
        return next();
      try {
        if (!defaultDocument) {
          ({ defaultCmsDocument: defaultDocument } = await server.ssrLoadModule(
            "/lib/cms/defaults.ts",
          ));
          schema = await server.ssrLoadModule("/lib/cms/schema.ts");
        }
        state ??= {
          revision: 0,
          draft: defaultDocument(),
          published: null,
          publishedAt: null,
          publicEnabled: true,
          history: [],
        };
        let body = "";
        if (req.method === "POST") for await (const chunk of req) body += chunk;
        const data = body ? JSON.parse(body) : {};
        const pathname = new URL(req.url, "http://test.invalid").pathname;
        if (pathname === "/__cms_test/reset") {
          ({ defaultCmsDocument: defaultDocument } = await server.ssrLoadModule(
            "/lib/cms/defaults.ts",
          ));
          state = {
            revision: 0,
            draft: data.document ?? defaultDocument(),
            published: data.published ?? null,
            publishedAt: null,
            publicEnabled: true,
            history: [],
          };
          history = [];
          conflict = false;
          failProvider = false;
          uploaded.clear();
          return send(res, 200, { ok: true });
        }
        if (pathname === "/__cms_test/state") return send(res, 200, state);
        if (pathname === "/__cms_test/control") {
          if (data.document) state.published = data.document;
          if ("failProvider" in data) failProvider = data.failProvider;
          if ("conflict" in data) conflict = data.conflict;
          return send(res, 200, { ok: true });
        }
        if (pathname === "/rest/v1/growthly_site_content")
          return failProvider
            ? send(res, 503, { message: "Synthetic provider outage" })
            : send(res, 200, { published: state.published });
        if (pathname === "/rest/v1/growthly_content_media") {
          const value = new URL(req.url, "http://test.invalid").searchParams
            .get("id")
            ?.replace("eq.", "");
          return send(res, 200, { storage_path: `${value}.webp` });
        }
        if (pathname.startsWith("/storage/v1/object/")) {
          res.writeHead(200, { "Content-Type": "image/webp" });
          return res.end(image);
        }
        if (pathname.startsWith("/api/admin/content/media/")) {
          res.writeHead(200, { "Content-Type": "image/webp" });
          return res.end(image);
        }
        if (pathname === "/api/admin/content/media") {
          const assetId = randomUUID();
          uploaded.set(assetId, true);
          return send(res, 200, {
            assetId,
            width: 1,
            height: 1,
            previewUrl: `/api/admin/content/media/${assetId}`,
          });
        }
        if (pathname === "/api/admin/content" && req.method === "GET")
          return send(res, 200, state);
        if (pathname === "/api/admin/content" && req.method === "POST") {
          if (conflict || data.expectedRevision !== state.revision)
            return send(res, 409, {
              message:
                "Another tab saved a newer revision. Reload before editing again.",
            });
          let document;
          if (data.action === "restore") {
            const found = history.find(
              (h) => h.revision === data.restoreRevision,
            );
            if (!found)
              return send(res, 404, { message: "Revision not found." });
            document = structuredClone(found.document);
            for (const p of document.projects) {
              p.publicationConfirmed = false;
              if (p.image) p.image.permissionConfirmed = false;
            }
          } else {
            const parsed = schema.cmsDocumentSchema.safeParse(data.document);
            if (!parsed.success)
              return send(res, 400, {
                message: "Invalid content",
                issues: parsed.error.issues.map((i) => i.message),
              });
            document = parsed.data;
          }
          const published = data.action === "publish";
          if (published) {
            const issues = schema.publicationIssues(document, state.published);
            if (issues.length)
              return send(res, 400, {
                message: "Review before publishing.",
                issues,
              });
            const baseline =
              state.published?.settings.prices ??
              defaultDocument().settings.prices;
            if (
              JSON.stringify(baseline) !==
                JSON.stringify(document.settings.prices) &&
              !data.confirmPricing
            )
              return send(res, 400, {
                message: "Confirm pricing before publishing.",
              });
          }
          state.revision++;
          state.draft = structuredClone(document);
          if (published) {
            state.published = structuredClone(document);
            state.publishedAt = new Date().toISOString();
          }
          const entry = {
            revision: state.revision,
            published,
            created_at: new Date().toISOString(),
          };
          history.unshift({ ...entry, document: structuredClone(document) });
          state.history = history.map(
            ({ revision, published, created_at }) => ({
              revision,
              published,
              created_at,
            }),
          );
          return send(res, 200, {
            revision: state.revision,
            message: published
              ? "Published. New public page requests use this revision."
              : data.action === "restore"
                ? "Revision restored as a draft. Nothing was published."
                : "Draft saved. Public content has not changed.",
          });
        }
        return send(res, 404, { message: "Test endpoint not found" });
      } catch (error) {
        console.error(error);
        return send(res, 500, { message: "Test fixture error" });
      }
    });
  },
});
const server = await createServer({
  root,
  configFile: false,
  plugins: [fixture()],
  resolve: { alias: { "@": root } },
  server: {
    host: "0.0.0.0",
    port: 3001,
    strictPort: true,
    allowedHosts: [".e2b.app", ".arena.ai", "localhost"],
  },
});
await server.listen();
console.log(
  "QA ONLY: mocked CMS fixture at port 3001 /tests/fixtures/cms-editor/index.html",
);
