# CaseStudySpotlight — Multi-project grid

**Date:** 2026-04-19  
**Status:** Approved  
**Scope:** Add support for displaying multiple case studies in one `CaseStudySpotlight` block as an equal 2-column grid.

---

## Context

Niche landing pages (e.g. `/en/next-js-developer-portugal`) need to surface 2+ case studies within a single content block. The current block supports exactly one project reference. Stacked sections (Option A) were rejected as too tall. A carousel (Option C) was rejected — forces `"use client"`, hides content from users who don't interact. The selected approach (Option E) renders all projects in a 2-column grid: compact on desktop, single-column on mobile.

---

## Schema changes (`sanity/schemas/modules/caseStudySpotlight.ts`)

**Remove:**
- `project` — single `reference` field
- `transformationStatementOverride` — block-level text override
- `businessMetricsOverride` — block-level array override

**Add:**
- `projects` — array of objects, each containing:
  - `project` (required) — reference to `project` document
  - `transformationStatementOverride` (optional) — text, 3 rows
  - `businessMetricsOverride` (optional) — array of `{ value, label, context? }` objects (same structure as current block-level override)
  - `ctaLabel` (optional) — string, defaults to "Read the case study"

**Unchanged:**
- `visible` (visibleField fragment)
- `heading` — eyebrow label, shared across all cards
- `highlightMetrics` — boolean, controls metric display for all cards
- `ctaLabel` at block level is removed; it moves to per-item

**Preview:** Update preview to show count of projects, e.g. `{heading} — 2 projects`.

---

## TypeScript changes (`types/Sanity.d.ts`)

Add a new type:

```ts
export type CaseStudySpotlightItem = {
  _key: string;
  project: {
    title: string;
    slug: string;
    transformationStatement?: string;
    businessMetrics?: { value: string; label: string; context?: string }[];
  };
  transformationStatementOverride?: string;
  businessMetricsOverride?: { value: string; label: string; context?: string }[];
  ctaLabel?: string;
};
```

Update `CaseStudySpotlightBlock`:
- Remove `project`, `transformationStatementOverride`, `businessMetricsOverride`, `ctaLabel` (single)
- Add `projects?: CaseStudySpotlightItem[]`

---

## GROQ projection changes (`lib/sanity/queries.ts`)

Replace the current single-project projection with:

```groq
projects[] {
  _key,
  project -> {
    title,
    "slug": slug.current,
    transformationStatement,
    businessMetrics[] { value, label, context }
  },
  transformationStatementOverride,
  businessMetricsOverride[] { value, label, context },
  ctaLabel
}
```

Remove: `project ->`, `transformationStatementOverride`, `businessMetricsOverride` at block level.

---

## Component changes (`components/modules/CaseStudySpotlight.tsx`)

**Layout:**
- Outer section and warm background unchanged.
- Replace the single card with a grid: `grid grid-cols-1 md:grid-cols-2 gap-4`.
- Map over `block.projects[]` — render one card per item.
- Single project: card spans both columns (`md:col-span-2`) to preserve the current full-width behaviour.
- Each card is identical in structure to the current card: metric → metric sub → eyebrow → title → summary → CTA.

**Per-card logic (same pattern as current block-level logic):**
```ts
const transformationStatement = item.transformationStatementOverride ?? item.project.transformationStatement;
const businessMetrics = item.businessMetricsOverride?.length
  ? item.businessMetricsOverride
  : item.project.businessMetrics;
const ctaLabel = item.ctaLabel ?? "Read the case study";
```

**i18n fix (P1 backlog — include in same implementation):**
The `projectUrl` currently uses a hardcoded `/projects/` segment. Fix using the established pattern from `RelatedProjectsBlock.tsx`:
```ts
const projectUrl = `/${language}/${localizedPath("projects", language)}/${item.project.slug}`;
```

**Tracking:** `TrackCaseStudyClick` wraps each card's CTA individually with its `projectSlug`.

**Guard:** If `block.projects` is empty or undefined, return `null`.

---

## Backwards compatibility

One niche page has data entered against the old single `project` field. That field is being removed. After deploying the schema, re-enter the project reference in Sanity Studio for that page (`/en/next-js-developer-portugal`).

---

## Deployment sequence

1. Update Sanity schema
2. Deploy schema: `env $(cat ../.env.local | grep -v '^#' | xargs) npx sanity schema deploy` (from `sanity/` directory)
3. Update GROQ query
4. Update TypeScript types
5. Update component
6. Re-enter Sanity data for the niche page
7. Verify build passes
8. Mark P1 i18n fix as done in `backlog.md`
