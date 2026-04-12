# Cookie Consent Banner — Design Spec

**Date:** 2026-04-12
**Status:** Approved
**Backlog item:** Cookie banner (EU compliance)

---

## Summary

Add an EU-compliant cookie consent banner using `vanilla-cookieconsent`, with CMS-editable content via Sanity, Google Consent Mode v2 integration, and CSS overrides matching the warm editorial design system.

## Requirements

- GDPR/ePrivacy compliant: block GA4 cookies until user consents
- Google Consent Mode v2: all four signals (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`) default to `denied`
- Two-button banner: Accept + Reject with equal visual weight
- Privacy policy link in the banner (CMS-managed)
- Bilingual PT/EN via Sanity CMS
- Footer link to reopen cookie preferences (`#cookie-settings` convention)
- WCAG AAA accessible (inherits library's dialog/focus baseline + custom contrast)
- Light + dark mode support

## Architecture

### Data Flow

```
Sanity (cookieBanner doc, per language)
  -> layout.tsx fetches via GROQ
    -> passes CMS content as props to <CookieBanner /> (client component)
      -> CookieBanner calls CookieConsent.run({...}) in useEffect
        -> on accept/reject -> gtag('consent', 'update', {...})
```

### New Files

| File | Purpose |
|------|---------|
| `sanity/schemas/documents/cookieBanner.ts` | Sanity singleton schema |
| `components/consent/CookieBanner.tsx` | Client component wrapping vanilla-cookieconsent |
| `app/globals.css` (additions) | CSS custom property overrides for the library |

### Modified Files

| File | Change |
|------|--------|
| `app/[language]/(routes)/layout.tsx` | Replace `<GoogleAnalytics>` with manual `next/script` tags; add `<CookieBanner>` with CMS data; add cookieBanner query |
| `sanity/schemas/index.ts` | Register `cookieBanner` schema |
| `sanity/sanity.config.ts` | Add `"cookieBanner"` to `documentInternationalization` `schemaTypes` array (line 26) |
| `sanity/structure/index.ts` | Add `cookieBanner` singleton entry to desk structure (alongside Footer, Navigation, Settings) |
| `lib/sanity/queries.ts` | Add `getCookieBanner()` query function |
| `types/Sanity.d.ts` | Add `CookieBanner` type |
| `components/layout/Footer.tsx` | Client-side click handler for `#cookie-settings` links |

### Unchanged

| File | Why |
|------|-----|
| `lib/analytics.ts` | `sendGAEvent` pushes to `window.dataLayer` — works with manual gtag setup |
| `<Analytics />` / `<SpeedInsights />` | Vercel Analytics is cookie-free, unaffected by consent |
| `@next/third-parties` package | Stays installed — `sendGAEvent` import still used |

## Sanity Schema: `cookieBanner`

Singleton document, one per language (same pattern as `footer`).

| Field | Type | Description | Example (EN) |
|-------|------|-------------|-------------|
| `title` | `string` | Banner heading | "We use cookies" |
| `description` | `string` | Banner body text | "This site uses cookies for analytics to help us improve your experience." |
| `acceptLabel` | `string` | Accept button text | "Accept" |
| `rejectLabel` | `string` | Reject button text | "Reject" |
| `privacyPolicyLink` | `link` | Link to privacy policy page | `{ label: "Privacy Policy", href: "/en/privacy-policy" }` |
| `language` | `string` | i18n field | `"en"` / `"pt"` |

Internationalization plugin applied (same as footer, homepage, etc.).

## Analytics Replacement

Remove from `layout.tsx` line 250:
```tsx
{gaId && <GoogleAnalytics gaId={gaId} />}
```

Replace with two `next/script` tags:

**Script 1 — Consent Default** (`strategy="beforeInteractive"`):
- Inline script that initializes `window.dataLayer`, defines `gtag()`, sets all four consent signals to `denied` with `wait_for_update: 500`, then calls `gtag('js')` and `gtag('config')`.
- The `gaId` is injected from `process.env.NEXT_PUBLIC_GA4_ID` (server-side environment variable, not user input — safe for inline scripts).

**Script 2 — gtag.js loader** (`strategy="afterInteractive"`):
- External script loading `https://www.googletagmanager.com/gtag/js?id={gaId}`

Key ordering: consent default fires `beforeInteractive` (before hydration), gtag.js loads `afterInteractive`. The `wait_for_update: 500` gives the CookieBanner time to read stored consent on return visits.

## CookieBanner Component

`components/consent/CookieBanner.tsx` — `"use client"`

### Props
```ts
interface CookieBannerProps {
  title: string
  description: string
  acceptLabel: string
  rejectLabel: string
  privacyPolicyLink: { label: string; href: string }
  language: "pt" | "en"
}
```

### Initialization
In a `useEffect`, calls `CookieConsent.run()` with:

- **guiOptions**: `layout: 'cloud inline'`, `position: 'bottom center'`, `equalWeightButtons: true`
- **categories**: `necessary` (enabled, readOnly) + `analytics` (with `autoClear` for `_ga*`, `_gid`)
- **language.translations**: populated from CMS props
- **onFirstConsent / onChange**: call `updateGtagConsent()` which maps category acceptance to `gtag('consent', 'update', {...})`

### Consent Update Function
```ts
function updateGtagConsent() {
  const analyticsAccepted = CookieConsent.acceptedCategory('analytics')
  window.gtag('consent', 'update', {
    analytics_storage: analyticsAccepted ? 'granted' : 'denied',
    ad_storage: 'denied',        // no ad cookies on this site
    ad_user_data: 'denied',      // no ad cookies on this site
    ad_personalization: 'denied', // no ad cookies on this site
  })
}
```

Note: `ad_storage`, `ad_user_data`, `ad_personalization` stay permanently `denied` since this site has no advertising. Only `analytics_storage` toggles based on user choice.

### onConsent callback
Fires on every page load for returning users who already chose. This ensures `gtag('consent', 'update')` fires within the `wait_for_update: 500` window on return visits.

## CSS Overrides

Override vanilla-cookieconsent CSS custom properties in `app/globals.css` to match the design system:

- **Colors**: terracotta brand for accept button, muted foreground for reject, warm sand surface for banner background
- **Typography**: `var(--font-heading)` for title, `var(--font-sans)` for body
- **Border radius**: `var(--radius-lg)`
- **Shadows**: `var(--shadow-lg)` warm-tinted
- **Dark mode**: `.dark` selector overrides
- **Button weight**: both buttons same size/prominence (enforced by `equalWeightButtons: true` + CSS)
- **Z-index**: `z-40` — below header (`z-50`) but above content

## Footer Integration

The footer `legalLinks` array already renders CMS-managed links. The user adds a "Cookie Settings" entry in Sanity Studio as an **internal** link (type: `internal`) pointing to the homepage, with `params: "#cookie-settings"`. The `resolveLink()` utility produces `/{locale}#cookie-settings` — the fragment is what matters, not the path.

**Note:** The `link` schema's `external` field validates against `http/https/mailto/tel` schemes, so a fragment-only URL like `#cookie-settings` may fail validation there. Using the `internal` type with `params` avoids this issue entirely since `params` is an unvalidated string field.

In `Footer.tsx`, add a client-side click handler: if a resolved link href contains `#cookie-settings`, call `event.preventDefault()` and `CookieConsent.show(true)` to reopen the banner.

Implementation approach: a small `CookieSettingsLink` client component wrapper that only wraps links containing `#cookie-settings` in the href, keeping the rest of the footer as a server component.

## Sanity Seed Data

Create both language documents with `translation.metadata` linking them (per project convention).

**EN:**
- title: "We use cookies"
- description: "This site uses cookies for analytics to help us understand how visitors interact with it. You can accept or reject non-essential cookies."
- acceptLabel: "Accept"
- rejectLabel: "Reject"
- privacyPolicyLink: link to `/en/privacy-policy`

**PT:**
- title: "Utilizamos cookies"
- description: "Este site utiliza cookies de analítica para nos ajudar a compreender como os visitantes interagem com ele. Pode aceitar ou rejeitar cookies não essenciais."
- acceptLabel: "Aceitar"
- rejectLabel: "Rejeitar"
- privacyPolicyLink: link to `/pt/politica-de-privacidade`

## Scope

### In scope
- `vanilla-cookieconsent` installation and initialization
- Sanity `cookieBanner` singleton schema (PT + EN)
- `CookieBanner` client component with CMS-driven content
- Replace `<GoogleAnalytics>` with manual `next/script` + Consent Mode v2
- CSS overrides for the library (light + dark mode)
- Footer `#cookie-settings` click handler
- Seed both language documents in Sanity

### Out of scope
- Privacy policy page content (already exists and is live)
- Vercel Analytics changes (cookie-free, no consent needed)
- Granular category preferences modal (only one category — analytics)
- Cookie table page (privacy policy covers this)
- Changes to existing `sendGAEvent` tracking functions in `lib/analytics.ts`

### Bundle impact
~12-15 kB gzipped (vanilla-cookieconsent JS + CSS)
