# Footer Redesign — Design Spec

**Date**: 2026-04-11
**Status**: Approved
**Approach**: Asymmetric Editorial

---

## 1. Purpose

The footer is the quiet close of every page. It grounds the visitor in who Joana is and where she's based, provides wayfinding for people who scrolled to the bottom, and offers low-friction contact info. It is not a CTA — every page already handles conversion through its own content blocks.

**Primary jobs:**
- Trust/grounding (~50%): Location, logo, email as contact info
- Wayfinding (~35%): Navigation links, social links
- Utility (~15%): Copyright, legal links, theme toggle

---

## 2. Data Model (Sanity)

The footer is a Sanity singleton document (`_type: "footer"`). All visible content is CMS-driven. Nothing is hardcoded in the component except layout, styling, and `© {currentYear}`.

### Updated schema fields

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `showLogo` | boolean | no | `true` | Toggles logo rendering on/off |
| `location` | string | no | — | e.g. "Algarve, Portugal". Hidden if empty. |
| `email` | string (email validation) | no | — | Already exists. Hidden if empty. |
| `socialLinks` | array of `{ platform: string, url: url }` | no | — | Already exists. |
| `navLinks` | array of `{ label: string, path: string }` | no | — | New. Footer nav items. `path` is a relative path (e.g. `/about`, `/services`). Component passes through `resolveLink(path, language)` for i18n routing. Editor controls which pages appear and order. |
| `legalLinks` | array of `{ label: string, path: string }` | no | — | New. Privacy Policy, Terms, etc. `path` is relative, routed via `resolveLink()`. |
| `copyrightText` | string | no | `"Joana Parente"` | New. Component prepends `© {year}` dynamically. Replaces old `message` field. |

### Migration from current schema

- `message` field removed, replaced by `copyrightText`
- `email` and `socialLinks` retained as-is
- New fields: `showLogo`, `location`, `navLinks`, `legalLinks`, `copyrightText`

### GROQ query update

```groq
*[_type == "footer"][0] {
  showLogo,
  location,
  email,
  socialLinks,
  navLinks,
  legalLinks,
  copyrightText
}
```

### TypeScript type update

```typescript
export type FooterType = {
  _id: string;
  _type: "footer";
  showLogo?: boolean;
  location?: string;
  email?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
  navLinks?: {
    label: string;
    path: string;
  }[];
  legalLinks?: {
    label: string;
    path: string;
  }[];
  copyrightText?: string;
};
```

---

## 3. Layout Structure

### Desktop (1024px+)

```
┌────────────────────────────────────────────────────────────┐
│  [LogoWordmark]              About  Services  Portfolio  Contact  │
│  Algarve, Portugal           LinkedIn ↗   GitHub ↗               │
│  hello@joanaparente.com                                          │
├────────────────────────────────────────────────────────────┤
│  [ThemeToggle]  © 2026 Joana Parente     Privacy Policy   Terms  │
└────────────────────────────────────────────────────────────┘
```

- `<footer>` with `role="contentinfo"`
- Inner container: `max-w-screen-xl mx-auto px-4`
- Top section: `flex justify-between items-start` — two columns
  - Left column: Logo (if `showLogo`), location, email — stacked vertically
  - Right column: Nav links, social links — stacked vertically, right-aligned
- Bottom bar: `border-t border-border`, `flex justify-between items-center`
  - Left: ThemeToggle + copyright
  - Right: Legal links

### Tablet (768px–1023px)

Same asymmetric layout with tighter spacing:
- Nav link gap: `gap-5` (from `gap-7`)
- Footer padding: `py-10` (from `py-12`)
- Bottom bar: `mt-6 pt-4` (from `mt-8 pt-5`)

### Mobile (<768px)

Centered vertical stack:

```
┌─────────────────────┐
│     [LogoIcon]      │
│  Algarve, Portugal  │
│                     │
│  About · Services   │
│  Portfolio · Contact│
│                     │
│  LinkedIn ↗ GitHub ↗│
│                     │
│ hello@joana...com   │
├─────────────────────┤
│ [ThemeToggle] © 2026│
│  Privacy · Terms    │
└─────────────────────┘
```

- `flex-col items-center text-center`
- Logo switches from `LogoWordmark` to `LogoIcon` (monogram only)
- Nav links: `flex-wrap` with `gap-x-5 gap-y-2`
- Email below social links (less prominent on mobile)
- Bottom bar stacks: toggle + copyright on one line, legal links below

---

## 4. Visual Styling

### Colors

| Element | Token | Role |
|---------|-------|------|
| Footer background | `--color-surface` | Same as page — no visual separation except border |
| Top border | `--color-border` | 1px subtle warm border |
| Bottom bar border | `--color-border` | Same |
| Location text | `--color-text-subtle` | Quiet metadata |
| Email text | `--color-text-muted` | Slightly more prominent than location |
| Email underline | `--color-border` | Subtle, strengthens on hover |
| Nav links | `--color-text-muted` | Standard secondary text |
| Nav links hover | `--color-text` | Full contrast on interaction |
| Social links | `--color-text-subtle` | Quietest level |
| Social links hover | `--color-text-muted` | One step up |
| Copyright | `--color-text-subtle` | Utility text |
| Legal links | `--color-text-subtle` | Utility text |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Logo | Component-controlled | Component-controlled | — |
| Location | `--font-body` | `text-sm` | 400 |
| Email | `--font-body` | `text-sm` | 400 |
| Nav links | `--font-body` | `text-sm` | 400 |
| Social links | `--font-body` | `text-xs` | 400 |
| Copyright | `--font-body` | `text-xs` | 400 |
| Legal links | `--font-body` | `text-xs` | 400 |

### Spacing

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Footer padding | `py-12 px-4` | `py-10 px-4` | `py-8 px-4` |
| Left column gap | `gap-1.5` | `gap-1.5` | `gap-1` |
| Right column gap | `gap-3` | `gap-3` | `gap-4` |
| Nav link gap | `gap-7` | `gap-5` | `gap-x-5 gap-y-2` |
| Social link gap | `gap-5` | `gap-4` | `gap-4` |
| Bottom bar top margin | `mt-8` | `mt-6` | `mt-6` |
| Bottom bar top padding | `pt-5` | `pt-4` | `pt-4` |

### Interactions

- All links: `transition-colors duration-200`
- Email: `border-b border-border hover:border-text-muted hover:text-foreground`
- Social links: `target="_blank" rel="noopener noreferrer"`
- Nav links: use `resolveLink()` with current locale for i18n routing

### Dark mode

No footer-specific overrides. All tokens inherit from the existing OKLCH dark mode palette in `globals.css`. Logo components already handle dark mode via their existing Tailwind classes (`fill-brand dark:fill-white` / `fill-foreground dark:fill-brand`).

---

## 5. Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Semantic element | `<footer>` element (implicit `role="contentinfo"`) |
| Footer nav | `<nav aria-label="Footer navigation">` wrapping nav links (distinguishes from header nav) |
| Social links | `aria-label="{Platform} (opens in new tab)"` on each |
| Email link | `aria-label="Send email to {email}"` |
| Logo (when shown) | `aria-hidden="true"` (decorative in footer context — not a link) |
| Color contrast | All combinations meet WCAG 2.1 AA (text-subtle on surface >= 4.5:1) |
| Touch targets | `min-h-[44px]` on mobile for all tappable elements, `md:min-h-0` on desktop |
| Theme toggle | Already accessible (existing component) |

---

## 6. Component Rendering Logic

```
if (!footer) → render fallback (copyright only)

<footer>
  <container max-w-screen-xl>
    <top-section flex>
      <left-column>
        {showLogo && <Logo />}          // LogoWordmark desktop, LogoIcon mobile
        {location && <Location />}
        {email && <EmailLink />}
      </left-column>
      <right-column>
        {navLinks?.length && <NavLinks />}
        {socialLinks?.length && <SocialLinks />}
      </right-column>
    </top-section>
    <bottom-bar border-t>
      <left: ThemeToggle + © {year} {copyrightText}>
      <right: legalLinks>
    </bottom-bar>
  </container>
</footer>
```

Every section renders only if its data is present. The layout adapts gracefully — if there's no email, no location, or no nav links, spacing adjusts naturally through flex/gap without conditional CSS.

---

## 7. Decisions Log

| Decision | Rationale |
|----------|-----------|
| No CTA in footer | Every page already has CTAs. Footer duplicating this would feel salesy and redundant. |
| Email visible as contact info, not a CTA | Serves busy operators who want to fire off a quick message. It's contact info, not a pitch. |
| LinkedIn + GitHub only (no Instagram) | LinkedIn is primary channel per business plan. GitHub serves technical evaluators. Instagram not in strategy, no active presence — empty link would violate honesty principle. |
| No "Built with Next.js & Sanity" | Voice profile says "show results and value, not process and tools." SEO value belongs in blog/landing pages, not footer boilerplate. |
| Logo toggle in CMS | CMS-first architecture — all content decisions in Sanity Studio. |
| Theme toggle in bottom bar | Keeps it accessible without competing with primary footer content. User preference. |
| `message` field replaced by `copyrightText` | More descriptive, aligns with actual usage. |
| Asymmetric layout | Feels editorial, not templated. Brand identity (left) vs. utility (right) creates natural hierarchy. |

---

## 8. Files to Modify

| File | Change |
|------|--------|
| `sanity/schemas/documents/footer.ts` | Add `showLogo`, `location`, `navLinks`, `legalLinks`, `copyrightText` fields. Remove `message`. |
| `sanity/schemas/index.ts` | No change (footer already registered) |
| `lib/sanity/queries.ts` | Update `getFooter()` GROQ projection to include new fields |
| `types/Sanity.d.ts` | Update `FooterType` |
| `components/layout/Footer.tsx` | Full rewrite — new layout, CMS-driven rendering, responsive breakpoints |
| Sanity Studio content | Seed/update footer document with new field values |
