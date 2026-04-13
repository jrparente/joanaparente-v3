# Refactor `serviceTiers.ts` proofLink to shared link type

**Date:** 2026-04-13
**Scope:** Schema change + component update + GROQ projection + TypeScript type

## Problem

The `proofLink` field in `serviceTiers.ts` (line 91) uses an inline `{label, href}` object with a plain `url` type. Every other navigation link in the project uses the shared `link` object (`sanity/schemas/objects/link.ts`), which supports both internal references and external URLs.

Proof links point to case studies — internal project pages. With the current schema, editors paste a URL string that can silently break if the project slug changes. The shared `link` type lets them pick a project by reference.

This is the only internal-link field in the schemas that doesn't use the shared `link` type. All other non-`link` URL fields (social links, live site URLs) are intentionally external-only.

## Design

### Schema change (`sanity/schemas/modules/serviceTiers.ts`)

Replace the inline `proofLink` object (lines 91-112):

```ts
// Before
defineField({
  name: "proofLink",
  title: "Proof Link",
  type: "object",
  description: "Case study link shown below features",
  fields: [
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({ name: "href", title: "URL", type: "url", ... }),
  ],
})

// After
defineField({
  name: "proofLink",
  title: "Proof Link",
  type: "link",
  description: "Case study link shown below features",
})
```

Keep the field name `proofLink` — no migration needed for existing documents since editors will re-select the link via the new UI. Keep `proofLabel` as a separate field (unchanged).

### Link object reference types

The shared `link` object currently references `page` and `homepage`. Add `project` to the reference list so editors can pick case study pages directly:

```ts
// sanity/schemas/objects/link.ts — internal field
to: [{ type: "page" }, { type: "homepage" }, { type: "project" }],
```

### GROQ projection (`lib/sanity/queries.ts`)

The `proofLink` field currently has no projection (fetched as raw object). Add the same `linkProjection` used by `ctaLink`:

```groq
proofLink ${linkProjection},
ctaLink ${linkProjection}
```

### TypeScript type (`types/Sanity.d.ts`)

Change the `proofLink` type from inline object to `LinkType`:

```ts
// Before
proofLink?: { label: string; href: string };

// After
proofLink?: LinkType;
```

### Component update (`components/modules/ServiceTiers.tsx`)

Replace the raw `<a href={tier.proofLink.href}>` with `resolveLink()` + Next.js `<Link>`, matching how `ctaLink` is already handled:

```tsx
// Before (lines 131-141)
{tier.proofLink?.label && tier.proofLink?.href && (
  <p ...>
    {tier.proofLabel || "See it in action:"}{" "}
    <a href={tier.proofLink.href} ...>{tier.proofLink.label}</a>
  </p>
)}

// After
{tier.proofLink?.label && (
  <p ...>
    {tier.proofLabel || "See it in action:"}{" "}
    <Link href={resolveLink(tier.proofLink, language)} ...>
      {tier.proofLink.label}
    </Link>
  </p>
)}
```

### Sanity content migration

No automated migration needed. The field name stays `proofLink`. Existing content will show as empty in the new link widget — editors re-select the case study via the reference picker. This is acceptable because there are at most 3-4 tiers with proof links.

## Files touched

1. `sanity/schemas/objects/link.ts` — add `project` to internal reference types
2. `sanity/schemas/modules/serviceTiers.ts` — replace inline object with `type: "link"`
3. `lib/sanity/queries.ts` — add `linkProjection` to `proofLink`
4. `types/Sanity.d.ts` — change `proofLink` type to `LinkType`
5. `components/modules/ServiceTiers.tsx` — use `resolveLink()` + `<Link>`

## Out of scope

- External-only URL fields (social links, live URLs) — intentionally not refactored
- Rich text link annotation — follows standard Portable Text pattern, different concern
- `proofLabel` field — unchanged, keeps the two-part rendering pattern
