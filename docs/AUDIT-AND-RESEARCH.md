# Growthly audit and design decisions

Date: 13 October 2026. Research happened before substantial implementation.

## Current website and repository audit

**Completed and verified:** fetched `https://growthly.com.ng`, its robots file and sitemap. The current homepage sells a broad mix of digital services, starts with graphic design, uses `/services`, `/work`, `/start-project` and `/privacy`, and publishes graphic-designer portfolio packages. The original website concepts are transparently labelled fictional. Preserve that honesty, the green identity, logo, concept artwork, written-scope process and direct-contact links.

The cloned repository matches this direction: Next.js App Router, TypeScript, reusable React components, custom CSS tokens, Zod validation, optional Supabase/Resend delivery and consent-gated Google analytics. It contains an existing authenticated admin system; preserved rather than replaced or expanded. No new dashboard or CRM was commissioned.

GitHub deployment records report successful Vercel Production and Preview deployments on 10 October 2026. This supports retaining Vercel rather than migrating. The production site responded to an HTTPS content fetch. DNS records, nameservers, current billing plan, mailbox services and provider dashboard permissions were **not verified**. No DNS or production settings were changed.

The public robots file allows public pages and excludes admin/API. The sitemap contains the original routes. Search Console ownership and actual index coverage cannot be inferred from these files.

**Limitations:** live-site research used retrieved page content, not a remote-browser mobile/performance audit. No real lead was submitted to the existing production form. Existing mobile behaviour, live delivery credentials and field Core Web Vitals were not measured. The revised local production build was browser-tested separately.

## Five live agency references reviewed

These are observations from retrieved live content, not independent verification of their promotional claims. No client projects, proprietary images, logos, text or code were copied.

| Reference | Messaging, navigation and positioning | Work and trust | Pricing and enquiry | Decision for Growthly |
|---|---|---|---|---|
| [CKDIGITAL](https://ckdigital.com/) | Direct website-design positioning, separate corporate and e-commerce service paths | Project-led case studies with descriptions of purpose | Consultation CTA; no fixed pricing seen in the inspected homepage extract | Make website development unmistakable; explain each concept’s intended customer journey. Do not borrow their client logos, experience claims or testimonials. |
| [DPX](https://dpx.com.ng/) | Service-led hero, dedicated service links and project browsing | Descriptive featured projects and multiple proof sections | Package tiers, scope by pages and features, request-quote and estimator paths | Give customers a choice of website solutions with clear next steps. Avoid an instant estimator until Growthly approves real pricing rules. |
| [DIGITO WEBS pricing](https://digitowebs.com/website-design-pricing/) | Explicit business-size framing and a dedicated comparison page | Features rather than portfolio proof dominate the inspected pricing page | Published tiers, page counts, review sessions, domain/hosting inclusions, add-ons and quote FAQs | Separate inclusions, exclusions and recurring fees. Do not copy competitor prices or assume their inclusions apply to Growthly. Some extracted CTAs pointed to `#`; Growthly links must have real destinations. |
| [Website Designer Nigeria](https://www.websitedesigner.ng/) | Website-first introduction, start-project and view-work actions | Category-specific website previews and live-work links | Direct WhatsApp start-project link; service/pricing routes | Pair an obvious quote CTA with visible website concepts; use WhatsApp as a practical Nigerian contact route. Avoid unverified “best”, traffic and revenue claims. |
| [DientWeb](https://www.dientweb.net/) | Explains business problems before technology; corporate, commerce and application categories | Case studies describe business use cases and scope | Discovery-session and project CTAs; staged process | Describe what each website enables, and agree integrations before quoting. Do not add application complexity to a simple business-sales site. |

**Mobile, speed and accessibility of references:** retrieved content exposes hierarchy, links and contact pathways, but does not establish visual responsiveness, keyboard quality or load speed. No competitor Lighthouse scores were measured or claimed.

Comparable pricing spans differently scoped products and includes different recurring services; it is not a defensible basis for Growthly’s final prices. All Growthly website packages therefore use **Request a quote**.

## Technical references consulted

- [Next.js deployment](https://nextjs.org/docs/app/getting-started/deploying): preserve a server runtime for the enquiry API; do not static-export the full application.
- [Vercel Hobby plan](https://vercel.com/docs/plans/hobby): non-commercial personal use restriction means this commercial business must confirm an eligible plan.
- [Vercel Pro plan](https://vercel.com/docs/plans/pro-plan): listed $20/month platform fee, one deploying seat and $20 usage credit; overages/add-ons/tax may apply. No subscription purchased.
- [Google Search Essentials](https://developers.google.com/search/docs/essentials): crawlable links, useful content and clear headings; eligibility is not a ranking/indexing guarantee.
- [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/): assessed as a privacy-oriented traffic/performance option. Existing consent-gated GA4 was retained for conversion events rather than adding another tracker.

## Original implementation plan and outcome

1. Preserve framework, logo and useful integrations; centralise website solutions and honest pricing.
2. Reposition homepage and navigation around website development, concepts, packages and quote requests.
3. Add full business/e-commerce/service pages and industry, terms and pricing content.
4. Use a confirmed primary WhatsApp number and validate quote data; never fake receipt without delivery.
5. Redirect legacy work/privacy/project routes; keep supporting services useful but secondary.
6. Add explicit production indexing control, canonical metadata and structured data; keep previews noindex.
7. Test production build, public routes, links, mobile menu, form handoff, delivery failure, accessibility and lab performance.
8. Prepare deployment on the existing host without moving the domain or changing email/DNS services.
