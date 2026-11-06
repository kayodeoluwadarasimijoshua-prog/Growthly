# Add the AutoVault demonstration to Growthly

AutoVault Motors is the owner's self-initiated dealership website demo, not a paid client or a trading dealership. Its repository is `kayodeoluwadarasimijoshua-prog/AutoVault-Motors`. The repository's public demo link is `https://autovault-motors-nu.vercel.app/`; verify its deployed version before publishing the case study. Local refinements are on `improvement/portfolio-demo` in that repository.

## What this Growthly change provides

- An **Add AutoVault demo draft** button in the existing Projects editor. It inserts accurate prepared copy into the current draft without replacing StarXCO, settings, team data or a publication. It prevents duplicate templates and respects the project limit.
- A genuine 1440×900 screenshot of the refined local demo at `/images/demos/autovault-motors.webp`. The page includes a disclosure that the vehicles are samples and its vehicle imagery is AI-generated. The screenshot is a real browser capture, not a generated screenshot.
- A demonstration category, factual scope and limitations, and no fabricated client results. It does not replace the genuine client project featured on Home.

## Publish through the existing owner editor

1. Deploy the Growthly branch containing this editor addition through the existing project. This document does not establish deployment success or enable the CMS itself.
2. Sign in at `/admin/content` and open **Projects**. Click **Add AutoVault demo draft** once. Existing content stays in the draft.
3. Review the prepared text and public demo link. Confirm that the AutoVault refinement has reached its hosted demo before publishing a screenshot that describes it.
4. Open the supplied screenshot link in the editor and download the WebP. Upload it into the project's image field. The CMS deliberately stores its own private copy; a static URL is not an approved media-registry entry.
5. Suggested alt text: **AutoVault Motors demo homepage with its sample-inventory notice, vehicle browsing action and illustrated saloon-car hero.** Suggested credit: **Browser screenshot of Growthly's AutoVault Motors demonstration; underlying vehicle artwork is AI-generated.** Review and confirm image publication rights.
6. Confirm the project information permission and select **Include on publication**. Keep **Self-initiated demonstration — not client work** selected. Review the rest of the draft, then **Publish changes**.
7. With public CMS enabled, check `/portfolio`, `/portfolio/autovault-motors` and the website-development service page. Verify the **Demonstration** label, image, actual hosted demo link and enquiry action. If the editor says the public CMS switch is off, follow [Owner Editor Quickstart](OWNER-EDITOR-QUICKSTART.md); initial CMS activation still needs a fresh build.

The implementation does not silently change an existing stored publication. Provider tools were unavailable in this session, so no live Supabase write or production promotion is claimed.

## Validation

Growthly: lint, typecheck, **299 unit/integration tests**, production build and **four targeted CMS browser checks** passed. The new browser case checks the template stays private, preserves StarXCO and cannot be added twice. The other three check editor accessibility and overflow at phone, tablet and desktop widths. The screenshot endpoint returned HTTP 200 with valid WebP bytes. Mock CMS checks are not live Supabase acceptance.

AutoVault: lint, typecheck, **119 unit/interaction tests** and production build passed. Browser inspection exercised six routes at four widths, brand filtering, persistent two-vehicle comparison, gallery navigation, labelled demo enquiries, no-JavaScript form protection and an unknown vehicle's HTTP 404. See the AutoVault repository's refinement report for final accessibility results and limitations.
