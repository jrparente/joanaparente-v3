# /card Page — Design Spec
**Date**: 2026-04-14
**Route**: `joanaparente.com/card`
**Status**: Approved — ready for implementation planning

---

## Purpose

A locale-free utility page linked from the QR code on Joana's business card. The visitor is on their phone, likely at an event or shortly after. Goal: get the contact saved as fast as possible, with enough context to remember who she is.

Not indexed. Not part of the i18n routing system. No site navigation or footer.

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Layout | Card-style — elevated warm-linen card, actions at bottom | Polished; suited to a digital card presentation |
| Language default | `en` | Networking context is international |
| Language detection | `Accept-Language` header on server | No flash of wrong language; standard HTTP negotiation |
| Language toggle | EN/PT inline toggle | Manual override always available |
| Dark mode | Respect system/site preference | Uses existing token system; no forced light mode |
| Nav chrome | Logo (top left) + language toggle (top right) | Minimal; no site nav, no footer |
| Contact links | Clickable rows (email, website, LinkedIn) | Open in new tab; icons from Lucide |
| Save Contact | Downloads `.vcf` via `/api/vcard` | Universal mobile support; no app dependency |
| Visit Website | Outline button → joanaparente.com | Secondary action |
| CMS system | `documentInternationalization` plugin | Consistent with all other documents in the project |
| Button labels | Translated per language document | CMS-managed, not hardcoded |

---

## CMS Schema

### `cardPage` document

Added to `documentInternationalization` plugin alongside existing types. Two language documents — `language: "en"` and `language: "pt"` — each with a `translation.metadata` document linking them (required for Studio Translations panel and sitemap stability).

**Fields:**

| Field | Type | Translated? | Notes |
|---|---|---|---|
| `name` | string | No | Same across both docs; displayed on page + vCard FN field |
| `tagline` | string | No | Brand line; same across both docs |
| `oneliner` | string | Yes | One grounding sentence below the tagline |
| `saveContactLabel` | string | Yes | CTA button label; fallback: "Save Contact" / "Guardar contacto" |
| `visitWebsiteLabel` | string | Yes | Secondary button label; fallback: "Visit Website" / "Visitar website" |
| `links` | array of `link` | No | Email (mailto:), website, LinkedIn — same across both |
| `jobTitle` | string | No | vCard TITLE field only |
| `location` | string | No | vCard ADR field only; e.g. "Faro, Portugal" |
| `language` | string | — | readOnly; managed by plugin |

**Plugin registration:** add `"cardPage"` to `schemaTypes` in `sanity/sanity.config.ts`.

**Studio structure:** single "Card Page (/card)" sidebar entry (same pattern as Cookie Banner). Plugin adds the Translations panel automatically.

### Content to seed

| Field | EN value | PT value |
|---|---|---|
| name | Joana Parente | Joana Parente |
| tagline | Strategist who codes. | Strategist who codes. |
| oneliner | I build websites for businesses that take their online presence seriously. | Crio websites para negócios que levam a sua presença online a sério. |
| saveContactLabel | Save Contact | Guardar contacto |
| visitWebsiteLabel | Visit Website | Visitar website |
| links | Email: `mailto:hello@joanaparente.com`, Website: `https://joanaparente.com`, LinkedIn: `https://linkedin.com/in/joana-parente` | (same) |
| jobTitle | Web Designer & Strategist | Web Designer & Strategist |
| location | Faro, Portugal | Faro, Portugal |

**Must also create:** `translation.metadata` document linking the EN and PT `cardPage` docs.

---

## TypeScript Type

```typescript
// types/Sanity.d.ts
export type CardPageType = {
  name: string;
  tagline: string;
  oneliner?: string;
  saveContactLabel?: string;
  visitWebsiteLabel?: string;
  links?: LinkType[];
  jobTitle?: string;
  location?: string;
  language?: string;
};
```

---

## GROQ Query

```typescript
// lib/sanity/queries.ts
export async function getCardPage(language: string) {
  const query = groq`
    *[_type == "cardPage" && language == $language][0] {
      name,
      tagline,
      oneliner,
      saveContactLabel,
      visitWebsiteLabel,
      links[] ${linkProjection},
      jobTitle,
      location
    }
  `;
  return fetchSanity<CardPageType>({ query, params: { language }, tags: ["cardPage"] });
}
```

---

## Middleware

Two changes to `middleware.ts`, following the existing `/bio` pattern:

**1. Bail-early block** (after the `/bio` bail-early):
```typescript
if (pathname === "/card") {
  return NextResponse.next();
}
```

**2. Matcher exclusion** — add `card` to the existing regex:
```typescript
matcher: [
  "/((?!api|_next|.*\\..*|admin|sitemap.xml|webhook|sentry-example-page|bio|card).*)",
],
```

---

## Server Component

**File:** `app/(routes)/card/page.tsx`

Inherits from `app/(routes)/layout.tsx`: fonts (Fraunces + Plus Jakarta Sans) + ThemeProvider. No Header, no Footer, no Cookie Banner, no GA scripts — exactly right for a utility page.

```typescript
import { headers } from "next/headers";
import { getCardPage } from "@/lib/sanity/queries";
import CardClient from "./CardClient";

export const metadata = {
  title: "Joana Parente",
  description: "Strategist who codes.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.joanaparente.com/card" },
};

export default async function CardPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") ?? "";
  const detectedLocale = acceptLanguage.toLowerCase().includes("pt") ? "pt" : "en";

  const [dataEn, dataPt] = await Promise.all([
    getCardPage("en"),
    getCardPage("pt"),
  ]);

  if (!dataEn && !dataPt) return null;

  return (
    <CardClient
      dataEn={dataEn}
      dataPt={dataPt}
      detectedLocale={detectedLocale}
    />
  );
}
```

**Notes:**
- `headers()` is async in Next.js 15 — must `await`
- `headers()` makes the page dynamically rendered — intentional: low-traffic utility page, no-flash UX matters more than ISR
- Both documents fetched in parallel; null-checked before rendering

---

## Client Component

**File:** `app/(routes)/card/CardClient.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Globe, Linkedin } from "lucide-react";
import { LogoIcon } from "@/components/layout/LogoIcon";
import { CardPageType, LinkType } from "@/types/Sanity";
import { resolveLink } from "@/lib/utils";

interface Props {
  dataEn: CardPageType | null;
  dataPt: CardPageType | null;
  detectedLocale: "en" | "pt";
}

export default function CardClient({ dataEn, dataPt, detectedLocale }: Props) {
  const [locale, setLocale] = useState<"en" | "pt">(detectedLocale);
  const data = locale === "pt" ? dataPt ?? dataEn : dataEn ?? dataPt;

  // Keep <html lang> in sync with active locale
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  if (!data) return null;

  const saveLabel =
    data.saveContactLabel ?? (locale === "pt" ? "Guardar contacto" : "Save Contact");
  const visitLabel =
    data.visitWebsiteLabel ?? (locale === "pt" ? "Visitar website" : "Visit Website");

  return (
    <main className="relative z-[1] min-h-screen bg-background flex flex-col items-center px-6 pt-8 pb-12">
      {/* Header */}
      <div className="w-full max-w-[360px] flex items-center justify-between mb-7">
        <Link href="/" aria-label="Joana Parente — Homepage">
          <LogoIcon className="h-7 w-auto" />
        </Link>

        {/* Language toggle — NOT .lang-btn (that's the underline nav style) */}
        <div className="flex gap-0.5" role="group" aria-label="Language">
          {(["en", "pt"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              aria-pressed={locale === l}
              className={
                locale === l
                  ? "bg-brand text-white text-[11px] font-semibold tracking-[0.5px] px-2 py-1 rounded cursor-default"
                  : "text-text-subtle text-[11px] font-semibold tracking-[0.5px] px-2 py-1 rounded hover:text-foreground transition-colors"
              }
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-[360px] bg-card border border-border rounded-[16px] px-6 pt-7 pb-6">

        {/* Identity */}
        <div className="text-center mb-5">
          <h1 className="font-heading font-medium text-[22px] tracking-[-0.2px] text-foreground">
            {data.name}
          </h1>
          <p className="font-semibold text-[11px] tracking-[0.6px] text-brand mt-1">
            {data.tagline}
          </p>
          {data.oneliner && (
            <p className="text-[12px] leading-[1.55] text-muted-foreground mt-2 px-2">
              {data.oneliner}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border my-5" />

        {/* Contact links */}
        {data.links && data.links.length > 0 && (
          <ul className="mb-5" aria-label="Contact links">
            {data.links.map((link, i) => (
              <LinkRow key={i} link={link} />
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <a
            href="/api/vcard"
            download="joana-parente.vcf"
            className="block w-full py-[13px] bg-brand text-white text-[13px] font-semibold text-center rounded-[10px] hover:opacity-[0.88] transition-opacity"
          >
            {saveLabel}
          </a>
          <a
            href="https://joanaparente.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 border-[1.5px] border-brand text-brand text-[13px] font-medium text-center rounded-[10px] hover:bg-brand/[0.06] transition-colors"
          >
            {visitLabel}
          </a>
        </div>
      </div>
    </main>
  );
}

function LinkRow({ link }: { link: LinkType }) {
  const href = resolveLink(link);
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 py-2.5 border-b border-border last:border-0 text-[13px] text-foreground hover:text-brand transition-colors"
      >
        <LinkIcon href={href} />
        <span>{link.label}</span>
      </a>
    </li>
  );
}

function LinkIcon({ href }: { href: string }) {
  const cls = "size-4 shrink-0 text-brand";
  if (href.startsWith("mailto:")) return <Mail className={cls} />;
  if (href.includes("linkedin")) return <Linkedin className={cls} />;
  return <Globe className={cls} />;
}
```

**Notes:**
- `locale === "pt" ? dataPt ?? dataEn : dataEn ?? dataPt` — graceful fallback if one language doc is missing
- `useEffect` updates `document.documentElement.lang` on toggle
- Button label fallbacks hardcoded for resilience if CMS fields are empty
- `last:border-0` removes divider from last link row
- `relative z-[1]` on `<main>` — required to sit above the `body::before` grain overlay
- All links open in new tab (they're external: email, website, LinkedIn)
- Language toggle uses `aria-pressed` for accessibility; does NOT use `.lang-btn` CSS class (that's the underline style for the site header nav)

---

## vCard API Route

**File:** `app/api/vcard/route.ts`

Fetches the EN document (name, jobTitle, location, links are language-agnostic). Returns RFC 6350 compliant VCF with `\r\n` line endings and `Cache-Control: no-store`.

```typescript
import { getCardPage } from "@/lib/sanity/queries";

export async function GET() {
  const data = await getCardPage("en");

  if (!data) {
    return new Response(null, { status: 404 });
  }

  const emailLink = data.links?.find((l) => l.external?.startsWith("mailto:"));
  const linkedinLink = data.links?.find((l) => l.external?.includes("linkedin"));
  const websiteLink = data.links?.find(
    (l) =>
      l.type === "external" &&
      !l.external?.startsWith("mailto:") &&
      !l.external?.includes("linkedin")
  );

  const email = emailLink?.external?.replace("mailto:", "") ?? "";
  const website = websiteLink?.external ?? "https://joanaparente.com";
  const linkedin = linkedinLink?.external ?? "";
  const nameParts = (data.name ?? "").split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") ?? "";

  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${data.name ?? ""}`,
    `N:${lastName};${firstName};;;`,
    data.jobTitle ? `TITLE:${data.jobTitle}` : null,
    data.jobTitle ? `ORG:${data.name ?? ""}` : null,
    email ? `EMAIL;TYPE=INTERNET:${email}` : null,
    website ? `URL:${website}` : null,
    linkedin ? `X-SOCIALPROFILE;TYPE=linkedin:${linkedin}` : null,
    data.location ? `ADR:;;${data.location};;;;` : null,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");

  return new Response(vcf, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="joana-parente.vcf"',
      "Cache-Control": "no-store",
    },
  });
}
```

**Notes:**
- vCard VERSION 3.0 — widest iOS/Android support
- `\r\n` line endings required by RFC 6350
- `fetchSanity` is safe in route handlers (only throws in Server Actions)
- `Cache-Control: no-store` — contact info may change; always fetch fresh

---

## Visual Reference

Prototype: `projects/joana-website/technical/prototypes/card-prototype.html`

During implementation, open the prototype in a browser as a side-by-side reference. The prototype is the pixel-precise visual target — if the code doesn't match it, the code is wrong.

### Token mapping (prototype → codebase)

| Prototype CSS var | Tailwind token | Dark mode |
|---|---|---|
| `--color-surface` (page bg) | `bg-background` | `oklch(0.12 0.02 55)` |
| `--color-surface-elevated` (card) | `bg-card` | `oklch(0.16 0.02 55)` |
| `--color-border` | `border-border` | `oklch(0.28 0.03 55)` |
| `--color-brand` | `text-brand` / `bg-brand` | `oklch(0.65 0.11 42)` |
| `--color-text` | `text-foreground` | `oklch(0.92 0.01 80)` |
| `--color-text-muted` | `text-muted-foreground` | `oklch(0.58 0.04 60)` |
| `--color-text-subtle` | `text-text-subtle` | `oklch(0.50 0.04 55)` |

No new CSS tokens or overrides needed — all dark mode pairs are already defined.

---

## Files to Create / Modify

| File | Action |
|---|---|
| `sanity/schemas/documents/cardPage.ts` | Create |
| `sanity/schemas/index.ts` | Add import + register |
| `sanity/sanity.config.ts` | Add `"cardPage"` to plugin `schemaTypes` |
| `sanity/structure/index.ts` | Add "Card Page (/card)" sidebar entry |
| `types/Sanity.d.ts` | Add `CardPageType` |
| `lib/sanity/queries.ts` | Add `getCardPage(language)` |
| `app/(routes)/card/page.tsx` | Create — server component |
| `app/(routes)/card/CardClient.tsx` | Create — client component |
| `app/api/vcard/route.ts` | Create — vCard download |
| `middleware.ts` | Bail-early + matcher exclusion for `/card` |

**Post-code step:** seed EN + PT documents in Sanity Studio + create `translation.metadata` document linking them.

---

## What This Is NOT

- Not indexed (`robots: noindex`)
- Not part of the i18n routing system
- No site navigation or footer
- No analytics tracking
- No sitemap entry
