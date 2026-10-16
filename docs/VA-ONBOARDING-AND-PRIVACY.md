# Growthly — enquiry assistant onboarding and privacy plan

**Prepared: 15 October 2026. For today's role discussion; not a record of activated access.**

## Decisions already made

- The VA means a human virtual assistant who could help with **customer enquiries and follow-ups** in a future, separately approved workflow.
- The person has **no access yet**; no VA account, shared inbox, paid provider or new customer-data store has been provisioned.
- **For now, the owner will receive and handle enquiries/follow-ups**, as confirmed on 15 October 2026. Any later VA workflow remains unapproved and must be discussed separately.
- Current access and WhatsApp-first behavior remain unchanged.
- The website's existing dashboard is **administrator-only and broad-access**. It does not have an implemented assigned-leads-only assistant role. **Do not give the VA an admin account or the owner's login.** New regression tests explicitly deny assistant/support/customer/self-edited admin claims access to that administrator context.

The goal is to reduce risk, not promise zero incidents or legal compliance. A signed confidentiality document is useful but cannot replace access controls, training and supervision. The owner retains responsibility for decisions and access.

## 1. Suggested role for approval

**Title:** Enquiry and Follow-up Assistant.

**Purpose:** help interested customers communicate their needs, keep approved follow-ups organised and escalate decisions to the owner. This is not an AI chatbot or autonomous sales agent.

### May do, after explicit approval

- Acknowledge assigned enquiries using approved wording.
- Ask which Growthly service the person needs and summarise the request.
- Ask relevant questions about the audience, deliverables, preferred timing and budget preference; do not force unnecessary personal details.
- Explain published website starting prices accurately and link the correct service page.
- Record an approved brief summary, stage and next action in the approved workspace.
- Follow up on an existing enquiry within the agreed cadence; stop when asked.
- Arrange a conversation and flag questions the owner needs to answer.

### Must not do without owner approval

- Issue a final quote, discount, refund, contract, confirmed delivery date or scope commitment.
- Promise sales, rankings, campaign outcomes or unlimited revisions/hosting.
- Change prices, bank details, domain/DNS, website code, deployment settings or payment destinations.
- Spend money, run a campaign, publish customer work or enable tracking.
- Access hosting, source control, database service keys, owner email/password manager or payment accounts.
- Export all leads, scrape customer lists, use leads for personal marketing, or hand work/data to another person.
- Paste customer conversations into personal AI tools, translation services or unapproved apps.
- Ask for customer passwords, OTPs, card details, identity documents or unrelated sensitive information.

## 2. Agenda for today's conversation

Agree and write down:

1. Working days, time zone, coverage hours and realistic acknowledgement expectations. Do not put an unapproved response-time promise on the public site.
2. Tasks included, volume limits, compensation, probation/review arrangements and who supervises them.
3. The current decision is owner-received and owner-replied for now. Any later VA triage/access model is **not approved** and needs a separate discussion and explicit owner decision.
4. Approved communication channel and workspace; whether a business-only account is required.
5. Exactly which customers/data they may see, what they may edit and what they must escalate.
6. Approved answers, follow-up cadence and stop-contact handling. Do not send unsolicited bulk follow-ups.
7. Confidentiality, permitted processing, device/security requirements, no-subcontracting rule and an appropriate written agreement. Get suitable legal advice for employment/contract and Nigerian data-protection requirements.
8. Who handles deletion/privacy requests, complaints, suspicious messages and security incidents.
9. Retention/deletion schedule, including messaging, notes, files and backups. **No retention period has been chosen here.**
10. How access is revoked when the engagement ends; check that the owner can do this independently.

## 3. Safest staged implementation

### Stage A — rehearsal without customer data

Start here today. Use fictional enquiries explicitly labelled **SYNTHETIC TRAINING ONLY**. Practice identifying the service, writing an accurate summary, preparing a reply and escalating scope/payment questions. No live account access is needed.

### Stage B — owner-reviewed, minimum-information handoff

If approved after discussion, the owner initially keeps control of incoming messages. Give the VA only an approved summary of a specifically assigned enquiry, not a full inbox or customer export. The VA drafts; the owner checks/sends until capability and permissions are accepted.

**Suggested record, in a company-controlled approved workspace:**

| Field | Rule |
| --- | --- |
| Lead reference | Internal code; do not use phone number as the identifier. |
| Assigned assistant | Individual identity, not a shared team password. |
| Selected service | One of the six configured Growthly services. |
| Approved summary | Goal, audience, required work and next question; remove unrelated personal details. |
| Customer name | Preferred/first name only if needed for the task. |
| Reply channel/contact | Only if the VA is explicitly authorised to communicate; omit in draft-only mode. |
| Stage / next action | New, needs owner input, approved follow-up, closed; do not mark a sale without evidence. |
| Follow-up preference | Agreed time/cadence or do-not-contact instruction. |
| Owner approval needed | Flag pricing, refunds, contracts, deadlines, privacy or security matters. |

Do not put full chat exports, credentials, payment information or unrelated client contacts in this record. Do not paste untrusted messages into executable spreadsheet formulas; use safe plain-text handling in any chosen workspace. Nothing in this template authorises setting up a new provider or uploading real leads.

### Stage C — controlled direct access, only after acceptance

If later needed, choose an approved business communication/workspace tool that actually supports the permissions required. Use individual logins, MFA and access only to assigned customers where the tool supports it. Review pricing, contracts, storage/processing locations, exports, integrations and deletion before approval. Do not claim permissions that the chosen tool cannot enforce.

**WhatsApp caution:** linking a device to an account can expose broad account conversations/history; it is not the same as an assigned-lead permission system. Do not link the owner's personal account just to make onboarding easy. A business-only account is safer for separating personal data, but still does not automatically provide per-lead access. If selected, inspect what the linked user can actually read/send and keep only authorised business conversations there. An official shared-inbox/API arrangement may involve cost, onboarding and wider data processing; it is a separate decision, not activated by the website changes.

**Website/dashboard caution:** the current admin dashboard can expose broad lead information. A real VA portal would need a separate support role, per-lead assignments, field restrictions, owner-only financial/private notes, audit records, no bulk export and server/database authorization—not just a hidden button or a filtered screen. Build/test that only after approving the workflow. No such assistant portal is claimed to exist now.

## 4. Access matrix to approve

| Resource | Owner | VA default | If later approved |
| --- | --- | --- | --- |
| Website administrator / all leads | Full authorised access | **No** | Separate restricted support role required; not current admin. |
| Owner's personal WhatsApp/email | Owner only | **No** | Do not use for routine delegation. |
| Assigned enquiry summaries | Assigns/reviews | **No access yet** | Minimum necessary summaries in controlled workspace. |
| Business replies | Approves commitments | Draft-only during trial | Assigned conversations, approved replies, tested permissions. |
| Final quotes / contracts / refunds | Owner decision | **No authority** | Draft only; owner approves. |
| Hosting, DNS, GitHub, database keys | Owner/approved technical staff | **No** | Not needed for enquiry work. |
| Payment/banking accounts | Owner | **No** | Not needed; never give VA authority to change payment details. |
| Public service/pricing pages | Public | Read | Explain only the published, current offer. |
| Customer media/files | Permission-controlled | **No** | Only assigned, approved materials where needed. |

## 5. Approved reply foundations

These are **draft templates for owner approval**, not messages already sent.

**Initial acknowledgement**

> Hello [preferred name], I’m [assistant name], helping Growthly with enquiries. Thanks for contacting us about [service]. Could you share your main goal, intended audience and the work you need? Please don’t send passwords, verification codes or payment credentials.

**Service clarification**

> Are you looking for the AI video itself, help setting up/running a paid campaign, or both? These have separate scopes, and advertising spend is separate. I’ll pass your requirements to the owner for a written quote.

**Published website prices**

> Website packages currently start at ₦100,000, ₦200,000 and ₦300,000, depending on the agreed scope. The Business Website is the recommended option. The proposal confirms pages, features, timing and separate fees. The first-year .com.ng domain is subject to availability, and domain/hosting renewals are separate after year one.

Do not apply these website prices to design/video/social/promotion/automation. Supporting services require a scoped quote.

**Follow-up**

> Hello [name], following up on your [service] enquiry. Would you like us to clarify anything before the owner prepares the next step? If now isn’t a good time, let us know and we’ll stop follow-ups.

**Escalation**

> That needs the owner's review before we can confirm it. I’ll pass on your question; I won’t promise a price, deadline or outcome on their behalf.

**Privacy request**

> Thank you for letting us know. I’ll refer your request to the business owner. Please don’t send identity documents or account credentials in this chat. We’ll use an appropriate, minimal verification process if needed.

Do not promise a statutory deadline or deletion from every backup/provider unless the owner has confirmed what can be done. Do not claim to be the owner or an automated system if you are a human assistant.

## 6. Security checklist before real access

- Owner approves scope, tools, access matrix and confidentiality/data-handling instructions.
- Individual account; MFA enrolled and tested where available; never share MFA/OTP/recovery codes.
- Owner controls account recovery and can revoke sessions.
- Device has screen lock, supported updates and an appropriate private working environment; no shared/public computer.
- Access and test with synthetic records first. Verify denied access to unassigned records, exports, financial notes and admin actions where those restrictions are required.
- No forwarding into personal email/chat or unapproved AI tools; no local downloads unless explicitly needed and approved.
- Explain how to report an accidental send, loss of device, suspicious link or unexpected access promptly. The VA reports to the owner; the owner determines containment and any appropriate notification/legal advice.
- Review permissions and work at the agreed interval, including after role changes.

## 7. Offboarding

Owner removes tool/device sessions, revokes the individual account/roles and assignment access, transfers unfinished follow-ups, and records handover. Rotate any credentials that were improperly shared. Ask for confirmation of deletion/return of authorised working copies under the agreed policy; confirm actual tool access is revoked rather than relying on a promise. Keep necessary business records under the approved retention rules.

## 8. Owner launch checklist

Still required from the owner:

- Approve the VA workflow after discussion; identify approved tools/access, hours, escalation and response ownership.
- Confirm retention/deletion and contracts before real customer access. A fixed retention period was not inferred.
- Provide genuinely approved AI-video/design examples and permission for any client screenshot; current StarXCO image permission remains pending.
- Confirm the genuine Growthly logo asset/rendition approval.
- Confirm commercial hosting eligibility and sustainable domain/hosting ownership/renewal terms.
- Authorise and perform a real WhatsApp receipt test on the business phone; verify on actual mobile/desktop devices. No real message has been sent by this work.
- Complete live account/RLS/MFA/proxy controls if online delivery is chosen; no provider flags/migrations activated here.
- Start a new coding session for an approved release, then verify the actual public domain/routes/indexing before paid traffic. This closed session cannot publish.

**Bottom line:** rehearse today without data, agree the job, start with minimal supervised assignments if approved, and only add access after permissions are tested. There is no reason to share the owner's full administrator access to accomplish enquiry support.
