# Current Growthly release request

The owner has authorized completing the Supabase setup, adding the supplied StarXCO screenshot and deploying through Vercel to `https://growthly.com.ng`. Both provider projects are named **GROWTHLY**. This authorization supersedes historical statements that deployment needs another owner approval. No release has been performed by this work.

## Access evidence

- The workspace is accessible again. The implementation is on `improvement/growthly-conversion`.
- Supabase and Vercel were explicitly tagged, but neither has callable tools in the current session. No Supabase/Vercel runtime bindings or Vercel CLI login were available in the checks performed. Project names do not provide authentication.
- The approved StarXCO screenshot is visible in the conversation, but no original image file or downloadable identifier is available to the workspace. The old manifest is a pending placeholder; do not promote it without real image bytes.
- The environment draft preserves the sixteen existing website destinations and adds `api.vercel.com`, `vercel.com`, `api.supabase.com` and `mcp.supabase.com`. This is saved configuration only; the running network still has no custom destinations. Add the actual Supabase project hostname and deployment hostname once known.

## Resume the authorized release

1. Discover the provider tools. Select the existing **GROWTHLY** projects and verify that Vercel is associated with this repository and `growthly.com.ng`. Obtain project IDs from the providers. Record the existing production deployment for rollback.
2. Inspect Supabase migrations, schema, Auth, RLS and Storage before applying changes. Follow [Content Management](CONTENT-MANAGEMENT.md) and apply only missing migrations. Team profiles use the existing JSON document and need no extra migration.
3. Identify the actual owner's Auth account before granting its server-verified admin role. Do not infer an account from a public team name or grant every member admin access. Configure secrets through supported secure provider settings; never copy keys into chat, source or reports.
4. Obtain the original screenshot file, run the import command below and inspect the homepage, portfolio and project page. The static manifest and CMS publication are separate: when CMS is enabled, upload the screenshot into private project media and include it in the reviewed StarXCO publication too.
5. Prepare a Vercel preview with public CMS off. Verify real owner login, private drafts, saving, upload, publication and unauthorized access with synthetic content. Publish valid reviewed content before enabling CMS at build and runtime. Keep online inquiry collection and analytics disabled; neither was requested for this release.
6. Run checks appropriate to the final changes, including production build, affected browser tests and launch configuration checks. Use the production canonical origin, review mode off and indexing enabled for the production build only. Previews remain noindex. Earlier [Implementation Results](IMPLEMENTATION-RESULTS.md) describe local tests, not live provider readiness.
7. Deploy through the existing Vercel project under the standing authorization. Verify the actual domain, HTTPS, redirects, content, screenshot, editor, robots, sitemap and canonical tags. Retain existing domain bindings and mail records. Record the real deployment URL, commit and verification results after success.

## Screenshot import

Replace the input path with the genuine supplied file. The pending manifest requires explicit replacement:

```sh
npm run prepare:starxco-image -- /absolute/path/to/starxco.png \
  --kind screenshot \
  --alt "StarXCO homepage showing its navigation, commercial facilitation headline and container-terminal hero image." \
  --credit "Homepage screenshot supplied by Growthly owner; publication permission confirmed." \
  --permission-confirmed --replace
```

This validates and converts the actual image to WebP, strips metadata and updates the approved asset and manifest. Do not generate a replacement screenshot. Update assertions about the old absent-image state only after the genuine asset exists, retaining permission-boundary tests.

See [Owner Editor Quickstart](OWNER-EDITOR-QUICKSTART.md) for daily editing after activation.
