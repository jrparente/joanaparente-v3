# Footer Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the footer as a fully CMS-driven, asymmetric editorial layout with responsive breakpoints.

**Architecture:** Sanity singleton `footer` document drives all content. The React component receives `language` as a prop from the layout and conditionally renders each section based on CMS data presence. Desktop uses asymmetric two-column layout (brand left, utility right); mobile stacks and centers.

**Tech Stack:** Next.js 15 App Router, Sanity CMS, Tailwind CSS v4, TypeScript

**Design Spec:** `docs/superpowers/specs/2026-04-11-footer-redesign-design.md`

---

### File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `sanity/schemas/documents/footer.ts` | Modify | Add new fields, remove `message` |
| `lib/sanity/queries.ts` | Modify | Update `getFooter()` GROQ projection |
| `types/Sanity.d.ts` | Modify | Update `FooterType` |
| `components/layout/Footer.tsx` | Rewrite | New layout, CMS-driven rendering, responsive |
| `app/[language]/(routes)/layout.tsx` | Modify | Pass `language` prop to `<Footer />` |

---

### Task 1: Update Sanity Schema

**Files:**
- Modify: `sanity/schemas/documents/footer.ts`

- [ ] **Step 1: Replace the footer schema with updated fields**

Replace the entire contents of `sanity/schemas/documents/footer.ts` with:

```typescript
import { defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

export default defineType({
  name: "footer",
  title: "Footer",
  icon: EarthGlobeIcon,
  type: "document",
  fields: [
    defineField({
      name: "showLogo",
      title: "Show Logo",
      type: "boolean",
      initialValue: true,
      description: "Toggle the logo in the footer",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: 'e.g. "Algarve, Portugal". Leave empty to hide.',
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;
          return value.includes("@") || "Must be a valid email address";
        }),
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineField({
          name: "social",
          type: "object",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              title: "Platform",
            }),
            defineField({
              name: "url",
              type: "url",
              title: "URL",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "navLinks",
      title: "Navigation Links",
      type: "array",
      description:
        "Footer navigation items. Path should be the English slug (e.g. /about, /services). Localized paths are resolved automatically.",
      of: [
        defineField({
          name: "navLink",
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              title: "Label",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "path",
              type: "string",
              title: "Path",
              description: 'Relative path, e.g. "/about", "/services"',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "path" },
          },
        }),
      ],
    }),
    defineField({
      name: "legalLinks",
      title: "Legal Links",
      type: "array",
      description: "Privacy Policy, Terms, etc.",
      of: [
        defineField({
          name: "legalLink",
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              title: "Label",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "path",
              type: "string",
              title: "Path",
              description: 'Relative path, e.g. "/privacy"',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "path" },
          },
        }),
      ],
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      description:
        'Text after "© 2026". e.g. "Joana Parente". Year is added automatically.',
      initialValue: "Joana Parente",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Footer",
      media: EarthGlobeIcon,
    }),
  },
});
```

- [ ] **Step 2: Verify schema compiles**

Run: `npm run dev`

Open Sanity Studio at `http://localhost:3000/admin` and navigate to the Footer document. Confirm the new fields appear: Show Logo (toggle), Location, Email, Social Links, Navigation Links, Legal Links, Copyright Text.

- [ ] **Step 3: Commit**

```bash
git add sanity/schemas/documents/footer.ts
git commit -m "refactor(sanity): update footer schema with new CMS-driven fields

Replace message field with showLogo, location, navLinks, legalLinks,
and copyrightText. Email and socialLinks retained as-is."
```

---

### Task 2: Update TypeScript Type and GROQ Query

**Files:**
- Modify: `types/Sanity.d.ts:446-455`
- Modify: `lib/sanity/queries.ts:324-333`

- [ ] **Step 1: Update FooterType**

In `types/Sanity.d.ts`, replace the existing `FooterType` (around line 446-455):

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

- [ ] **Step 2: Update getFooter() GROQ projection**

In `lib/sanity/queries.ts`, replace the `getFooter` function (around line 324-333):

```typescript
export async function getFooter() {
  const query = groq`
    *[_type == "footer"][0] {
      showLogo,
      location,
      email,
      socialLinks,
      navLinks,
      legalLinks,
      copyrightText
    }
  `;
  return fetchSanity<FooterType>({ query });
}
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`

Expected: No type errors related to FooterType.

- [ ] **Step 4: Commit**

```bash
git add types/Sanity.d.ts lib/sanity/queries.ts
git commit -m "refactor(types): update FooterType and GROQ query for new schema"
```

---

### Task 3: Pass language prop from layout to Footer

**Files:**
- Modify: `app/[language]/(routes)/layout.tsx:245`
- Modify: `components/layout/Footer.tsx` (prop type only — full rewrite in Task 4)

- [ ] **Step 1: Update Footer component signature to accept language**

In `components/layout/Footer.tsx`, update the function signature. For now, just accept the prop — full rewrite happens in Task 4:

Replace the current component with this temporary version that accepts `language` but preserves existing behavior as a bridge:

```typescript
import Link from "next/link";
import {
  MailIcon,
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
} from "lucide-react";
import { getFooter } from "@/lib/sanity/queries";
import { ThemeToggle } from "./ThemeToggle";

const iconMap: Record<string, React.ReactNode> = {
  GitHub: <GithubIcon className="h-5 w-5" />,
  LinkedIn: <LinkedinIcon className="h-5 w-5" />,
  Instagram: <InstagramIcon className="h-5 w-5" />,
};

type FooterProps = {
  language: string;
};

export default async function Footer({ language }: FooterProps) {
  const footer = await getFooter();

  if (!footer) {
    return (
      <footer className="w-full border-t border-border bg-background py-8">
        <div className="max-w-screen-xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Joana Parente</p>
        </div>
      </footer>
    );
  }

  const { email, socialLinks } = footer;
  const copyrightText = footer.copyrightText ?? "Joana Parente";
  return (
    <footer className="w-full border-t border-border bg-background py-8">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <p>
            &copy; {new Date().getFullYear()} {copyrightText}
          </p>
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-4">
          {email && (
            <Link
              href={`mailto:${email}`}
              className="hover:text-primary transition"
            >
              <MailIcon className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Link>
          )}
          {socialLinks?.map((link) => (
            <Link
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition"
            >
              {iconMap[link.platform] ?? link.platform}
              <span className="sr-only">{link.platform}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Pass language from layout**

In `app/[language]/(routes)/layout.tsx`, find line 245:

```tsx
<Footer />
```

Replace with:

```tsx
<Footer language={language} />
```

- [ ] **Step 3: Verify the site still renders**

Run: `npm run dev`

Open `http://localhost:3000/en` and `http://localhost:3000/pt`. Confirm footer renders without errors.

- [ ] **Step 4: Commit**

```bash
git add components/layout/Footer.tsx "app/[language]/(routes)/layout.tsx"
git commit -m "refactor(footer): accept language prop from layout"
```

---

### Task 4: Rewrite Footer Component

**Files:**
- Rewrite: `components/layout/Footer.tsx`

- [ ] **Step 1: Write the full footer component**

Replace the entire contents of `components/layout/Footer.tsx`:

```tsx
import Link from "next/link";
import {
  MailIcon,
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
} from "lucide-react";
import { getFooter } from "@/lib/sanity/queries";
import { localizedPath } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { LogoIcon } from "./LogoIcon";
import { LogoWordmark } from "./LogoWordmark";

const iconMap: Record<string, React.ReactNode> = {
  GitHub: <GithubIcon className="h-4 w-4" />,
  LinkedIn: <LinkedinIcon className="h-4 w-4" />,
  Instagram: <InstagramIcon className="h-4 w-4" />,
};

type FooterProps = {
  language: string;
};

function resolveFooterPath(path: string, language: string): string {
  // Strip leading slash, translate segment, rebuild
  const segment = path.replace(/^\//, "");
  const translated = localizedPath(segment, language);
  return `/${language}/${translated}`;
}

export default async function Footer({ language }: FooterProps) {
  const footer = await getFooter();
  const currentYear = new Date().getFullYear();

  if (!footer) {
    return (
      <footer className="w-full border-t border-border py-8">
        <div className="max-w-screen-xl mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>&copy; {currentYear} Joana Parente</p>
        </div>
      </footer>
    );
  }

  const {
    showLogo = true,
    location,
    email,
    socialLinks,
    navLinks,
    legalLinks,
    copyrightText = "Joana Parente",
  } = footer;

  return (
    <footer className="w-full border-t border-border py-8 md:py-10 lg:py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* ── Top section: asymmetric on md+, centered stack on mobile ── */}
        <div className="flex flex-col items-center text-center md:flex-row md:items-start md:justify-between md:text-left">
          {/* Left column: brand identity */}
          <div className="flex flex-col items-center gap-1 md:items-start md:gap-1.5">
            {showLogo && (
              <div aria-hidden="true">
                <LogoIcon className="h-8 w-auto md:hidden" />
                <LogoWordmark className="h-8 w-auto hidden md:block" />
              </div>
            )}
            {location && (
              <p className="text-sm text-muted-foreground/70">{location}</p>
            )}
            {/* Email: visible on md+ in left column, on mobile after social links */}
            {email && (
              <Link
                href={`mailto:${email}`}
                aria-label={`Send email to ${email}`}
                className="hidden md:inline-block text-sm text-muted-foreground border-b border-border hover:text-foreground hover:border-muted-foreground transition-colors duration-200"
              >
                {email}
              </Link>
            )}
          </div>

          {/* Right column: utility */}
          <div className="flex flex-col items-center gap-4 mt-5 md:items-end md:gap-3 md:mt-0">
            {navLinks && navLinks.length > 0 && (
              <nav aria-label="Footer navigation">
                <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:justify-end md:gap-x-5 lg:gap-x-7">
                  {navLinks.map((link) => (
                    <li key={link.path}>
                      <Link
                        href={resolveFooterPath(link.path, language)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 min-h-[44px] inline-flex items-center md:min-h-0"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex gap-4 md:gap-4 lg:gap-5">
                {socialLinks.map((link) => (
                  <Link
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.platform} (opens in new tab)`}
                    className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors duration-200 inline-flex items-center gap-1 min-h-[44px] md:min-h-0"
                  >
                    {iconMap[link.platform] ?? null}
                    <span>{link.platform}</span>
                    <span aria-hidden="true">&#8599;</span>
                  </Link>
                ))}
              </div>
            )}
            {/* Email on mobile only — appears after social links */}
            {email && (
              <Link
                href={`mailto:${email}`}
                aria-label={`Send email to ${email}`}
                className="md:hidden text-sm text-muted-foreground border-b border-border hover:text-foreground hover:border-muted-foreground transition-colors duration-200 min-h-[44px] inline-flex items-center"
              >
                {email}
              </Link>
            )}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-6 pt-4 md:mt-6 md:pt-4 lg:mt-8 lg:pt-5 border-t border-border flex flex-col items-center gap-2 md:flex-row md:justify-between md:gap-0">
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <p className="text-xs text-muted-foreground/70">
              &copy; {currentYear} {copyrightText}
            </p>
          </div>
          {legalLinks && legalLinks.length > 0 && (
            <div className="flex gap-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  href={resolveFooterPath(link.path, language)}
                  className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors duration-200 min-h-[44px] inline-flex items-center md:min-h-0"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify the component renders**

Run: `npm run dev`

Open `http://localhost:3000/en`. The footer will look minimal until CMS content is seeded (Task 5), but it should render without errors — fallback copyright should appear.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "feat(footer): rewrite with asymmetric editorial layout

CMS-driven rendering: logo toggle, location, email, nav links,
social links, legal links, copyright text. Responsive: asymmetric
on md+, centered stack on mobile. All content conditional on
CMS data presence."
```

---

### Task 5: Seed CMS Content

**Files:**
- No code files — Sanity Studio content update

- [ ] **Step 1: Open Sanity Studio and update the footer document**

Navigate to `http://localhost:3000/admin` and open the Footer document.

Set the following field values:

| Field | Value |
|-------|-------|
| Show Logo | `true` (checked) |
| Location | `Algarve, Portugal` |
| Email | `hello@joanaparente.com` |
| Copyright Text | `Joana Parente` |

Social Links (keep existing, ensure these are present):

| Platform | URL |
|----------|-----|
| LinkedIn | `https://www.linkedin.com/in/joanaparente/` |
| GitHub | `https://github.com/jrparente` |

Navigation Links (add in this order):

| Label | Path |
|-------|------|
| About | `/about` |
| Services | `/services` |
| Portfolio | `/projects` |
| Contact | `/contact` |

Legal Links:

| Label | Path |
|-------|------|
| Privacy Policy | `/privacy` |
| Terms | `/terms` |

- [ ] **Step 2: Publish the document**

Click "Publish" in Sanity Studio.

- [ ] **Step 3: Verify the footer renders with full content**

Open `http://localhost:3000/en` — verify:
- Logo wordmark visible (desktop)
- "Algarve, Portugal" below logo
- "hello@joanaparente.com" with underline below location
- Nav links right-aligned: About, Services, Portfolio, Contact
- Social links right-aligned below nav: LinkedIn ↗, GitHub ↗
- Bottom bar: theme toggle, "© 2026 Joana Parente", "Privacy Policy", "Terms"

Open `http://localhost:3000/pt` — verify:
- Nav links resolve correctly: About → `/pt/about`, Services → `/pt/services`, Portfolio → `/pt/projetos`, Contact → `/pt/contacto`

Resize browser to mobile width (<768px) — verify:
- Layout centers and stacks vertically
- Logo switches to monogram icon
- Email appears after social links
- Touch targets are appropriately sized

- [ ] **Step 4: Verify dark mode**

Toggle theme to dark. Verify:
- Logo colors invert correctly (terracotta/ink → white/terracotta)
- All text remains readable
- Border colors adapt

- [ ] **Step 5: Commit (if any code adjustments were needed)**

If any tweaks were made during verification:

```bash
git add -A
git commit -m "fix(footer): adjustments from visual QA"
```

---

### Task 6: Final Verification

- [ ] **Step 1: Run the build**

Run: `npm run build`

Expected: Build completes without errors.

- [ ] **Step 2: Run linting**

Run: `npm run lint`

Expected: No new lint errors.

- [ ] **Step 3: Test CMS toggle — hide the logo**

In Sanity Studio, uncheck "Show Logo" and publish. Verify the footer renders without the logo — the location should now be the first element in the left column. Re-enable it after testing.

- [ ] **Step 4: Test CMS toggle — remove optional fields**

In Sanity Studio, clear the Location field and publish. Verify the footer still renders cleanly without a location line. Restore it after testing.

- [ ] **Step 5: Commit any final fixes**

```bash
git add -A
git commit -m "chore(footer): final QA adjustments"
```
