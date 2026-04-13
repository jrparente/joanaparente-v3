# OG Metadata Design — joanaparente.com

**Date**: 2026-04-13  
**Status**: Approved  
**Scope**: `opengraph-image.tsx` at layout level + metadata cleanup across all routes

---

## Decision Summary

Implement a code-generated `opengraph-image.tsx` (Next.js `ImageResponse` / Satori) at the `app/[language]/(routes)/` layout segment. This serves as the always-present default OG card for all non-project pages. No CMS image upload ever required for a working OG image.

Project detail pages (`projects/[slug]`) continue using their existing `generateMetadata()` with per-page screenshot images — unaffected.

---

## Approved Card Design — "Tagline-hero / Editorial"

**Anchoring metaphor**: Magazine opener. The positioning statement earns the headline. Name is the footnote — confident inversion of the predictable name-first hierarchy.

**Visual layout** (1200×630):

```
┌─────────────────────────────────────────────┐
│ ── JOANA PARENTE                (eyebrow)   │  ← terracotta rule + name, PJS small-caps
│                                              │
│ Strategist                                   │  ← Fraunces italic, ~112px
│ who codes.                                   │    "codes." in terracotta #C4603A
│                                              │
│ [JP icon]  Web Dev · Algarve  joana…com     │  ← small, muted, PJS
└─────────────────────────────────────────────┘
Background: Warm Sand #F9F6F2
```

**Tokens used**:
| Element | Value |
|---|---|
| Background | `#F9F6F2` (Warm Sand) |
| Headline font | Fraunces, italic, 400, ~112px |
| Headline colour | `#2C2419` (Deep Ink) |
| "codes." accent | `#C4603A` (Terracotta) |
| Eyebrow rule | `#C4603A`, 2px, 56px wide |
| Eyebrow text | Plus Jakarta Sans, 500, ~20px, `#C4603A` |
| Bottom text | Plus Jakarta Sans, 400, ~18px, `#9E8068` |
| JP icon | `public/logo/logo-icon-dark.png`, ~36px |

---

## Sanity Schema Change

Add one field to `sanity/schemas/documents/site.ts` (in the `seo` group):

```ts
defineField({
  name: "ogTagline",
  title: "OG Card Tagline",
  type: "string",
  group: "seo",
  description: "Short phrase on the social sharing card (e.g. 'Strategist who codes.')",
  validation: (Rule) => Rule.max(60),
})
```

Add `ogTagline` to `getSiteSettings` GROQ projection in `lib/sanity/queries.ts`.

**Default fallback** (hardcoded in `opengraph-image.tsx` if CMS field is empty): `"Strategist who codes."`

---

## File: `app/[language]/(routes)/opengraph-image.tsx`

### Exports

```ts
export const alt = 'Joana Parente — Web Developer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 3600  // recheck Sanity once per hour
export async function generateStaticParams() {
  return [{ language: 'pt' }, { language: 'en' }]
}
```

### Runtime behaviour

1. `await params` to get `{ language }`
2. `getSiteSettings(language)` to fetch `site.ogTagline` (with hardcoded fallback)
3. `readFile(join(process.cwd(), 'assets/fonts/Fraunces-Italic.ttf'))` — font from disk
4. `readFile(join(process.cwd(), 'assets/fonts/PlusJakartaSans-Medium.ttf'))` — font from disk
5. `readFile(join(process.cwd(), 'public/logo/logo-icon-dark.png'))` — icon as base64
6. Return `new ImageResponse(...)` with the approved layout

### Font files required

Two static TTF files committed to `assets/fonts/`:
- `Fraunces-Italic.ttf` — italic 400 weight, static (not variable), Latin subset
- `PlusJakartaSans-Medium.ttf` — 500 weight, Latin subset

Source: Google Fonts (open license). Both are under the 500KB Satori bundle limit combined (~300KB estimated).

---

## Metadata changes across routes

### `app/[language]/(routes)/layout.tsx`
- **Remove** `openGraph.images` from `generateMetadata()` — file-based `opengraph-image.tsx` takes priority at the same segment level (confirmed in Next.js docs)
- Keep all other `openGraph` fields (title, description, url, siteName, locale, type)
- The `defaultOgImage` / `defaultTwitterImage` fields on the `site` Sanity schema become unused — leave them in place (no migration needed, harmless)

### `app/[language]/(routes)/[slug]/page.tsx`
- Add `parent: ResolvingMetadata` parameter to `generateMetadata()`
- Inherit `parentImages` from `(await parent).openGraph?.images || []`
- Add `openGraph` block with `images: parentImages` — this inherits the layout-level `opengraph-image.tsx` URL
- Prevents the child's `openGraph` object from replacing the parent's images on shallow merge

### `app/[language]/(routes)/projects/page.tsx`
- Same pattern as `[slug]/page.tsx` above — add `ResolvingMetadata` inheritance

### `app/[language]/(routes)/projects/[slug]/page.tsx`
- Already has explicit `openGraph.images` from `urlFor(featuredScreenshot)`
- Add `parent: ResolvingMetadata` for the fallback case only: when `imageUrl` is `undefined`, use `parentImages` instead of `undefined`
- Change: `images: imageUrl ? [{ url: imageUrl }] : undefined` → `images: imageUrl ? [{ url: imageUrl }] : parentImages`

---

## Fallback chain (final)

```
projects/[slug]   featuredScreenshot or project.image  (explicit, child segment)
                  ↓ if no screenshot
all other pages   opengraph-image.tsx  (ImageResponse, layout segment — always present)
```

No CMS upload ever required. Text ("Strategist who codes.") editable via `site.ogTagline` in Sanity Studio without a deploy.

---

## Out of scope

- Twitter `twitter-image.tsx` — `og:image` is reused by Twitter/X for `summary_large_image` card type (already set in layout). No separate file needed.
- Niche/service page per-page OG overrides — low ROI, can be added later if needed.
- Blog post OG images — no blog in current build.
