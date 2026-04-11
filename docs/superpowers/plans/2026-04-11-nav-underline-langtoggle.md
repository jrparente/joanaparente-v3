# Header Nav & LangToggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix desktop nav active-link alignment and add a center-expand hover underline animation; fix LangToggle desktop alignment, active indicator, and slug-aware language switching.

**Architecture:** Two CSS utility classes (`.nav-link`, `.lang-btn`) are added to `globals.css` and applied in `Header.tsx` / `LangToggle.tsx` via `cn()`. A new `'use server'` action `getTranslatedPath` resolves the correct CMS slug for the target language so `LangToggle` navigates to the real translated URL instead of blindly swapping the locale prefix.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS v4, Sanity (`next-sanity` client), React `useTransition`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `app/globals.css` | Modify | Add `.nav-link` (center-expand underline) and `.lang-btn` (active indicator) CSS utilities |
| `components/layout/Header.tsx` | Modify | Apply `nav-link` class, remove `pb-[3px] border-b-[1.5px] border-primary` from active link |
| `app/actions/getTranslatedPath.ts` | Create | Server action: resolve translated slug via `translation.metadata` GROQ |
| `components/layout/LangToggle.tsx` | Modify | Call server action on click, fix touch-target sizing, apply `lang-btn` class |

---

## Task 1: Add CSS utilities to `globals.css`

**Files:**
- Modify: `app/globals.css` (append after line 466, the end of the file)

- [ ] **Step 1: Append the two utility blocks to `globals.css`**

Open `app/globals.css`. After the last line (the closing `}` of the `@media (prefers-reduced-motion)` block inside the HEADER section, currently line 466), append:

```css

/* ─────────────────────────────────────────────
   NAV LINK — animated underline (center-expand)
   ───────────────────────────────────────────── */

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

/* Active state: no animation — marks location, not a gesture */
.nav-link[aria-current="page"]::after {
  transition: none;
}

/* ─────────────────────────────────────────────
   LANG TOGGLE BUTTON — active indicator
   ───────────────────────────────────────────── */

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

/* aria-pressed="true" is already set by LangToggle when lang matches */
.lang-btn[aria-pressed="true"]::after {
  opacity: 1;
}
```

- [ ] **Step 2: Run lint to confirm no CSS errors**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(nav): add .nav-link and .lang-btn CSS utilities for pseudo-element underlines"
```

---

## Task 2: Update `Header.tsx` — apply `.nav-link`, remove border-b active indicator

**Files:**
- Modify: `components/layout/Header.tsx` (lines 81–88)

- [ ] **Step 1: Replace the active-link className in `desktopItems.map`**

Locate the `Link` inside `desktopItems.map` (around line 77). Replace its `className` prop:

**Before:**
```tsx
className={cn(
  "font-sans text-[0.82rem] font-medium",
  "transition-colors duration-200",
  "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 rounded-sm",
  isActive
    ? "text-foreground pb-[3px] border-b-[1.5px] border-primary"
    : "text-muted-foreground hover:text-foreground"
)}
```

**After:**
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

The only changes are:
- `"nav-link"` added to the first string
- `pb-[3px] border-b-[1.5px] border-primary` removed from the `isActive` branch

Everything else — `aria-current`, `href`, `key` — stays exactly as-is.

- [ ] **Step 2: Start the dev server and visually verify**

```bash
npm run dev
```

Open `http://localhost:3000`. Navigate to a page that has nav links (e.g. `/pt/servicos`).

Check:
- All nav items sit on the same baseline — no vertical shift between active and inactive links.
- The active link ("Serviços") shows a terracotta underline appearing immediately.
- Hovering an inactive link shows the underline expanding symmetrically from the word's centre.
- Removing hover collapses the underline back to centre.
- No layout shift on the active item compared to neighbours.

- [ ] **Step 3: Commit**

```bash
git add components/layout/Header.tsx
git commit -m "feat(nav): replace border-b active indicator with .nav-link center-expand underline"
```

---

## Task 3: Create server action `getTranslatedPath`

**Files:**
- Create: `app/actions/getTranslatedPath.ts`

- [ ] **Step 1: Create the actions directory and file**

```bash
mkdir -p app/actions
```

Create `app/actions/getTranslatedPath.ts` with this exact content:

```ts
"use server";

import { groq } from "next-sanity";
import { client } from "@/lib/sanity/client";

/**
 * Resolves the correct translated path for a given pathname + target language.
 *
 * Uses translation.metadata documents (created by @sanity/document-internationalization)
 * to look up the real slug for the target language, rather than just swapping the
 * locale prefix in the URL.
 *
 * Falls back to the current leaf slug if no translation is found (safe for fixed
 * paths like /projects that have no Sanity document).
 *
 * @param currentPathname - Full pathname including locale prefix, e.g. "/en/services"
 * @param currentLanguage - Current locale, e.g. "en"
 * @param targetLanguage  - Target locale, e.g. "pt"
 * @returns Translated path, e.g. "/pt/servicos"
 */
export async function getTranslatedPath(
  currentPathname: string,
  currentLanguage: string,
  targetLanguage: string
): Promise<string> {
  if (currentLanguage === targetLanguage) return currentPathname;

  // Strip locale prefix: "/en/services" → "/services"
  const localePrefix = `/${currentLanguage}`;
  const pathWithoutLocale = currentPathname.startsWith(localePrefix)
    ? currentPathname.slice(localePrefix.length)
    : "";

  // Homepage: "/pt" or "/en"
  if (!pathWithoutLocale || pathWithoutLocale === "/") {
    return `/${targetLanguage}`;
  }

  // Split into path prefix + leaf slug.
  // "/services"           → pathPrefix="",          currentSlug="services"
  // "/projects/my-proj"  → pathPrefix="/projects",  currentSlug="my-proj"
  const segments = pathWithoutLocale.replace(/^\//, "").split("/");
  const pathPrefix = segments.length > 1 ? `/${segments[0]}` : "";
  const currentSlug = segments[segments.length - 1];

  // Reverse-lookup via translation.metadata: find the metadata document that
  // contains a reference to a document with the current language + slug, then
  // get the translated slug for the target language.
  const query = groq`
    *[_type == "translation.metadata" &&
      count(translations[
        value->language == $currentLanguage &&
        value->slug.current == $currentSlug
      ]) > 0
    ][0] {
      "translatedSlug": translations[
        value->language == $targetLanguage
      ][0].value->slug.current
    }
  `;

  const result = await client.fetch<{ translatedSlug: string | null }>(
    query,
    { currentLanguage, currentSlug, targetLanguage },
    { cache: "force-cache", next: { revalidate: 60 } }
  );

  // Fall back to the current slug if Sanity has no translation (e.g. /projects listing)
  const translatedSlug = result?.translatedSlug ?? currentSlug;
  return `/${targetLanguage}${pathPrefix}/${translatedSlug}`;
}
```

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: no errors. The `"use server"` directive and `client.fetch` call are consistent with the existing pattern in `lib/sanity/queries.ts` (`getPageSlugs`, `getPagesWithTranslations`).

- [ ] **Step 3: Manually smoke-test the action logic (optional but recommended)**

In the browser console on the dev site, or by temporarily logging in a component, verify:
- `/en/services` → should resolve to `/pt/servicos`
- `/pt` → should resolve to `/en` (homepage short-circuit)
- `/pt/projects` → should fall back to `/en/projects` (no translation.metadata doc)

- [ ] **Step 4: Commit**

```bash
git add app/actions/getTranslatedPath.ts
git commit -m "feat(lang): add getTranslatedPath server action for CMS-aware locale switching"
```

---

## Task 4: Update `LangToggle.tsx` — routing, alignment, active indicator

**Files:**
- Modify: `components/layout/LangToggle.tsx`

- [ ] **Step 1: Replace the entire file content**

Replace `components/layout/LangToggle.tsx` with:

```tsx
"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { languages } from "@/i18n.config";
import { cn } from "@/lib/utils";
import { getTranslatedPath } from "@/app/actions/getTranslatedPath";

type Props = {
  language: string;
};

export const LangToggle = ({ language }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    if (newLocale === language) return;
    startTransition(async () => {
      const path = await getTranslatedPath(pathname, language, newLocale);
      router.push(path);
    });
  };

  return (
    <div className="flex items-center gap-1" aria-label="Language toggle">
      {languages.map((lang, index) => (
        <span key={lang.id} className="flex items-center gap-1">
          {index > 0 && (
            <span
              className="text-border text-[0.7rem] select-none"
              aria-hidden="true"
            >
              ·
            </span>
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
              // 44×44px touch target on mobile; auto-size on desktop
              "min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 flex items-center justify-center",
              isPending && "opacity-50 cursor-wait",
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
  );
};
```

**What changed vs. the original:**
- `useTransition` added; `isPending` drives the disabled + dim state during the server action call
- `switchLocale` now calls `getTranslatedPath` server action and pushes the returned path
- Button gets `disabled={isPending}` and `isPending && "opacity-50 cursor-wait"`
- `min-h-[44px] min-w-[44px]` now has `md:min-h-0 md:min-w-0` to fix desktop alignment
- `pb-[2px] border-b-[1.5px] border-primary` removed from active branch; `lang-btn` class added
- Active branch reduced to `"text-primary"` — the underline comes from `.lang-btn[aria-pressed="true"]::after`

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: clean build. The server action must be in a file with `"use server"` at the top (already done). Confirm no type errors around the `client.fetch` call in `getTranslatedPath.ts`.

- [ ] **Step 4: Visual QA on the dev server**

```bash
npm run dev
```

Open `http://localhost:3000/pt`. Check:

**Alignment:**
- PT · EN buttons sit flush with the nav links — no extra vertical gap above or below.

**Active indicator:**
- PT button shows a terracotta underline immediately (no animation).
- EN button shows no underline.

**Routing:**
- Navigate to `/pt/servicos`. Click EN.
- Should route to `/en/services`, not `/en/servicos`.
- Navigate to `/en/services`. Click PT.
- Should route to `/pt/servicos`, not `/pt/services`.

**Loading state:**
- Click the toggle — both buttons should briefly dim while the action is in flight.

**Homepage:**
- On `/pt`, clicking EN should go to `/en` (not `/en/`).

**Mobile (resize browser to < 768px):**
- Touch targets remain visually large enough (≥ 44 × 44 px area).
- No regression in MobileMenu.

- [ ] **Step 5: Commit**

```bash
git add components/layout/LangToggle.tsx
git commit -m "feat(lang): fix LangToggle alignment, active indicator, and slug-aware routing"
```

---

## Task 5: Final build verification & reduced-motion check

**Files:** none (verification only)

- [ ] **Step 1: Production build**

```bash
npm run build
```

Expected: exits 0, no type errors, no missing module errors.

- [ ] **Step 2: Reduced-motion check**

In browser DevTools → Rendering → Emulate CSS media: `prefers-reduced-motion: reduce`.

Confirm:
- Nav link underline appears instantly (no transition) — the existing `@media (prefers-reduced-motion: reduce)` rule in `globals.css` zeroes all transitions.
- LangToggle active indicator is static — no animation to suppress.

- [ ] **Step 3: Dark mode check**

Toggle dark mode via the ThemeToggle in the footer. Confirm:
- Nav link underline uses the dark-mode `--primary` (oklch(65% 0.11 42)) — slightly lighter terracotta.
- LangToggle active indicator matches.

- [ ] **Step 4: Final commit (if any fixes needed)**

If any visual tweaks were made in steps 2–3:

```bash
git add -p
git commit -m "fix(nav): visual QA corrections from reduced-motion and dark mode review"
```

---

## Spec Coverage Check

| Spec requirement | Task |
|---|---|
| Remove `pb-[3px]` from active nav link | Task 2 |
| Replace `border-b` with pseudo-element underline | Task 1 + Task 2 |
| Center-expand animation on hover | Task 1 (`.nav-link::after` transition) |
| Active underline instant (no transition) | Task 1 (`transition: none` on `[aria-current="page"]`) |
| LangToggle desktop alignment fix (`min-h`/`min-w`) | Task 4 |
| LangToggle active indicator via `lang-btn` pseudo-element | Task 1 + Task 4 |
| LangToggle `pb-[2px] border-b` removed | Task 4 |
| Slug-aware routing via server action | Task 3 + Task 4 |
| Fallback to current slug if no translation found | Task 3 |
| Mobile touch targets preserved | Task 4 |
| `isPending` loading state | Task 4 |
| Reduced-motion compliance | Task 5 |
| Dark mode compliance | Task 5 |
