# proofLink Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the inline `{label, href}` object on `serviceTiers.proofLink` with the shared `link` type, so proof links use internal references instead of raw URLs.

**Architecture:** Five surgical edits across schema, query, type, and component layers. The shared `link` object gets `project` added to its reference types. The `serviceTiers` schema swaps its inline object for `type: "link"`. The GROQ projection, TypeScript type, and React component are updated to match.

**Tech Stack:** Sanity schemas, GROQ, Next.js, TypeScript

---

### Task 1: Add `project` to shared link reference types

**Files:**
- Modify: `sanity/schemas/objects/link.ts:29` — `to` array in the `internal` field

- [ ] **Step 1: Edit the reference types**

In `sanity/schemas/objects/link.ts`, change the `internal` field's `to` array from:

```ts
to: [{ type: "page" }, { type: "homepage" }],
```

to:

```ts
to: [{ type: "page" }, { type: "homepage" }, { type: "project" }],
```

- [ ] **Step 2: Verify the build compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add sanity/schemas/objects/link.ts
git commit -m "feat(sanity): add project to link reference types"
```

---

### Task 2: Replace inline proofLink with shared link type

**Files:**
- Modify: `sanity/schemas/modules/serviceTiers.ts:91-112` — replace the `proofLink` field definition

- [ ] **Step 1: Replace the proofLink field**

In `sanity/schemas/modules/serviceTiers.ts`, replace the entire `proofLink` field (lines 91-112):

```ts
// Remove this:
defineField({
  name: "proofLink",
  title: "Proof Link",
  type: "object",
  description: "Case study link shown below features",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      validation: (rule) =>
        rule.uri({
          allowRelative: true,
          scheme: ["http", "https"],
        }),
    }),
  ],
}),

// Replace with:
defineField({
  name: "proofLink",
  title: "Proof Link",
  type: "link",
  description: "Case study link shown below features",
}),
```

- [ ] **Step 2: Verify the build compiles**

Run: `npx tsc --noEmit`
Expected: No errors (schema types are runtime, not compile-time)

- [ ] **Step 3: Commit**

```bash
git add sanity/schemas/modules/serviceTiers.ts
git commit -m "refactor(sanity): replace inline proofLink with shared link type"
```

---

### Task 3: Update GROQ projection for proofLink

**Files:**
- Modify: `lib/sanity/queries.ts:183` — add `linkProjection` to `proofLink`

- [ ] **Step 1: Add linkProjection to proofLink**

In `lib/sanity/queries.ts`, inside the `serviceTiers` content block projection, change:

```groq
proofLabel,
proofLink,
ctaLabel,
ctaLink ${linkProjection}
```

to:

```groq
proofLabel,
proofLink ${linkProjection},
ctaLabel,
ctaLink ${linkProjection}
```

- [ ] **Step 2: Verify the build compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add lib/sanity/queries.ts
git commit -m "feat(sanity): add link projection to proofLink query"
```

---

### Task 4: Update TypeScript type

**Files:**
- Modify: `types/Sanity.d.ts:173` — change `proofLink` type

- [ ] **Step 1: Change the proofLink type**

In `types/Sanity.d.ts`, inside `ServiceTiersBlock`, change:

```ts
proofLink?: { label: string; href: string };
```

to:

```ts
proofLink?: LinkType;
```

`LinkType` is already imported/defined in this file (used by `ctaLink` on the next line).

- [ ] **Step 2: Verify the build compiles**

Run: `npx tsc --noEmit`
Expected: Type error in `components/modules/ServiceTiers.tsx` — `proofLink.href` no longer exists. This is expected and fixed in Task 5.

- [ ] **Step 3: Commit**

```bash
git add types/Sanity.d.ts
git commit -m "refactor(types): update proofLink to LinkType"
```

---

### Task 5: Update ServiceTiers component to use resolveLink

**Files:**
- Modify: `components/modules/ServiceTiers.tsx:130-141` — replace raw `<a>` with `<Link>` + `resolveLink()`

- [ ] **Step 1: Update the proof link rendering**

In `components/modules/ServiceTiers.tsx`, replace lines 130-141:

```tsx
{/* Proof link */}
{tier.proofLink?.label && tier.proofLink?.href && (
  <p className="mb-5 text-xs text-[var(--color-text-subtle)]">
    {tier.proofLabel || "See it in action:"}{" "}
    <a
      href={tier.proofLink.href}
      className="font-medium text-[var(--color-brand)] transition-colors hover:text-[var(--color-brand-dark)]"
    >
      {tier.proofLink.label}
    </a>
  </p>
)}
```

with:

```tsx
{/* Proof link */}
{tier.proofLink?.label && (
  <p className="mb-5 text-xs text-[var(--color-text-subtle)]">
    {tier.proofLabel || "See it in action:"}{" "}
    <Link
      href={resolveLink(tier.proofLink, language)}
      className="font-medium text-[var(--color-brand)] transition-colors hover:text-[var(--color-brand-dark)]"
    >
      {tier.proofLink.label}
    </Link>
  </p>
)}
```

Note: `Link` (from `next/link`) and `resolveLink` (from `@/lib/utils`) are already imported at the top of this file.

- [ ] **Step 2: Verify the build compiles**

Run: `npx tsc --noEmit`
Expected: No errors — the Task 4 type error is now resolved.

- [ ] **Step 3: Run the full build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add components/modules/ServiceTiers.tsx
git commit -m "refactor(ui): use resolveLink for proofLink in ServiceTiers"
```

---

### Task 6: Visual verification

- [ ] **Step 1: Start dev server and check the services page**

Run: `npm run dev`

Open the page that contains the ServiceTiers block (the services page). Verify:
- Tier cards render without errors
- CTA buttons still link correctly
- If any proof links have been re-entered in Sanity, they render and navigate correctly
- If no proof links are set yet, the proof link line is simply absent (no blank space or broken markup)

- [ ] **Step 2: Check Sanity Studio**

Open `/admin` and navigate to a page with service tiers. Edit a tier and verify:
- The `proofLink` field now shows the shared link widget (internal/external radio, reference picker)
- The `proofLabel` field is still present and editable
- The `ctaLink` field is unchanged

- [ ] **Step 3: Commit all remaining changes (if any)**

If any adjustments were needed during verification, commit them.
