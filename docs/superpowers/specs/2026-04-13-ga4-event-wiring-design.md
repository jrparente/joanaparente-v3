# GA4 Event Wiring — Design Spec

Wire up 5 unused GA4 tracking events already defined in `lib/analytics.ts` to their corresponding UI components.

## Context

The codebase has 5 tracking functions that are defined but never called. The established pattern uses thin client wrapper components (`"use client"` with `<span onClick>`) that can be imported into server components — matching existing `TrackCtaClick`, `TrackEmailClick`, etc.

GA4 Enhanced Measurement already tracks generic outbound clicks via a built-in `click` event. Custom `external_link_click` events are only added where business context (`link_type`) provides value beyond what Enhanced Measurement captures.

## New Files

### `components/analytics/TrackExternalLink.tsx`

Client wrapper. Props: `destinationUrl: string`, `linkType: string`, `children: React.ReactNode`, `className?: string`. Calls `trackExternalLinkClick(destinationUrl, linkType)` on click via `<span onClick>`.

### `components/analytics/TrackServiceTierClick.tsx`

Client wrapper. Props: `tierName: string`, `pagePath: string`, `children: React.ReactNode`, `className?: string`. Calls `trackServiceTierClick(tierName, pagePath)` on click via `<span onClick>`.

### `components/analytics/TrackCaseStudyClick.tsx`

Client wrapper. Props: `projectSlug: string`, `children: React.ReactNode`, `className?: string`. Calls `trackCaseStudySpotlightClick(projectSlug, window.location.pathname)` on click via `<span onClick>`. The `sourcePage` is derived from `window.location.pathname` inside the click handler — no prop needed since this is a content block that can appear on any page.

## Modified Files

### `components/modules/FaqAccordion.tsx`

Already a client component. Add `trackFaqExpand(item.question, window.location.pathname)` inside the `toggle()` function, only when opening (when `prev !== index`).

### `components/forms/EmailCapture.tsx`

Already a client component. Render `<TrackLeadMagnetView magnetId={magnetId} pageLanguage={lang} />` inside the component return to track lead magnet impressions. The `TrackLeadMagnetView` component already exists at `components/analytics/TrackLeadMagnetView.tsx` but is not used anywhere.

### `app/[language]/(routes)/projects/[slug]/page.tsx`

Server component. Wrap the "Visit site" hero button `<a>` with `<TrackExternalLink destinationUrl={project.liveUrl} linkType="project_visit_site">`.

### `components/modules/ContactSection.tsx`

Server component. Wrap the LinkedIn `<a>` with `<TrackExternalLink destinationUrl={linkedinUrl} linkType="linkedin">`.

### `components/modules/ServiceTiers.tsx`

Server component. Wrap each tier CTA `<Link>` with `<TrackServiceTierClick tierName={tier.name} pagePath={href}>`.

### `components/modules/CaseStudySpotlight.tsx`

Server component. Wrap the "Read case study" `<Link>` with `<TrackCaseStudyClick projectSlug={project.slug}>`.

## Not Touched

- `lib/analytics.ts` — all functions already defined, no changes needed
- BioPage, ConnectStrip, CaseStudyScreenshot — generic outbound links already covered by Enhanced Measurement's built-in `click` event
- No dead code removal — unused functions (`trackLeadMagnetComplete`) may be needed later

## Validation

- Confirmed pattern matches existing `TrackCtaClick` / `TrackEmailClick` usage in codebase
- Confirmed `sendGAEvent` requires `"use client"` per Next.js docs (`@next/third-parties/google`)
- Confirmed only primitive string props cross the RSC boundary per Vercel `server-serialization` rule
- Confirmed GA4 Enhanced Measurement handles generic outbound clicks, avoiding duplicate tracking

## Total Changes

- 3 new files (~20 lines each)
- 5 modified files (small additions)
- 0 deleted files
