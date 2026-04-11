# Nav Link Underline Animation — Design Spec

**Date:** 2026-04-11
**Branch:** feat/header-nav-redesign
**Files affected:** `app/globals.css`, `components/layout/Header.tsx`

## Problem

The desktop nav active-link indicator has three issues:

1. `pb-[3px]` on the active link adds bottom padding that shifts the link vertically, misaligning it with sibling nav items.
2. `border-b-[1.5px] border-primary` produces a straight border-bottom whose rendering (border-radius, pixel rounding) doesn't feel right.
3. There is no animated underline on hover — links go directly from muted to full-colour with no motion.

## Solution

Replace the border-bottom approach with a CSS pseudo-element underline that lives outside the box model (no layout impact) and animates on hover using a center-expand reveal.

## Implementation

### 1. `app/globals.css` — add `.nav-link` utility

Add the following block after the Shadcn CSS variable mapping section:

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

**Why pseudo-element:** The `::after` is `position: absolute` and therefore out of normal flow. It cannot shift the height or vertical alignment of its parent. The `left`/`right` transition (both moving toward the edges from center) produces the center-expand effect.

**Why `transition: none` on active:** The active underline should appear instantly on page load — it marks the current location, not a user gesture.

**Why `[aria-current="page"]`:** The `Link` already sets `aria-current={isActive ? "page" : undefined}` — no JS changes needed.

### 2. `components/layout/Header.tsx` — update active link className

In `desktopItems.map`, change the `Link` className from:

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

to:

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

**Removals:** `pb-[3px]`, `border-b-[1.5px]`, `border-primary`.
**Addition:** `nav-link` class on all desktop nav links.

## What does NOT change

- Active link text colour (`text-foreground`) and non-active colour logic (`text-muted-foreground hover:text-foreground`) are unchanged.
- `aria-current` logic in the component is unchanged.
- Focus-visible styles are unchanged.
- Mobile menu (`MobileMenu.tsx`) is unchanged — this fix is desktop-nav only.
- No new dependencies.

## Acceptance criteria

- All desktop nav items sit on the same baseline regardless of which is active.
- Hovering a non-active link reveals an underline that expands symmetrically from the centre of the word.
- The active link shows a permanent underline with no animation on page load.
- Removing focus or hover collapses the underline back to centre and disappears.
- No regressions in mobile menu or focus-visible behaviour.
