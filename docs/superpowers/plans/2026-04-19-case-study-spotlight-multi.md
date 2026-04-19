# CaseStudySpotlight Multi-project Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-project CaseStudySpotlight block with a `projects[]` array that renders as a responsive 2-column grid on desktop, preserving the current single-card behaviour when only one project is listed.

**Architecture:** Four coordinated changes — Sanity schema, GROQ projection, TypeScript types, React component. The P1 i18n bug (hardcoded `/projects/` path segment) is fixed in the component step. No new dependencies; fully server-rendered.

**Tech Stack:** Next.js 15 App Router, Sanity v4, Tailwind CSS v4, TypeScript strict mode

---

## Files

| File | Action |
|------|--------|
| `sanity/schemas/modules/caseStudySpotlight.ts` | Modify — replace single `project` field with `projects[]` array |
| `lib/sanity/queries.ts` | Modify — update GROQ projection |
| `types/Sanity.d.ts` | Modify — add `CaseStudySpotlightItem` type, update `CaseStudySpotlightBlock` |
| `components/modules/CaseStudySpotlight.tsx` | Modify — render grid, fix i18n path |
| `backlog.md` | Modify — mark P1 i18n fix as done |

---

## Task 1: Update Sanity schema

**Files:**
- Modify: `sanity/schemas/modules/caseStudySpotlight.ts`

- [ ] **Replace the file contents** with the following:

```ts
import { PresentationIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

const metricOverrideFields = [
  defineField({ name: "value", title: "Value", type: "string" }),
  defineField({ name: "label", title: "Label", type: "string" }),
  defineField({ name: "context", title: "Context (optional)", type: "string" }),
];

export const caseStudySpotlight = defineType({
  name: "caseStudySpotlight",
  title: "Case Study Spotlight",
  icon: PresentationIcon,
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "heading",
      title: "Section Heading (optional)",
      type: "string",
      description: 'e.g. "Built with Next.js" — shown as eyebrow on every card. Leave blank to omit.',
    }),
    defineField({
      name: "highlightMetrics",
      title: "Show business metrics",
      type: "boolean",
      description: "Displays the first metric from each project as a large headline figure.",
      initialValue: true,
    }),
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      description: "Add one or more case studies. Two projects render as a side-by-side grid; one renders full-width.",
      validation: (rule) => rule.min(1).error("At least one project is required."),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "project",
              title: "Project",
              type: "reference",
              to: [{ type: "project" }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "transformationStatementOverride",
              title: "Summary override (optional)",
              type: "text",
              rows: 3,
              description: "Overrides the project's transformation statement for this card. Leave blank to use the project default.",
            }),
            defineField({
              name: "businessMetricsOverride",
              title: "Metrics override (optional)",
              type: "array",
              description: "Overrides the project's business metrics for this card. Leave blank to use the project defaults.",
              of: [
                {
                  type: "object",
                  fields: metricOverrideFields,
                  preview: { select: { title: "value", subtitle: "label" } },
                },
              ],
            }),
            defineField({
              name: "ctaLabel",
              title: "CTA Label",
              type: "string",
              description: 'Label for the "read more" link. Defaults to "Read the full case study".',
              initialValue: "Read the full case study",
            }),
          ],
          preview: {
            select: { title: "project.title", subtitle: "ctaLabel" },
            prepare({ title, subtitle }) {
              return { title: title ?? "Unselected project", subtitle, media: PresentationIcon };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      projects: "projects",
      subtitle: "heading",
      visible: "visible",
    },
    prepare({ projects, subtitle, visible }) {
      const count = Array.isArray(projects) ? projects.length : 0;
      return {
        title: `${visible === false ? "[Hidden] " : ""}Case Study Spotlight (${count} project${count !== 1 ? "s" : ""})`,
        subtitle,
        media: PresentationIcon,
      };
    },
  },
});
```

- [ ] **Deploy the updated schema** — run from the `sanity/` directory:

```bash
cd sanity
env $(cat ../.env.local | grep -v '^#' | xargs) npx sanity schema deploy
```

Expected output: `Schema deployed successfully` (or similar confirmation).

- [ ] **Commit**

```bash
git add sanity/schemas/modules/caseStudySpotlight.ts
git commit -m "feat(sanity): replace single project ref with projects[] array in CaseStudySpotlight"
```

---

## Task 2: Update GROQ projection

**Files:**
- Modify: `lib/sanity/queries.ts`

- [ ] **Find and replace** the `caseStudySpotlight` projection block (lines ~238–261). Replace:

```groq
_type == "caseStudySpotlight" => {
  ...,
  _type,
  _key,
  heading,
  transformationStatementOverride,
  businessMetricsOverride[] { value, label, context },
  project-> {
    title,
    "slug": slug.current,
    transformationStatement,
    businessMetrics[] {
      label,
      value,
      context
    },
    image {
      asset->{ _id, url, metadata { lqip } },
      alt
    }
  },
  highlightMetrics,
  ctaLabel
},
```

with:

```groq
_type == "caseStudySpotlight" => {
  ...,
  _type,
  _key,
  heading,
  highlightMetrics,
  projects[] {
    _key,
    project-> {
      title,
      "slug": slug.current,
      transformationStatement,
      businessMetrics[] { value, label, context }
    },
    transformationStatementOverride,
    businessMetricsOverride[] { value, label, context },
    ctaLabel
  }
},
```

- [ ] **Commit**

```bash
git add lib/sanity/queries.ts
git commit -m "feat(query): update caseStudySpotlight GROQ projection for projects[] array"
```

---

## Task 3: Update TypeScript types

**Files:**
- Modify: `types/Sanity.d.ts`

- [ ] **Find** the `CaseStudySpotlightBlock` type (lines ~231–258) and **replace it** with:

```ts
export type CaseStudySpotlightItem = {
  _key: string;
  project: {
    title: string;
    slug: string;
    transformationStatement?: string;
    businessMetrics?: {
      value: string;
      label: string;
      context?: string;
    }[];
  };
  transformationStatementOverride?: string;
  businessMetricsOverride?: {
    value: string;
    label: string;
    context?: string;
  }[];
  ctaLabel?: string;
};

export type CaseStudySpotlightBlock = {
  _type: "caseStudySpotlight";
  _key?: string;
  visible?: boolean;
  heading?: string;
  highlightMetrics?: boolean;
  projects?: CaseStudySpotlightItem[];
};
```

- [ ] **Verify TypeScript compiles** — run from the project root:

```bash
npx tsc --noEmit
```

Expected: no errors. If errors appear, they will point to the component (Task 4) — continue to Task 4 and re-run.

- [ ] **Commit**

```bash
git add types/Sanity.d.ts
git commit -m "feat(types): add CaseStudySpotlightItem, update CaseStudySpotlightBlock for projects[] array"
```

---

## Task 4: Update component

**Files:**
- Modify: `components/modules/CaseStudySpotlight.tsx`

- [ ] **Replace the file contents** with the following:

```tsx
import Link from "next/link";
import { TrackCaseStudyClick } from "@/components/analytics/TrackCaseStudyClick";
import { localizedPath } from "@/lib/utils";
import type { CaseStudySpotlightBlock, CaseStudySpotlightItem } from "@/types/Sanity";

type Props = {
  block: CaseStudySpotlightBlock;
  language?: string;
};

function SpotlightCard({
  item,
  heading,
  highlightMetrics,
  language,
}: {
  item: CaseStudySpotlightItem;
  heading?: string;
  highlightMetrics?: boolean;
  language: string;
}) {
  const { project } = item;
  const transformationStatement =
    item.transformationStatementOverride ?? project.transformationStatement;
  const businessMetrics = item.businessMetricsOverride?.length
    ? item.businessMetricsOverride
    : project.businessMetrics;
  const ctaLabel = item.ctaLabel || "Read the full case study";
  const projectUrl = `/${language}/${localizedPath("projects", language)}/${project.slug}`;

  return (
    <div className="rounded-[var(--radius-lg)] border-l-4 border-[var(--color-brand)] bg-[var(--color-surface)] p-8 shadow-md">
      {highlightMetrics && businessMetrics?.[0] && (
        <div className="mb-5">
          <p
            className="font-heading text-2xl font-semibold text-[var(--color-accent)]"
            style={{ fontVariationSettings: "'WONK' 0" }}
          >
            {businessMetrics[0].value}
          </p>
          <p className="mt-0.5 font-sans text-sm text-[var(--color-text-subtle)]">
            {businessMetrics[0].label}
          </p>
        </div>
      )}

      {heading && (
        <p className="mb-3 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-[var(--color-brand)]">
          <span className="inline-block h-0.5 w-6 rounded-full bg-[var(--color-brand)]" />
          {heading}
        </p>
      )}

      <h3
        className="font-heading text-xl font-semibold tracking-tight text-[var(--color-text)]"
        style={{ fontVariationSettings: "'WONK' 0" }}
      >
        {project.title}
      </h3>

      {transformationStatement && (
        <p className="mt-2 font-sans text-base text-[var(--color-text-muted)]">
          {transformationStatement}
        </p>
      )}

      <TrackCaseStudyClick projectSlug={project.slug}>
        <Link
          href={projectUrl}
          className="mt-5 inline-flex items-center gap-1 font-sans text-sm font-semibold text-[var(--color-brand)] hover:underline"
        >
          {ctaLabel}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </TrackCaseStudyClick>
    </div>
  );
}

const CaseStudySpotlight = ({ block, language = "en" }: Props) => {
  const { heading, highlightMetrics, projects } = block;

  if (!projects?.length) return null;

  const isSingle = projects.length === 1;

  return (
    <section
      className="relative z-[1] w-full bg-[var(--color-surface-elevated)] border-t border-[var(--color-border)]"
    >
      <div className="mx-auto max-w-[720px] px-8 py-12">
        <div className={`grid grid-cols-1 gap-4 ${isSingle ? "" : "md:grid-cols-2"}`}>
          {projects.map((item) => (
            <SpotlightCard
              key={item._key}
              item={item}
              heading={heading}
              highlightMetrics={highlightMetrics}
              language={language}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudySpotlight;
```

- [ ] **Verify TypeScript compiles**:

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Run the dev server and open the niche page** (the Sanity data will be empty until Task 5 — verify no crash on empty `projects`):

```bash
npm run dev
```

Open `http://localhost:3000/en/next-js-developer-portugal`. The spotlight section should either be absent (no projects yet) or show cards once data is re-entered.

- [ ] **Commit**

```bash
git add components/modules/CaseStudySpotlight.tsx
git commit -m "feat(component): CaseStudySpotlight renders projects[] as responsive 2-col grid, fix i18n path"
```

---

## Task 5: Re-enter Sanity data + verify

The old `project` field has been removed from the schema. The niche page (`/en/next-js-developer-portugal`) needs its data re-entered in the new `projects[]` array.

- [ ] **Open Sanity Studio** at `http://localhost:3000/admin` (or the deployed Studio URL).

- [ ] **Navigate to** the niche page document for `/en/next-js-developer-portugal`.

- [ ] **Find the CaseStudySpotlight block** — it will show 0 projects.

- [ ] **Add project entry 1:** Click "Add item" → select **Farol Discover** → fill in or confirm:
  - `transformationStatementOverride`: leave blank (pulls from project)
  - `businessMetricsOverride`: leave blank (pulls from project)
  - `ctaLabel`: "Read the full case study"

- [ ] **Add project entry 2:** Click "Add item" → select **Tessa Schack Photography** → fill in or confirm:
  - `transformationStatementOverride`: leave blank (pulls from project)
  - `businessMetricsOverride`: leave blank (pulls from project)
  - `ctaLabel`: "Read the full case study"

- [ ] **Publish** the document.

- [ ] **Verify the page** at `http://localhost:3000/en/next-js-developer-portugal`:
  - Two cards appear side-by-side on desktop
  - Cards stack to single column on mobile (use DevTools device emulation)
  - Metrics shown in sage green on each card
  - "Read the full case study →" links to the correct `/en/projects/{slug}` path
  - PT version at `/pt/projetos/{slug}` resolves correctly (check `http://localhost:3000/pt/next-js-developer-portugal` if that page exists)

---

## Task 6: Build check + backlog update

- [ ] **Run production build** to confirm no type errors or build failures:

```bash
npm run build
```

Expected: build completes with no errors.

- [ ] **Update backlog** — open `backlog.md` and mark the P1 i18n fix as done:

Find:
```
- [ ] **Fix CaseStudySpotlight i18n path**
```

Replace with:
```
- [x] **Fix CaseStudySpotlight i18n path** — Fixed in CaseStudySpotlight multi-project refactor (2026-04-19). Uses `localizedPath()` per-item.
```

- [ ] **Commit everything**

```bash
git add backlog.md
git commit -m "chore: mark CaseStudySpotlight i18n fix as done in backlog"
```
