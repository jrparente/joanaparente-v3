# GA4 Event Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up 5 unused GA4 tracking events to their UI components using the established client wrapper pattern.

**Architecture:** Create 3 new client wrapper components (`TrackExternalLink`, `TrackServiceTierClick`, `TrackCaseStudyClick`) matching the existing `TrackCtaClick`/`TrackEmailClick` pattern. Modify 2 existing client components (`FaqAccordion`, `EmailCapture`) with direct integration. Wrap elements in 4 server components with the new wrappers.

**Tech Stack:** Next.js 15 App Router, `@next/third-parties/google` (`sendGAEvent`), React Server Components

**Spec:** `docs/superpowers/specs/2026-04-13-ga4-event-wiring-design.md`

---

### Task 1: Create TrackExternalLink wrapper

**Files:**
- Create: `components/analytics/TrackExternalLink.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { trackExternalLinkClick } from "@/lib/analytics";

export function TrackExternalLink({
  children,
  destinationUrl,
  linkType,
  className,
}: {
  children: React.ReactNode;
  destinationUrl: string;
  linkType: string;
  className?: string;
}) {
  return (
    <span
      className={className}
      onClick={() => trackExternalLinkClick(destinationUrl, linkType)}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors related to TrackExternalLink.

- [ ] **Step 3: Commit**

```bash
git add components/analytics/TrackExternalLink.tsx
git commit -m "feat(analytics): add TrackExternalLink wrapper component"
```

---

### Task 2: Create TrackServiceTierClick wrapper

**Files:**
- Create: `components/analytics/TrackServiceTierClick.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { trackServiceTierClick } from "@/lib/analytics";

export function TrackServiceTierClick({
  children,
  tierName,
  pagePath,
  className,
}: {
  children: React.ReactNode;
  tierName: string;
  pagePath: string;
  className?: string;
}) {
  return (
    <span
      className={className}
      onClick={() => trackServiceTierClick(tierName, pagePath)}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/analytics/TrackServiceTierClick.tsx
git commit -m "feat(analytics): add TrackServiceTierClick wrapper component"
```

---

### Task 3: Create TrackCaseStudyClick wrapper

**Files:**
- Create: `components/analytics/TrackCaseStudyClick.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { trackCaseStudySpotlightClick } from "@/lib/analytics";

export function TrackCaseStudyClick({
  children,
  projectSlug,
  className,
}: {
  children: React.ReactNode;
  projectSlug: string;
  className?: string;
}) {
  return (
    <span
      className={className}
      onClick={() =>
        trackCaseStudySpotlightClick(projectSlug, window.location.pathname)
      }
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/analytics/TrackCaseStudyClick.tsx
git commit -m "feat(analytics): add TrackCaseStudyClick wrapper component"
```

---

### Task 4: Wire FaqAccordion toggle tracking

**Files:**
- Modify: `components/modules/FaqAccordion.tsx:1-3` (add import)
- Modify: `components/modules/FaqAccordion.tsx:18-20` (modify toggle function)

- [ ] **Step 1: Add import**

Add after line 2 (`import { useState, useId } from "react";`):

```tsx
import { trackFaqExpand } from "@/lib/analytics";
```

- [ ] **Step 2: Modify toggle function**

Replace the toggle function (lines 18-20):

```tsx
  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };
```

With:

```tsx
  const toggle = (index: number) => {
    setOpenIndex((prev) => {
      if (prev !== index && items[index]) {
        trackFaqExpand(items[index].question, window.location.pathname);
      }
      return prev === index ? null : index;
    });
  };
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/modules/FaqAccordion.tsx
git commit -m "feat(analytics): track FAQ expand events"
```

---

### Task 5: Wire TrackLeadMagnetView into EmailCapture

**Files:**
- Modify: `components/forms/EmailCapture.tsx:11` (add import)
- Modify: `components/forms/EmailCapture.tsx:116-118` (add component)

- [ ] **Step 1: Add import**

Add after line 11 (`import { trackEmailCaptured } from "@/lib/analytics";`):

```tsx
import { TrackLeadMagnetView } from "@/components/analytics/TrackLeadMagnetView";
```

- [ ] **Step 2: Add TrackLeadMagnetView inside the return**

In the main return (line 116), add `<TrackLeadMagnetView>` as the first child inside the outer `<div>`. Replace:

```tsx
    <div
      className={`${isCard ? "rounded-lg border border-border bg-card p-6" : ""} ${className || ""}`}
    >
      {copy.heading && (
```

With:

```tsx
    <div
      className={`${isCard ? "rounded-lg border border-border bg-card p-6" : ""} ${className || ""}`}
    >
      <TrackLeadMagnetView magnetId={magnetId} pageLanguage={lang} />
      {copy.heading && (
```

- [ ] **Step 3: Commit**

```bash
git add components/forms/EmailCapture.tsx
git commit -m "feat(analytics): track lead magnet view impressions"
```

---

### Task 6: Wire TrackExternalLink into project detail page

**Files:**
- Modify: `app/[language]/(routes)/projects/[slug]/page.tsx` (add import + wrap "Visit site" button)

- [ ] **Step 1: Add import**

Add with the other component imports near the top of the file:

```tsx
import { TrackExternalLink } from "@/components/analytics/TrackExternalLink";
```

- [ ] **Step 2: Wrap the hero "Visit site" button**

Find the hero visit site link (around lines 265-276). Replace:

```tsx
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${domain} (opens in new tab)`}
              className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius-md)] border-[1.5px] border-[var(--color-brand)] px-5 py-2.5 font-sans text-[length:var(--text-sm)] font-semibold text-[var(--color-brand)] transition-all duration-200 hover:bg-[var(--color-brand)] hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--color-brand)] focus-visible:outline-offset-2"
            >
              Visit {domain}
              <ExternalLinkIcon className="h-3.5 w-3.5 transition-transform duration-200" />
            </a>
          )}
```

With:

```tsx
          {project.liveUrl && (
            <TrackExternalLink destinationUrl={project.liveUrl} linkType="project_visit_site">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${domain} (opens in new tab)`}
                className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius-md)] border-[1.5px] border-[var(--color-brand)] px-5 py-2.5 font-sans text-[length:var(--text-sm)] font-semibold text-[var(--color-brand)] transition-all duration-200 hover:bg-[var(--color-brand)] hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--color-brand)] focus-visible:outline-offset-2"
              >
                Visit {domain}
                <ExternalLinkIcon className="h-3.5 w-3.5 transition-transform duration-200" />
              </a>
            </TrackExternalLink>
          )}
```

- [ ] **Step 3: Commit**

```bash
git add app/[language]/(routes)/projects/[slug]/page.tsx
git commit -m "feat(analytics): track project visit-site clicks"
```

---

### Task 7: Wire TrackExternalLink into ContactSection LinkedIn link

**Files:**
- Modify: `components/modules/ContactSection.tsx` (add import + wrap LinkedIn link)

- [ ] **Step 1: Add import**

Add after the existing TrackEmailClick import (line 5):

```tsx
import { TrackExternalLink } from "@/components/analytics/TrackExternalLink";
```

- [ ] **Step 2: Wrap the LinkedIn link**

Find the LinkedIn button (around lines 71-78). Replace:

```tsx
          {linkedinUrl && linkedinLabel && (
            <Button asChild variant="outline" size="lg">
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="mr-2 h-5 w-5" />
                {linkedinLabel}
              </a>
            </Button>
          )}
```

With:

```tsx
          {linkedinUrl && linkedinLabel && (
            <TrackExternalLink destinationUrl={linkedinUrl} linkType="linkedin">
              <Button asChild variant="outline" size="lg">
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <LinkedinIcon className="mr-2 h-5 w-5" />
                  {linkedinLabel}
                </a>
              </Button>
            </TrackExternalLink>
          )}
```

- [ ] **Step 3: Commit**

```bash
git add components/modules/ContactSection.tsx
git commit -m "feat(analytics): track LinkedIn link clicks"
```

---

### Task 8: Wire TrackServiceTierClick into ServiceTiers

**Files:**
- Modify: `components/modules/ServiceTiers.tsx` (add import + wrap CTA links)

- [ ] **Step 1: Add import**

Add after line 3 (`import { ServiceTiersBlock } from "@/types/Sanity";`):

```tsx
import { TrackServiceTierClick } from "@/components/analytics/TrackServiceTierClick";
```

- [ ] **Step 2: Wrap the CTA Link**

Find the CTA button Link (around lines 144-153). Replace:

```tsx
                <Link
                  href={href}
                  className={`mt-auto block w-full rounded-[var(--radius-md)] py-3.5 text-center text-base font-semibold transition-all hover:-translate-y-px ${
                    tier.highlighted
                      ? "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-dark)] dark:text-[var(--color-surface)]"
                      : "border-2 border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand-light)]"
                  }`}
                >
                  {tier.ctaLabel}
                </Link>
```

With:

```tsx
                <TrackServiceTierClick tierName={tier.name} pagePath={href}>
                  <Link
                    href={href}
                    className={`mt-auto block w-full rounded-[var(--radius-md)] py-3.5 text-center text-base font-semibold transition-all hover:-translate-y-px ${
                      tier.highlighted
                        ? "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-dark)] dark:text-[var(--color-surface)]"
                        : "border-2 border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand-light)]"
                    }`}
                  >
                    {tier.ctaLabel}
                  </Link>
                </TrackServiceTierClick>
```

- [ ] **Step 3: Commit**

```bash
git add components/modules/ServiceTiers.tsx
git commit -m "feat(analytics): track service tier CTA clicks"
```

---

### Task 9: Wire TrackCaseStudyClick into CaseStudySpotlight

**Files:**
- Modify: `components/modules/CaseStudySpotlight.tsx` (add import + wrap CTA link)

- [ ] **Step 1: Add import**

Add after line 1 (`import Link from "next/link";`):

```tsx
import { TrackCaseStudyClick } from "@/components/analytics/TrackCaseStudyClick";
```

- [ ] **Step 2: Wrap the "Read case study" Link**

Find the CTA Link (around lines 62-68). Replace:

```tsx
          <Link
            href={projectUrl}
            className="mt-4 inline-flex items-center gap-1 font-sans text-sm font-semibold text-[var(--color-brand)] hover:underline"
          >
            {ctaLabel || "Read the case study"}
            <span aria-hidden="true">&rarr;</span>
          </Link>
```

With:

```tsx
          <TrackCaseStudyClick projectSlug={project.slug}>
            <Link
              href={projectUrl}
              className="mt-4 inline-flex items-center gap-1 font-sans text-sm font-semibold text-[var(--color-brand)] hover:underline"
            >
              {ctaLabel || "Read the case study"}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </TrackCaseStudyClick>
```

- [ ] **Step 3: Commit**

```bash
git add components/modules/CaseStudySpotlight.tsx
git commit -m "feat(analytics): track case study spotlight clicks"
```

---

### Task 10: Final build verification

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 2: Run linter**

Run: `npm run lint`
Expected: No new lint errors.

- [ ] **Step 3: Verify in browser**

Start dev server (`npm run dev`), open browser DevTools > Network tab, navigate to:
1. Services page — click a tier CTA, verify `service_tier_click` fires
2. Homepage — if CaseStudySpotlight is present, click it
3. Any project detail page — click "Visit site"
4. Contact section — click LinkedIn
5. FAQ section — expand a question

Check GA4 DebugView (Admin > Data Display > DebugView) to see events arriving.
