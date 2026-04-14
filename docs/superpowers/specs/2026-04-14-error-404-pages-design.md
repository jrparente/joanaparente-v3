# Error & 404 Pages — Design Spec

**Date:** 2026-04-14
**Status:** Approved — ready for implementation

---

## Context

The site currently shows Next.js default 404 and error pages. Custom pages are needed for brand consistency and UX. This spec covers all three error boundary files required for full coverage in the App Router.

**Audience note:** Primary visitors are activity operators and expat entrepreneurs in Algarve tourism/hospitality — not necessarily tech-savvy. Copy must be immediately clear to a non-technical audience. No jargon.

**CMS-first exception:** Error pages are explicitly classified as "framework chrome" in `.claude/rules/cms-first.md` and may use hardcoded strings. No Sanity schema needed.

---

## Files to Create

| File | Purpose | Layout preserved? |
|---|---|---|
| `app/[language]/(routes)/not-found.tsx` | Broken links, mistyped URLs, missing CMS pages | Yes — full Header + Footer |
| `app/[language]/(routes)/error.tsx` | Runtime errors (server errors, CMS timeouts) | Yes — full Header + Footer |
| `app/global-error.tsx` | Root layout crashes (last-resort fallback) | No — must own `<html><body>` |

---

## Prerequisite: Middleware Update

`not-found.tsx` is a server component that receives no `params` prop. Language must be passed via a custom request header set in middleware (confirmed pattern per Next.js docs — `not-found.mdx`).

**Change to `middleware.ts`:**

In all `NextResponse.next()` and `NextResponse.rewrite()` calls where the locale is known (pathname already has a locale prefix), attach the resolved locale to the request headers:

```ts
const requestHeaders = new Headers(request.headers)
requestHeaders.set('x-language', resolvedLocale)
return NextResponse.next({ request: { headers: requestHeaders } })
```

Extract `resolvedLocale` from the pathname first segment: `pathname.split('/')[1]` when it matches `locales`.

**Critical:** Must set on `request` headers inside `NextResponse.next({ request: { headers } })` — NOT `response.headers.set()`. The latter is not readable via `headers()` in server components.

---

## File 1 — `app/[language]/(routes)/not-found.tsx`

### Behaviour

- Server component (async)
- Triggered by any `notFound()` call within `[language]/(routes)/**` routes
- Inherits full layout from `app/[language]/(routes)/layout.tsx` — Header, Footer, fonts, ThemeProvider all present
- Language read from `x-language` request header; falls back to `'pt'`

### Visual Design

**Layout:** Left-aligned. Large ghost "404" sits behind the headline using `position: absolute` / `z-index`. Headline overlaps it. Body text and CTAs below.

```
[ ghost "404" — large, terracotta-light, ~55% opacity, absolute ]
   This page doesn't exist.          ← headline overlaps ghost number
   You may have followed a broken    ← subtext
   link or mistyped the address.
   Here's where to go instead.

   [ Back to home ]  View my work →
```

**Tokens:**
- Ghost number: `var(--color-brand-light)` at `opacity: 0.55`, `font-family: var(--font-heading)`, ~`9rem`–`10rem`
- Headline: `var(--font-heading)`, `text-3xl` / `text-4xl`, `var(--color-text)`
- Subtext: `var(--font-sans)`, `text-base`, `var(--color-text-muted)`, max-width ~`480px`
- Primary CTA: terracotta button, matches site's existing button pattern
- Secondary CTA: ghost/text link, underlined

**Spacing:** Generous vertical padding (`py-24` or similar). Content vertically centered in the main area between Header and Footer.

### Copy

| Element | English | Portuguese (PT-PT) |
|---|---|---|
| Headline | This page doesn't exist. | Esta página não existe. |
| Subtext | You may have followed a broken link or mistyped the address. Here's where to go instead. | Pode ter seguido um link antigo ou introduzido o endereço errado. Volta ao início ou explora o meu trabalho. |
| Primary CTA | Back to home | Voltar ao início |
| Secondary CTA | View my work → | Ver o meu trabalho → |

### CTAs — destinations

- Primary: `/${language}` (homepage)
- Secondary: `/${language}/projects` (projects listing)

Both via Next.js `Link`, paths constructed directly as `/${language}` and `/${language}/projects`. Do not use `resolveLink` — that util takes Sanity link objects, not plain path strings.

### SEO

- `noindex` — error pages must not be indexed. Export `metadata` with `robots: 'noindex'`.
- No `canonical` needed.

---

## File 2 — `app/[language]/(routes)/error.tsx`

### Behaviour

- **Must be** `"use client"` (Next.js requirement for error boundaries)
- Catches runtime errors thrown within `[language]/(routes)/**` (CMS fetch failures, unexpected throws)
- Inherits full layout — Header, Footer preserved
- Props: `{ error: Error & { digest?: string }, reset: () => void }`
- Language detected via `usePathname()` — parse first path segment

```ts
const pathname = usePathname() // e.g. '/en/projects'
const language = pathname.split('/')[1] === 'en' ? 'en' : 'pt'
```

- `reset()` clears error state for recoverable client-side errors. For server component errors (e.g. CMS timeout), `reset()` alone may not recover — the home link provides an exit.

### Visual Design

Same visual language as the 404 page — same font stack, tokens, spacing, CTA style. **No ghost number** (no meaningful numeric code for runtime errors).

```
   Something went wrong.             ← headline (Fraunces)
   Try refreshing the page —         ← subtext
   it usually sorts itself.

   [ Try again ]  Back to home →
```

**Tokens:** identical to not-found page. `text-3xl` headline, `text-base` muted subtext.

### Copy

| Element | English | Portuguese (PT-PT) |
|---|---|---|
| Headline | Something went wrong. | Algo correu mal. |
| Subtext | Try refreshing the page. It usually sorts itself. | Tenta recarregar a página. Normalmente resolve-se. |
| Primary CTA | Try again | Tentar novamente |
| Secondary CTA | Back to home → | Voltar ao início → |

### CTAs — behaviour

- Primary: calls `reset()` (Next.js error boundary reset)
- Secondary: `Link` to `/${language}`

---

## File 3 — `app/global-error.tsx`

### Behaviour

- **Must be** `"use client"`
- Catches errors in the root layout itself (ThemeProvider, font loading, etc.) — very rare in production
- **Replaces the entire page** — must include its own `<html>` and `<body>` tags
- No Header or Footer available
- Props: `{ error: Error & { digest?: string }, unstable_retry: () => void }` (per Next.js docs for global-error)

### Visual Design

Minimal — no brand shell available. Clean centred layout with base fonts (system fallbacks), a brief message, and a retry button.

- Background: warm white (`#F9F6F2` hardcoded — no CSS variables available)
- Font: `Georgia, serif` for headline; `system-ui, sans-serif` for body (next/font not available)
- Terracotta button: `#C4603A` hardcoded

### Copy

English only (language detection not feasible without layout context).

| Element | Copy |
|---|---|
| Headline | Something went wrong. |
| Subtext | An unexpected error occurred. Try again or reload the page. |
| Primary CTA | Try again |

---

## What is NOT in scope

- Custom `loading.tsx` files (separate backlog item if needed)
- Root-level `app/not-found.tsx` — the middleware redirects all unknown paths to `/{locale}/...` first, so `[language]/(routes)/not-found.tsx` catches everything. A root fallback is unnecessary.
- Sanity CMS content for error pages — framework chrome exception applies; hardcoded copy is correct here.

---

## Open questions / notes for implementation

- The secondary CTA uses `/${language}/projects` for both locales. This is safe: the middleware rewrites `/pt/projetos` → `/pt/projects`, so the `projects` directory resolves for both `pt` and `en`.
- The `x-language` header in middleware should be added to ALL `NextResponse.next()` paths where the locale is present in the pathname — including the final fall-through and the `projectsRewrite` branch.
- Dark mode: both pages inherit the ThemeProvider from the layout, so dark mode tokens apply automatically. No extra work needed.
