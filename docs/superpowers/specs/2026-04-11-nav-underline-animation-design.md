# Header Nav & LangToggle — Design Spec

**Date:** 2026-04-11
**Branch:** feat/header-nav-redesign
**Files affected:**
- `app/globals.css`
- `components/layout/Header.tsx`
- `components/layout/LangToggle.tsx`
- `app/actions/getTranslatedPath.ts` (new)

---

## Part 1 — Desktop Nav Link Underline

### Problem

The desktop nav active-link indicator has three issues:

1. `pb-[3px]` on the active link adds bottom padding that shifts the link vertically, misaligning it with sibling nav items.
2. `border-b-[1.5px] border-primary` produces a straight border-bottom whose rendering (border-radius, pixel rounding) doesn't feel right.
3. There is no animated underline on hover — links go directly from muted to full-colour with no motion.

### Solution

Replace the border-bottom approach with a CSS pseudo-element underline that lives outside the box model (no layout impact) and animates on hover using a center-expand reveal.

### Implementation

#### 1. `app/globals.css` — add `.nav-link` utility

Add after the Shadcn CSS variable mapping section:

```css
/* ── Nav link — animated underline (center-expand) ── */
.nav-link {
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  right: 50%;
  height: 1.5px;
  background: var(--primary);
  border-radius: 1px;
  transition: left 0.25s ease, right 0.25s ease;
}
.nav-link:hover::after,
.nav-link[aria-current="page"]::after {
  left: 0;
  right: 0;
}
.nav-link[aria-current="page"]::after {
  transition: none;
}
```

**Why pseudo-element:** `position: absolute` takes it out of normal flow — it cannot shift the height or vertical alignment of its parent. The `left`/`right` transition (both moving toward the edges from center) produces the center-expand effect.

**Why `transition: none` on active:** The active underline should appear instantly on page load — it marks the current location, not a user gesture.

**Why `[aria-current="page"]`:** The `Link` already sets `aria-current={isActive ? "page" : undefined}` — no JS changes needed.

#### 2. `components/layout/Header.tsx` — update active link className

In `desktopItems.map`, change the `Link` className:

**Remove:** `pb-[3px]`, `border-b-[1.5px]`, `border-primary`
**Add:** `nav-link` class

```tsx
className={cn(
  "nav-link font-sans text-[0.82rem] font-medium",
  "transition-colors duration-200",
  "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 rounded-sm",
  isActive
    ? "text-foreground"
    : "text-muted-foreground hover:text-foreground"
)}
```

### What does NOT change (Part 1)

- Active/non-active text colour logic is unchanged.
- `aria-current` logic is unchanged.
- Focus-visible styles are unchanged.
- `MobileMenu.tsx` is untouched — desktop only.

---

## Part 2 — LangToggle: Alignment, Active Indicator & Slug-Aware Routing

### Problems

1. **Desktop alignment** — `min-h-[44px] min-w-[44px]` on the buttons (touch-target sizing) inflates the button height on desktop, creating visible extra space and misaligning the toggle with the nav links.
2. **Active indicator** — Same `pb-[2px] border-b-[1.5px] border-primary` layout-shifting pattern as the nav links.
3. **Wrong slug on switch** — `switchLocale` does a string-replace on the path prefix (`/pt` → `/en`) without consulting the CMS. `/en/services` routes to `/pt/services` instead of the correct translated URL `/pt/servicos`.

### Solution

#### Fix 1 — Touch target sizing

Replace `min-h-[44px] min-w-[44px]` with `min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0`.

This preserves 44 × 44 px touch targets on mobile while allowing the buttons to size naturally on desktop where the header provides sufficient click affordance.

#### Fix 2 — Active indicator

Add `.lang-btn` utility to `globals.css`, keyed off the existing `aria-pressed="true"` attribute (already set correctly in the component):

```css
/* ── Lang toggle button — active indicator ── */
.lang-btn {
  position: relative;
}
.lang-btn::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1.5px;
  background: var(--primary);
  border-radius: 1px;
  opacity: 0;
}
.lang-btn[aria-pressed="true"]::after {
  opacity: 1;
}
```

Static, instant — no animation. This is a state indicator, not a gesture response.

In `LangToggle.tsx`, replace `pb-[2px] border-b-[1.5px] border-primary` with the `lang-btn` class.

#### Fix 3 — Slug-aware routing via server action

**New file: `app/actions/getTranslatedPath.ts`**

```ts
'use server'

import { groq } from 'next-sanity'
import { client } from '@/lib/sanity/client'

export async function getTranslatedPath(
  currentPathname: string,
  currentLanguage: string,
  targetLanguage: string
): Promise<string> {
  if (currentLanguage === targetLanguage) return currentPathname

  // Strip locale prefix: /pt/servicos → /servicos
  const localePrefix = `/${currentLanguage}`
  const pathWithoutLocale = currentPathname.startsWith(localePrefix)
    ? currentPathname.slice(localePrefix.length)
    : ''

  // Homepage
  if (!pathWithoutLocale || pathWithoutLocale === '/') {
    return `/${targetLanguage}`
  }

  // Split path into prefix + leaf slug
  // e.g. /projects/my-project → prefix="/projects", slug="my-project"
  // e.g. /servicos → prefix="", slug="servicos"
  const segments = pathWithoutLocale.replace(/^\//, '').split('/')
  const pathPrefix = segments.length > 1 ? `/${segments[0]}` : ''
  const currentSlug = segments[segments.length - 1]

  // Look up translated slug via translation.metadata
  const query = groq`
    *[_type == "translation.metadata" &&
      count(translations[value->language == $currentLanguage && value->slug.current == $currentSlug]) > 0
    ][0] {
      "translatedSlug": translations[value->language == $targetLanguage][0].value->slug.current
    }
  `

  const result = await client.fetch<{ translatedSlug: string | null }>(
    query,
    { currentLanguage, currentSlug, targetLanguage },
    { cache: 'force-cache', next: { revalidate: 60 } }
  )

  const translatedSlug = result?.translatedSlug ?? currentSlug
  return `/${targetLanguage}${pathPrefix}/${translatedSlug}`
}
```

**Key decisions:**
- Uses `client.fetch()` directly (same as `getPageSlugs`, `getPagesWithTranslations`) to avoid the `draftMode()` call in `fetchSanity`.
- Passes `{ cache: 'force-cache', next: { revalidate: 60 } }` to align with the site's 60 s ISR strategy.
- Falls back to the current slug if no translation found — safe for fixed paths like `/projects` where no `translation.metadata` document exists.
- Path prefix is preserved unchanged — only the leaf slug is translated.

**`LangToggle.tsx` changes:**

```tsx
'use client'

import { useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getTranslatedPath } from '@/app/actions/getTranslatedPath'
import { languages } from '@/i18n.config'
import { cn } from '@/lib/utils'

export const LangToggle = ({ language }: { language: string }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const switchLocale = (newLocale: string) => {
    if (newLocale === language) return
    startTransition(async () => {
      const path = await getTranslatedPath(pathname, language, newLocale)
      router.push(path)
    })
  }

  return (
    <div className="flex items-center gap-1" aria-label="Language toggle">
      {languages.map((lang, index) => (
        <span key={lang.id} className="flex items-center gap-1">
          {index > 0 && (
            <span className="text-border text-[0.7rem] select-none" aria-hidden="true">·</span>
          )}
          <button
            onClick={() => switchLocale(lang.id)}
            aria-label={`Switch to ${lang.title}`}
            aria-pressed={language === lang.id}
            disabled={isPending}
            className={cn(
              "lang-btn border-none bg-transparent p-0 cursor-pointer",
              "font-sans text-[0.7rem] font-semibold tracking-[0.05em] uppercase",
              "transition-colors duration-200",
              "min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 flex items-center justify-center",
              isPending && "opacity-50",
              language === lang.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {lang.id.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  )
}
```

**Removals:** `pb-[2px]`, `border-b-[1.5px]`, `border-primary`, old `switchLocale` fn, `useRouter` import replaced.
**Additions:** `useTransition`, `getTranslatedPath` import, `lang-btn` class, `isPending` dim + `disabled` state, responsive touch-target sizing.

---

## Acceptance Criteria

### Nav links
- All desktop nav items sit on the same baseline regardless of which is active.
- Hovering a non-active link reveals an underline that expands symmetrically from the centre of the word.
- The active link shows a permanent underline with no animation on page load.
- No regressions in mobile menu or focus-visible behaviour.

### LangToggle
- PT and EN buttons sit flush with nav link baselines on desktop (no extra vertical space).
- Active language shows a static underline indicator; no `pb` shifting.
- Switching from `/en/services` navigates to `/pt/servicos` (correct CMS slug), not `/pt/services`.
- Switching from a project detail page translates the project slug correctly.
- Buttons dim while the path lookup is in flight; no double-clicks possible.
- Touch targets remain ≥ 44 × 44 px on mobile.
- No regressions in mobile menu.
