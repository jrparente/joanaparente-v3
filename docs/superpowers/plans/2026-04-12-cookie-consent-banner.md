# Cookie Consent Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an EU-compliant cookie consent banner with vanilla-cookieconsent, Sanity CMS content, Google Consent Mode v2, and design system styling.

**Architecture:** vanilla-cookieconsent library initialized by a thin React client component that receives CMS content as props. GA4 loads via manual next/script tags with consent defaulting to denied. Footer intercepts `#cookie-settings` anchor links to reopen the banner.

**Tech Stack:** vanilla-cookieconsent 3.1.0, Next.js 15 (App Router), Sanity CMS, Tailwind CSS v4, next/script

**Spec:** `docs/superpowers/specs/2026-04-12-cookie-consent-banner-design.md`

---

### Task 1: Install vanilla-cookieconsent

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

```bash
npm install vanilla-cookieconsent@3.1.0
```

- [ ] **Step 2: Verify installation**

```bash
npm list vanilla-cookieconsent
```

Expected: `vanilla-cookieconsent@3.1.0`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install vanilla-cookieconsent 3.1.0"
```

---

### Task 2: Create Sanity schema and register it

**Files:**
- Create: `sanity/schemas/documents/cookieBanner.ts`
- Modify: `sanity/schemas/index.ts`
- Modify: `sanity/sanity.config.ts`
- Modify: `sanity/structure/index.ts`

- [ ] **Step 1: Create the cookieBanner schema**

Create `sanity/schemas/documents/cookieBanner.ts`:

```ts
import { defineField, defineType } from "sanity";
import { CookieIcon } from "@sanity/icons";

export default defineType({
  name: "cookieBanner",
  title: "Cookie Banner",
  icon: CookieIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Banner Title",
      type: "string",
      description: 'Heading shown on the cookie banner. e.g. "We use cookies"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Banner Description",
      type: "string",
      description:
        "Body text explaining what cookies are used for and what the user can do.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "acceptLabel",
      title: "Accept Button Label",
      type: "string",
      description: 'Text for the accept button. e.g. "Accept"',
      initialValue: "Accept",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rejectLabel",
      title: "Reject Button Label",
      type: "string",
      description: 'Text for the reject button. e.g. "Reject"',
      initialValue: "Reject",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "privacyPolicyLink",
      title: "Privacy Policy Link",
      type: "link",
      description: "Link to the Privacy Policy page, shown in the banner text.",
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      language: "language",
    },
    prepare: ({ language }) => ({
      title: `Cookie Banner${language ? ` (${language.toUpperCase()})` : ""}`,
      media: CookieIcon,
    }),
  },
});
```

- [ ] **Step 2: Register the schema in the index**

In `sanity/schemas/index.ts`, add the import after the footer import (line 12):

```ts
import cookieBanner from "./documents/cookieBanner";
```

Add `cookieBanner` to the types array after `footer` (line 49):

```ts
    footer,
    cookieBanner,
    project,
```

- [ ] **Step 3: Add cookieBanner to the i18n plugin**

In `sanity/sanity.config.ts`, add `"cookieBanner"` to the `schemaTypes` array (line 26):

```ts
  documentInternationalization({
    supportedLanguages: i18n.languages,
    schemaTypes: ["homepage", "page", "site", "navigation", "footer", "cookieBanner", "project", "blogPost"],
  }),
```

- [ ] **Step 4: Add cookieBanner to the desk structure**

In `sanity/structure/index.ts`, add `CookieIcon` to the existing `@sanity/icons` import (line 2-10):

```ts
import {
  HomeIcon,
  CogIcon,
  MenuIcon,
  BillIcon,
  BasketIcon,
  DocumentsIcon,
  ComposeIcon,
  PackageIcon,
  CookieIcon,
} from "@sanity/icons";
```

Then add the cookie banner entry after the Footer entry (after line 198):

```ts
      S.listItem()
        .title("Cookie Banner")
        .icon(CookieIcon)
        .child(
          S.document().schemaType("cookieBanner").documentId("cookieBanner")
        ),
```

- [ ] **Step 5: Verify Studio loads without errors**

```bash
npm run dev
```

Open `http://localhost:3000/admin` and verify:
- "Cookie Banner" appears in the sidebar
- Clicking it opens the document editor with all 5 fields
- No console errors

- [ ] **Step 6: Commit**

```bash
git add sanity/schemas/documents/cookieBanner.ts sanity/schemas/index.ts sanity/sanity.config.ts sanity/structure/index.ts
git commit -m "feat(sanity): add cookieBanner schema with i18n and desk structure"
```

---

### Task 3: Add TypeScript type and GROQ query

**Files:**
- Modify: `types/Sanity.d.ts`
- Modify: `lib/sanity/queries.ts`

- [ ] **Step 1: Add the CookieBannerType**

In `types/Sanity.d.ts`, add after `FooterType` (after line 465):

```ts
export type CookieBannerType = {
  _id: string;
  _type: "cookieBanner";
  title: string;
  description: string;
  acceptLabel: string;
  rejectLabel: string;
  privacyPolicyLink?: LinkType;
};
```

- [ ] **Step 2: Add the getCookieBanner query**

In `lib/sanity/queries.ts`, add the import for `CookieBannerType` to the existing import from `@/types/Sanity` (if not already importing all types), then add after the `getFooter` function (after line 338):

```ts
export async function getCookieBanner(language: string) {
  const query = groq`
    *[_type == "cookieBanner" && language == $language][0] {
      title,
      description,
      acceptLabel,
      rejectLabel,
      privacyPolicyLink ${linkProjection}
    }
  `;
  return fetchSanity<CookieBannerType>({ query, params: { language } });
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors related to CookieBannerType or getCookieBanner.

- [ ] **Step 4: Commit**

```bash
git add types/Sanity.d.ts lib/sanity/queries.ts
git commit -m "feat(data): add CookieBanner type and GROQ query"
```

---

### Task 4: Replace GoogleAnalytics with Consent Mode v2 scripts

**Files:**
- Modify: `app/[language]/(routes)/layout.tsx`

- [ ] **Step 1: Add the Script import**

In `app/[language]/(routes)/layout.tsx`, add at the top with the other imports:

```ts
import Script from "next/script";
```

- [ ] **Step 2: Remove the GoogleAnalytics import**

Remove this line (line 10):

```ts
import { GoogleAnalytics } from "@next/third-parties/google";
```

- [ ] **Step 3: Replace the GoogleAnalytics component**

Replace line 250:

```tsx
{gaId && <GoogleAnalytics gaId={gaId} />}
```

With two `next/script` tags. The first uses `strategy="beforeInteractive"` with an inline script that:
- Initializes `window.dataLayer` and defines the `gtag()` function
- Sets consent defaults to `denied` for all four signals (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`) with `wait_for_update: 500`
- Calls `gtag('js', new Date())` and `gtag('config', gaId)`

The second loads the external gtag.js script with `strategy="afterInteractive"`:

```
src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
```

**Note:** The `gaId` value comes from `process.env.NEXT_PUBLIC_GA4_ID` (a server-side environment variable, not user input), making the inline script safe.

- [ ] **Step 4: Verify the page loads and GA4 consent state is denied**

```bash
npm run dev
```

Open `http://localhost:3000` in Chrome. Open DevTools > Console and run:

```js
dataLayer.filter(e => e[0] === 'consent')
```

You should see the consent default with all values `denied`. In the Network tab, check for `google-analytics.com` requests — they should include `gcs=G100` (all denied) in the payload.

- [ ] **Step 5: Commit**

```bash
git add "app/[language]/(routes)/layout.tsx"
git commit -m "feat(analytics): replace GoogleAnalytics with Consent Mode v2 scripts"
```

---

### Task 5: Create the CookieBanner component

**Files:**
- Create: `components/consent/CookieBanner.tsx`

- [ ] **Step 1: Create the component**

Create `components/consent/CookieBanner.tsx` as a `"use client"` component that:

1. Imports `vanilla-cookieconsent/dist/cookieconsent.css` and `* as CookieConsent from "vanilla-cookieconsent"`
2. Accepts props matching the CMS fields:
   ```ts
   interface CookieBannerProps {
     title: string;
     description: string;
     acceptLabel: string;
     rejectLabel: string;
     privacyPolicyLink?: LinkType;
     language: string;
   }
   ```
3. In a `useEffect` with all props as dependencies, calls `CookieConsent.run()` with:

   **guiOptions:**
   - `consentModal.layout`: `"cloud inline"`
   - `consentModal.position`: `"bottom center"`
   - `consentModal.equalWeightButtons`: `true`
   - `consentModal.flipButtons`: `false`

   **categories:**
   - `necessary`: `{ enabled: true, readOnly: true }`
   - `analytics`: `{ autoClear: { cookies: [{ name: /^_ga/ }, { name: "_gid" }] } }`

   **language.translations:** Uses the `language` prop as the key, populates `consentModal` and `preferencesModal` from CMS props. The description should append the privacy policy link as an `<a>` tag using `resolveLink(privacyPolicyLink, language)`.

   **preferencesModal sections:** Two sections — "Strictly necessary cookies" (linkedCategory: `"necessary"`) and "Analytics cookies" (linkedCategory: `"analytics"`) with a `cookieTable` listing `_ga` (2 years) and `_gid` (24 hours). The preferences modal labels for Save/Close use simple PT/EN conditionals since they're not in the CMS schema (edge-case UI, rarely seen).

   **Callbacks:** `onFirstConsent`, `onConsent`, and `onChange` all call a `updateGtagConsent()` function that:
   ```ts
   function updateGtagConsent() {
     if (typeof window.gtag !== "function") return;
     const analyticsAccepted = CookieConsent.acceptedCategory("analytics");
     window.gtag("consent", "update", {
       analytics_storage: analyticsAccepted ? "granted" : "denied",
       ad_storage: "denied",
       ad_user_data: "denied",
       ad_personalization: "denied",
     });
   }
   ```

4. Declares `window.gtag` on the global `Window` interface
5. Returns `null` (the library manages its own DOM)

- [ ] **Step 2: Commit**

```bash
git add components/consent/CookieBanner.tsx
git commit -m "feat(consent): create CookieBanner component with vanilla-cookieconsent"
```

---

### Task 6: Wire CookieBanner into the layout

**Files:**
- Modify: `app/[language]/(routes)/layout.tsx`

- [ ] **Step 1: Add imports**

Add these imports at the top of `app/[language]/(routes)/layout.tsx`:

```ts
import CookieBanner from "@/components/consent/CookieBanner";
import { getCookieBanner } from "@/lib/sanity/queries";
```

- [ ] **Step 2: Fetch cookie banner data**

Inside the `RootLayout` function, after `const navigation = await getNavigation(language);` (line 219), add:

```ts
  const cookieBanner = await getCookieBanner(language);
```

- [ ] **Step 3: Render the CookieBanner component**

Inside the `<ThemeProvider>` block, after the closing `</div>` of the main flex container (after line 246) and before the closing `</ThemeProvider>`, add:

```tsx
          {cookieBanner && (
            <CookieBanner
              title={cookieBanner.title}
              description={cookieBanner.description}
              acceptLabel={cookieBanner.acceptLabel}
              rejectLabel={cookieBanner.rejectLabel}
              privacyPolicyLink={cookieBanner.privacyPolicyLink}
              language={language}
            />
          )}
```

The `<ThemeProvider>` block should look like:

```tsx
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-[100dvh] flex-col">
            <Header navigation={navigation} language={language} />
            <div id="main-content" className="flex-1">{children}</div>
            <Footer language={language} />
          </div>
          {cookieBanner && (
            <CookieBanner
              title={cookieBanner.title}
              description={cookieBanner.description}
              acceptLabel={cookieBanner.acceptLabel}
              rejectLabel={cookieBanner.rejectLabel}
              privacyPolicyLink={cookieBanner.privacyPolicyLink}
              language={language}
            />
          )}
        </ThemeProvider>
```

- [ ] **Step 4: Verify the page loads without errors**

```bash
npm run dev
```

Open `http://localhost:3000`. No banner will show yet (no CMS data until Task 8), but there should be no console errors.

- [ ] **Step 5: Commit**

```bash
git add "app/[language]/(routes)/layout.tsx"
git commit -m "feat(layout): wire CookieBanner into route layout with CMS data"
```

---

### Task 7: Add CSS overrides for design system

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Verify the exact CSS custom property names**

Before adding overrides, check the top of `app/globals.css` to confirm the exact variable names for: surface color, brand color, brand-dark, text color, text-muted, border, shadow-lg. The overrides below use the names found during exploration — adjust if they differ.

- [ ] **Step 2: Add vanilla-cookieconsent CSS overrides**

Append to the end of `app/globals.css`:

```css
/* --- Cookie Consent Banner ------------------------------------------------ */

#cc-main {
  --cc-font-family: var(--font-sans), "Plus Jakarta Sans", sans-serif;
  --cc-modal-border-radius: var(--radius-lg);
  --cc-btn-border-radius: var(--radius-md);
  --cc-z-index: 40;

  --cc-bg: var(--color-surface);
  --cc-primary-color: var(--color-text);
  --cc-secondary-color: var(--color-text-muted);

  --cc-btn-primary-bg: var(--color-brand);
  --cc-btn-primary-color: #fff;
  --cc-btn-primary-border-color: var(--color-brand);
  --cc-btn-primary-hover-bg: var(--color-brand-dark);
  --cc-btn-primary-hover-color: #fff;
  --cc-btn-primary-hover-border-color: var(--color-brand-dark);

  --cc-btn-secondary-bg: var(--color-surface-elevated);
  --cc-btn-secondary-color: var(--color-text);
  --cc-btn-secondary-border-color: var(--color-border);
  --cc-btn-secondary-hover-bg: var(--color-surface-sunken);
  --cc-btn-secondary-hover-color: var(--color-text);
  --cc-btn-secondary-hover-border-color: var(--color-border);

  --cc-toggle-on-bg: var(--color-brand);
  --cc-toggle-off-bg: var(--color-border);
  --cc-toggle-readonly-bg: var(--color-accent);

  --cc-separator-border-color: var(--color-border);
  --cc-cookie-category-block-bg: var(--color-surface-elevated);
  --cc-link-color: var(--color-brand);
  --cc-overlay-bg: rgba(30, 23, 19, 0.35);
}

.dark #cc-main {
  --cc-bg: var(--color-surface);
  --cc-primary-color: var(--color-text);
  --cc-secondary-color: var(--color-text-muted);

  --cc-btn-primary-bg: var(--color-brand);
  --cc-btn-primary-border-color: var(--color-brand);
  --cc-btn-primary-hover-bg: var(--color-brand-light);
  --cc-btn-primary-hover-border-color: var(--color-brand-light);
  --cc-btn-primary-hover-color: var(--color-text);

  --cc-btn-secondary-bg: var(--color-surface-elevated);
  --cc-btn-secondary-border-color: var(--color-border);
  --cc-btn-secondary-hover-bg: var(--color-surface-sunken);
  --cc-btn-secondary-hover-border-color: var(--color-border);

  --cc-toggle-on-bg: var(--color-brand);
  --cc-toggle-off-bg: var(--color-border);
  --cc-separator-border-color: var(--color-border);
  --cc-cookie-category-block-bg: var(--color-surface-elevated);
  --cc-link-color: var(--color-brand-light);
  --cc-overlay-bg: rgba(0, 0, 0, 0.5);
}

#cc-main .cm__title {
  font-family: var(--font-heading), "Fraunces", serif;
}

#cc-main .cm {
  box-shadow: var(--shadow-lg);
}
```

**Important:** The CSS variable names (`--color-surface`, `--color-brand`, etc.) must match the actual names defined at the top of `globals.css`. During implementation, read lines 1-100 of `globals.css` to verify exact names. Common alternatives: `--surface` vs `--color-surface`, `--brand` vs `--color-brand`. Adjust the overrides to match.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style(consent): add cookie banner CSS overrides for design system"
```

---

### Task 8: Seed Sanity data

**Files:** None (CMS data only)

- [ ] **Step 1: Check existing i18n document ID pattern**

Query Sanity to see how footer documents are ID'd:

```groq
*[_type == "footer"]{_id, language}
```

Note the pattern — the EN document may use a plain ID like `footer` and the PT document may use `footer__i18n_pt` or similar. The cookieBanner documents must follow the same pattern.

- [ ] **Step 2: Seed the EN cookie banner document**

Create the EN document via Sanity MCP `create_documents_from_json` or Studio. Use the privacy policy page `_ref` confirmed during brainstorming:
- EN privacy policy `_id`: `160994a6-5f6b-4cd8-82c3-da4449cf559b`

Fields:
- `_type`: `"cookieBanner"`
- `title`: `"We use cookies"`
- `description`: `"This site uses cookies for analytics to help us understand how visitors interact with it. You can accept or reject non-essential cookies."`
- `acceptLabel`: `"Accept"`
- `rejectLabel`: `"Reject"`
- `privacyPolicyLink`: internal link referencing the EN privacy policy page
- `language`: `"en"`

- [ ] **Step 3: Seed the PT cookie banner document**

Create the PT document with the PT privacy policy `_ref`:
- PT privacy policy `_id`: `f8f16f6e-130b-4e59-ab59-fec54bcc7a70`

Fields:
- `_type`: `"cookieBanner"`
- `title`: `"Utilizamos cookies"`
- `description`: `"Este site utiliza cookies de analitica para nos ajudar a compreender como os visitantes interagem com ele. Pode aceitar ou rejeitar cookies nao essenciais."`
- `acceptLabel`: `"Aceitar"`
- `rejectLabel`: `"Rejeitar"`
- `privacyPolicyLink`: internal link referencing the PT privacy policy page
- `language`: `"pt"`

- [ ] **Step 4: Create translation.metadata**

Per project convention (memory: `feedback_sanity_seeding.md`), create a `translation.metadata` document linking both language versions. Query an existing one for reference:

```groq
*[_type == "translation.metadata" && references(*[_type == "footer"]._id)][0]
```

Create an equivalent for cookieBanner with the EN and PT document IDs.

- [ ] **Step 5: Publish both documents**

Use Sanity MCP `publish_documents` or publish via Studio.

- [ ] **Step 6: Verify the banner appears**

```bash
npm run dev
```

Open `http://localhost:3000/en` — the cookie consent banner should appear at the bottom with "We use cookies" title, description, Accept/Reject buttons, and Privacy Policy link.

Open `http://localhost:3000/pt` — same in Portuguese.

---

### Task 9: Footer cookie settings link

**Files:**
- Create: `components/consent/CookieSettingsLink.tsx`
- Modify: `components/layout/Footer.tsx`

- [ ] **Step 1: Create the CookieSettingsLink wrapper**

Create `components/consent/CookieSettingsLink.tsx`:

```tsx
"use client";

import * as CookieConsent from "vanilla-cookieconsent";

interface CookieSettingsLinkProps {
  children: React.ReactNode;
  className?: string;
}

export default function CookieSettingsLink({
  children,
  className,
}: CookieSettingsLinkProps) {
  return (
    <button
      type="button"
      onClick={() => CookieConsent.show(true)}
      className={className}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Update Footer to use CookieSettingsLink**

In `components/layout/Footer.tsx`, add the import at the top (after existing imports):

```ts
import CookieSettingsLink from "@/components/consent/CookieSettingsLink";
```

Replace the legalLinks rendering block (lines 160-170). The current code:

```tsx
{legalLinks && legalLinks.length > 0 && (
  <div className="flex gap-4">
    {legalLinks.map((link, i) => (
      <FooterLink
        key={link.label ?? i}
        link={link}
        language={language}
        className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors duration-200 min-h-[44px] inline-flex items-center md:min-h-0"
      />
    ))}
  </div>
)}
```

Replace with:

```tsx
{legalLinks && legalLinks.length > 0 && (
  <div className="flex gap-4">
    {legalLinks.map((link, i) => {
      const href = resolveLink(link, language);
      if (href.includes("#cookie-settings")) {
        return (
          <CookieSettingsLink
            key={link.label ?? i}
            className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors duration-200 min-h-[44px] inline-flex items-center md:min-h-0 cursor-pointer"
          >
            {link.label}
          </CookieSettingsLink>
        );
      }
      return (
        <FooterLink
          key={link.label ?? i}
          link={link}
          language={language}
          className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors duration-200 min-h-[44px] inline-flex items-center md:min-h-0"
        />
      );
    })}
  </div>
)}
```

- [ ] **Step 3: Add the "Cookie Settings" link in Sanity Studio**

In Sanity Studio, edit the Footer document for each language. Add a new entry to the `legalLinks` array:
- **Label:** `"Cookie Settings"` (EN) / `"Definicoes de Cookies"` (PT)
- **Type:** internal
- **Internal reference:** select the Homepage
- **URL parameters:** `#cookie-settings`

- [ ] **Step 4: Verify the footer link works**

1. Open `http://localhost:3000/en`
2. Accept or reject cookies (dismiss the banner)
3. Scroll to the footer
4. Click "Cookie Settings" — the cookie preferences modal should reopen
5. Repeat for `/pt`

- [ ] **Step 5: Commit**

```bash
git add components/consent/CookieSettingsLink.tsx components/layout/Footer.tsx
git commit -m "feat(footer): add cookie settings link that reopens consent banner"
```

---

### Task 10: Build verification and manual testing

**Files:** None

- [ ] **Step 1: Run the production build**

```bash
npm run build
```

Expected: builds successfully with no errors.

- [ ] **Step 2: Run the linter**

```bash
npm run lint
```

Expected: no new lint errors.

- [ ] **Step 3: Manual testing checklist**

Test each scenario in the browser:

**First visit (no consent stored):**
- [ ] Banner appears at bottom center
- [ ] Title, description, and privacy policy link display correctly
- [ ] Accept and Reject buttons have equal visual weight
- [ ] Privacy policy link navigates to the correct page
- [ ] Banner is keyboard-navigable (Tab through elements)

**Accept flow:**
- [ ] Click Accept — banner dismisses
- [ ] Open DevTools > Application > Cookies — `_ga` and `_gid` cookies are set
- [ ] Run `dataLayer.filter(e => e[0] === 'consent')` in console — shows `analytics_storage: 'granted'`
- [ ] Refresh page — banner does not reappear

**Reject flow (clear cookies first):**
- [ ] Click Reject — banner dismisses
- [ ] No `_ga` or `_gid` cookies are set
- [ ] `analytics_storage` remains `'denied'`
- [ ] Refresh page — banner does not reappear

**Revoke consent:**
- [ ] Click "Cookie Settings" in footer — preferences reopen
- [ ] Change choice — consent updates accordingly
- [ ] If changed from Accept to Reject, `_ga` and `_gid` cookies are cleared (autoClear)

**Bilingual:**
- [ ] Test all above on `/en` and `/pt`
- [ ] Banner text matches the language

**Dark mode:**
- [ ] Toggle theme — banner colors update correctly
- [ ] Contrast meets WCAG AAA (check with DevTools color picker)

**Responsive:**
- [ ] Banner renders correctly on mobile viewport (375px)
- [ ] Buttons are tappable (44px+ touch targets)

- [ ] **Step 4: Final commit (if any CSS tweaks needed)**

```bash
git add -A
git commit -m "fix(consent): visual polish from manual testing"
```
