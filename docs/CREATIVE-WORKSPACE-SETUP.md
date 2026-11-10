# Owner and creative-editor setup

The implementation separates the existing owner account from a restricted `creative_editor` role. Account emails are supplied privately by the owner and are not hardcoded into public content or used as authorization shortcuts.

## Access boundaries

| Capability | Owner (`admin`) | Friend (`creative_editor`) |
| --- | --- | --- |
| Website content, prices, team, contacts, history | Existing full access | No access |
| Customer enquiry records | Existing owner access | No access |
| Graphic-design and AI-advert drafts | Review submissions and import copies into the CMS | Create/edit own drafts; submit for review |
| Website, paid-ad or unrelated project drafts in the creative queue | Use the existing owner CMS | Rejected by creative API/database constraints |
| Media | Existing owner controls | Upload/read own private images; cannot read other users’ images or delete published assets |
| Publish to the portfolio | Owner review and existing publication flow | No publication capability |
| Invite users or grant roles | Owner-only invitation endpoint | No access |

The friend needs a **website Auth login**, not a Supabase dashboard account. Adding someone to the public Team section does not grant any access.

## One-time database preparation

1. Preserve the real existing Growthly project and inspect migration state. Back up the content before schema work.
2. Confirm the existing inquiry/admin helper, content and private Storage migrations have already been applied. Apply only missing prerequisites in their documented order; do not rerun policies blindly.
3. Apply `supabase/migrations/202611100001_creative_workspace.sql` once. This adds a separate private draft queue, revision-checked save function and author-scoped media policies. It does not modify the published CMS snapshot, create users, assign roles or activate AI.
4. Verify the actual owner's Auth identity and existing server-controlled `app_metadata.role = admin`. Editable `user_metadata` and knowing an email address do not confer permissions.
5. Keep the friend role exactly `creative_editor`. Never grant `admin` just to make a draft upload work.

## Invitation and password flow

1. Deploy the application containing the new routes, with invites still disabled.
2. In Supabase Auth URL configuration, set the actual site origin to `https://growthly.com.ng` and allow the intended invitation redirect `https://growthly.com.ng/creative/password`. Use the correct environment values if explicitly testing a separate preview.
3. Configure the **Invite user** email template to link to the app’s server confirmation route:

   `<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite">Accept your Growthly invitation</a>`

   The route verifies the one-time invite hash, establishes the existing secure session cookies and redirects without retaining the token in the destination URL. It does not accept an arbitrary `next` destination. The normal public application must be reachable at the configured origin.
4. Confirm the host has the existing Supabase public settings and server-only service-role key. Configure sender/delivery settings in Supabase as needed. Never put a key or password in chat, Git or a public browser variable.
5. Enable **Production-only** `CREATIVE_INVITES_ENABLED=true` after the migration and template are verified. This is separate from CMS and AI flags.
6. Sign in as the owner at `/admin/content`, open **Creative submissions**, expand **Invite a graphic-design / AI-advert editor**, enter the friend’s confirmed email and click **Send creative-editor invitation**.
7. The server verifies owner access, checks workspace storage, invites a new identity and assigns only `creative_editor`. It refuses to invite the current owner email or accept a role supplied by the browser. Existing registered accounts require a deliberate role review in Supabase; the endpoint does not silently downgrade/reassign them. If the email is created but role assignment fails, inspect the account before retrying.
8. The friend opens the email, verifies the invitation and sets a password of 12–128 characters. Later sign-ins at `/admin/login` route that role to `/creative`; owners retain their existing admin destination. Provider acceptance does not guarantee inbox delivery.

No real invitation was sent during development, and no real account/role was created or changed from the cloud workspace.

## Normal creative workflow

1. The friend opens `/creative`, adds a project and selects **AI video adverts** or **Graphic design**.
2. Enter factual notes, a short summary, actual deliverables and decisions. Mark self-initiated work as a demonstration rather than client work.
3. Upload a genuine permitted JPEG/PNG/WebP under 2 MB. It is checked, re-encoded to WebP and stored privately under the author's path. Add a useful image description and credit.
4. A video sample uses a public HTTPS link. This change does not add raw video hosting or autoplaying third-party embeds. Check the destination and publication rights first.
5. Save privately or submit for owner review. Submission does not publish anything. Stale saves fail instead of silently overwriting a newer revision.
6. The owner opens **Creative submissions** in the existing content editor and imports a copy into the unsaved CMS draft. An existing project ID or slug is not overwritten. Revisions to previously imported work can be reviewed and copied deliberately into the existing owner project.
7. Review the content, category, type, image and project permissions. Imported publication permissions are cleared. Include the project and use the existing **Publish changes** control only when the whole CMS draft is ready.
8. With CMS enabled, new approved work appears in the matching `/portfolio/services/graphic-design` or `/portfolio/services/ai-video-adverts` gallery. Withdrawals follow the existing publication/media controls.

Uploaded files can become orphaned when a draft is abandoned. Creative editors cannot delete shared/published files. Owner cleanup must check current drafts, publication and history before removing unused media; no automatic retention policy is introduced.

## Optional AI setup

The website guide works without an AI provider: its quick answers come from published website facts. This is labelled as a guide, not a pretend model response.

For generated writing suggestions and customer questions, configure server-only host settings:

- `OPENAI_API_KEY`: an actual API credential, stored securely.
- `OPENAI_MODEL`: the selected model ID supporting Chat Completions, JSON-object output and `max_completion_tokens`.
- `STUDIO_AI_ENABLED=true`: enables authenticated writing suggestions.
- `PUBLIC_AI_ASSISTANT_ENABLED=true`: a separate opt-in for public free-text questions.

Keep these flags false until the real provider connection and intended usage are tested. A ChatGPT subscription does not automatically configure API access or billing. The cloud environment also needs permission to reach `api.openai.com`; its saved settings do not configure Vercel automatically.

Writing suggestions require the editor to submit notes, review the generated text and click **Apply to draft**. They never save, approve rights or publish automatically. The model is instructed to reword only supplied facts; additional numbers and selected unsupported guarantees are rejected, but these checks do not verify every claim. Human fact-checking is still required.

Public AI answers use current approved services, FAQ text and prices, with a team-contact fallback. They do not read private drafts, customer enquiries or account credentials. Users are warned not to submit private details. The app stores no chat history, but provider and hosting retention policies still apply. Model responses can be mistaken and important details must be confirmed with the team.

Both AI endpoints are rate-limited and provider calls are time/size bounded. Limits are per application instance; verify host controls and provider budgets before enabling public paid usage at scale. No real model request, charge or public AI activation was performed during development.

## Acceptance still needed on the real services

Verify the actual owner/friend/anonymous permissions, invite delivery, password setup, private upload and owner publication. Local mock UI tests and isolated PostgreSQL/RLS checks do not establish live Supabase Auth, Storage or mail delivery. Test AI deliberately with synthetic notes/questions after secure configuration. Keep private pages noindex and retain the CMS/online-inquiry/analytics flags as independent choices.
