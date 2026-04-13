# OG Metadata Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a code-generated `opengraph-image.tsx` at the layout segment so every page has a branded OG image without CMS uploads, plus wire `ResolvingMetadata` inheritance on child pages so the image is never accidentally dropped.

**Architecture:** A single `opengraph-image.tsx` at `app/[language]/(routes)/` renders a 1200×630 PNG via `ImageResponse` (Satori). It fetches the `ogTagline` field from Sanity's `site` document using `client.fetch` directly (not `fetchSanity`, which calls `draftMode()` and throws in file-based metadata routes). Child pages inherit the image via `ResolvingMetadata`; `projects/[slug]` keeps its screenshot OG with the layout image as fallback.

**Tech Stack:** Next.js 15 App Router, `next/og` (ImageResponse / Satori), Sanity `client.fetch`, TTF fonts loaded via `fs/promises`, TypeScript

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `assets/fonts/Fraunces-Italic.ttf` | Create | Satori font — Fraunces italic 400 weight |
| `assets/fonts/PlusJakartaSans-Medium.ttf` | Create | Satori font — Plus Jakarta Sans 500 weight |
| `sanity/schemas/documents/site.ts` | Modify | Add `ogTagline` field to `seo` group |
| `lib/sanity/queries.ts` | Modify | Add `ogTagline` to `getSiteSettings` GROQ projection |
| `types/Sanity.d.ts` | Modify | Add `ogTagline?: string` to `SiteSettingsType` |
| `app/[language]/(routes)/opengraph-image.tsx` | Create | File-based OG image route (ImageResponse) |
| `app/[language]/(routes)/layout.tsx` | Modify | Remove `openGraph.images` (file-based takes priority) |
| `app/[language]/(routes)/[slug]/page.tsx` | Modify | Add `ResolvingMetadata` inheritance |
| `app/[language]/(routes)/projects/page.tsx` | Modify | Add `ResolvingMetadata` inheritance |
| `app/[language]/(routes)/projects/[slug]/page.tsx` | Modify | Add `parentImages` as fallback when no screenshot |

---

## Task 1: Download and commit font TTF files

**Files:**
- Create: `assets/fonts/Fraunces-Italic.ttf`
- Create: `assets/fonts/PlusJakartaSans-Medium.ttf`

Satori cannot use `next/font/google`. Fonts must be static TTF files on disk, loaded with `readFile`.

- [ ] **Step 1: Create the fonts directory**

```bash
mkdir -p assets/fonts
```

- [ ] **Step 2: Download Fraunces Italic (static, not variable)**

Go to https://fonts.google.com/specimen/Fraunces and download the **static** TTF (not the variable font). In the ZIP, navigate to `static/` and find `Fraunces-Italic.ttf` (regular 400 weight italic). Copy it to `assets/fonts/Fraunces-Italic.ttf`.

Alternatively via command line:
```bash
curl -L "https://github.com/undercasetype/Fraunces/raw/main/fonts/static/Fraunces_9pt-Italic.ttf" \
  -o assets/fonts/Fraunces-Italic.ttf
```

Verify the file is a valid TTF (not HTML):
```bash
file assets/fonts/Fraunces-Italic.ttf
# Expected: assets/fonts/Fraunces-Italic.ttf: TrueType Font data ...
```

- [ ] **Step 3: Download Plus Jakarta Sans Medium**

```bash
curl -L "https://github.com/tokotype/PlusJakartaSans/raw/main/fonts/ttf/PlusJakartaSans-Medium.ttf" \
  -o assets/fonts/PlusJakartaSans-Medium.ttf
```

Verify:
```bash
file assets/fonts/PlusJakartaSans-Medium.ttf
# Expected: TrueType Font data ...
```

- [ ] **Step 4: Check combined file size is under 500KB**

```bash
du -sh assets/fonts/
# Expected: under 500K total
```

- [ ] **Step 5: Commit**

```bash
git add assets/fonts/Fraunces-Italic.ttf assets/fonts/PlusJakartaSans-Medium.ttf
git commit -m "feat(og): add static TTF fonts for Satori OG image renderer"
```

---

## Task 2: Add `ogTagline` to Sanity schema and TypeScript type

**Files:**
- Modify: `sanity/schemas/documents/site.ts`
- Modify: `types/Sanity.d.ts`

- [ ] **Step 1: Add field to `site.ts`**

In `sanity/schemas/documents/site.ts`, add the new field inside the `fields` array, after the `faviconDark` field (line 58) and before `socialLinks`:

```ts
defineField({
  name: "ogTagline",
  title: "OG Card Tagline",
  type: "string",
  group: "seo",
  description: "Short phrase on the social sharing card (e.g. 'Strategist who codes.')",
  validation: (Rule) => Rule.max(60),
}),
```

- [ ] **Step 2: Add `ogTagline` to `SiteSettingsType` in `types/Sanity.d.ts`**

Find `SiteSettingsType` (line 486) and add the optional field:

```ts
export type SiteSettingsType = {
  title: string;
  domain: string;
  logo: SanityImage;
  metadata: MetadataType;
  ogTagline?: string;
};
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
# Expected: no errors
```

- [ ] **Step 4: Commit**

```bash
git add sanity/schemas/documents/site.ts types/Sanity.d.ts
git commit -m "feat(og): add ogTagline field to site schema and SiteSettingsType"
```

---

## Task 3: Add `ogTagline` to the `getSiteSettings` GROQ query

**Files:**
- Modify: `lib/sanity/queries.ts` (around line 289)

- [ ] **Step 1: Update the GROQ projection**

In `lib/sanity/queries.ts`, update the `getSiteSettings` function. The current query:

```ts
export async function getSiteSettings(language: string) {
  const query = groq`
    *[_type == "site" && language == $language][0] {
      title,
      domain,
      logo,
      metadata {
        title,
        metaDescription,
        keywords,
        defaultOgImage {
          asset->{ url }
        },
        defaultTwitterImage {
          asset->{ url }
        },
        noIndex
      }
    }
  `;
  return fetchSanity<SiteSettingsType>({ query, params: { language } });
}
```

Change to:

```ts
export async function getSiteSettings(language: string) {
  const query = groq`
    *[_type == "site" && language == $language][0] {
      title,
      domain,
      logo,
      ogTagline,
      metadata {
        title,
        metaDescription,
        keywords,
        defaultOgImage {
          asset->{ url }
        },
        defaultTwitterImage {
          asset->{ url }
        },
        noIndex
      }
    }
  `;
  return fetchSanity<SiteSettingsType>({ query, params: { language } });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
# Expected: no errors
```

- [ ] **Step 3: Commit**

```bash
git add lib/sanity/queries.ts
git commit -m "feat(og): add ogTagline to getSiteSettings GROQ projection"
```

---

## Task 4: Create `opengraph-image.tsx`

**Files:**
- Create: `app/[language]/(routes)/opengraph-image.tsx`

This is the core task. The file uses Next.js file-based metadata convention. It MUST use `client.fetch` directly — NOT `getSiteSettings` (which calls `fetchSanity` → `draftMode()` → throws in file-based metadata routes).

- [ ] **Step 1: Create the file**

```tsx
import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";

export const alt = "Joana Parente — Web Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export async function generateStaticParams() {
  return [{ language: "pt" }, { language: "en" }];
}

export default async function Image({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  const { language } = await params;

  // Fetch tagline directly with client.fetch — getSiteSettings uses fetchSanity
  // which calls draftMode() and throws in file-based metadata routes
  const result = await client.fetch<{ ogTagline?: string } | null>(
    groq`*[_type == "site" && language == $language][0] { ogTagline }`,
    { language }
  );
  const tagline = result?.ogTagline || "Strategist who codes.";

  // Split tagline at last word for accent colouring ("codes." in terracotta)
  const lastSpace = tagline.lastIndexOf(" ");
  const taglineStart = lastSpace >= 0 ? tagline.slice(0, lastSpace + 1) : "";
  const taglineAccent = lastSpace >= 0 ? tagline.slice(lastSpace + 1) : tagline;

  // Load fonts from disk (Satori cannot use next/font/google)
  const [frauncesFont, jakartaFont, iconData] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Fraunces-Italic.ttf")),
    readFile(join(process.cwd(), "assets/fonts/PlusJakartaSans-Medium.ttf")),
    readFile(join(process.cwd(), "public/logo/logo-icon-dark.png")),
  ]);

  const iconBase64 = `data:image/png;base64,${iconData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: "#F9F6F2",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          fontFamily: "PlusJakartaSans",
        }}
      >
        {/* Eyebrow — terracotta rule + name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 56,
              height: 2,
              backgroundColor: "#C4603A",
            }}
          />
          <span
            style={{
              fontFamily: "PlusJakartaSans",
              fontSize: 20,
              fontWeight: 500,
              color: "#C4603A",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Joana Parente
          </span>
        </div>

        {/* Headline — Fraunces italic */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            fontSize: 112,
            fontFamily: "Fraunces",
            fontStyle: "italic",
            lineHeight: 1.05,
            color: "#2C2419",
            marginBottom: 48,
          }}
        >
          <span>{taglineStart}</span>
          <span style={{ color: "#C4603A" }}>{taglineAccent}</span>
        </div>

        {/* Bottom row — icon + location + domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={iconBase64}
            width={36}
            height={36}
            alt=""
            style={{ opacity: 0.6 }}
          />
          <span
            style={{
              fontFamily: "PlusJakartaSans",
              fontSize: 18,
              color: "#9E8068",
            }}
          >
            Web Dev · Algarve · joanaparente.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Fraunces",
          data: frauncesFont,
          style: "italic",
          weight: 400,
        },
        {
          name: "PlusJakartaSans",
          data: jakartaFont,
          style: "normal",
          weight: 500,
        },
      ],
    }
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
# Expected: no errors
```

- [ ] **Step 3: Verify the route resolves in dev**

```bash
npm run dev
```

Navigate to: `http://localhost:3000/pt/opengraph-image` and `http://localhost:3000/en/opengraph-image`

Expected: PNG image renders — warm sand background, "Strategist" in Deep Ink on one line, "who codes." with "codes." in terracotta.

- [ ] **Step 4: Commit**

```bash
git add app/[language]/\(routes\)/opengraph-image.tsx
git commit -m "feat(og): add code-generated opengraph-image.tsx at layout segment"
```

---

## Task 5: Remove `openGraph.images` from layout `generateMetadata`

**Files:**
- Modify: `app/[language]/(routes)/layout.tsx` (lines 98–148)

The file-based `opengraph-image.tsx` at the same segment automatically takes priority over config-based `generateMetadata` images. The `openGraph.images` key in `generateMetadata` is now redundant and must be removed to avoid confusion.

- [ ] **Step 1: Remove the OG image references from `generateMetadata`**

In `layout.tsx`, the `generateMetadata` function currently extracts and uses `defaultOgImage` and `defaultTwitterImage`. Remove the image lines.

Current code (lines 102–147):

```ts
const {
  title,
  metaDescription,
  keywords,
  defaultOgImage,
  defaultTwitterImage,
  noIndex,
} = siteSettings.metadata;

const resolvedTitle = title || "Joana Parente | Web Developer";
const resolvedDescription =
  metaDescription ||
  "Freelance web developer and digital strategist specializing in modern, high-performance websites.";
const ogImageUrl = defaultOgImage?.asset?.url;
const twitterImageUrl = defaultTwitterImage?.asset?.url || ogImageUrl;

return {
  title: resolvedTitle,
  description: resolvedDescription,
  keywords: keywords?.length ? keywords.join(", ") : undefined,
  icons,
  alternates: {
    canonical: `${BASE_URL}/${language}`,
    languages: {
      pt: `${BASE_URL}/pt`,
      en: `${BASE_URL}/en`,
      "x-default": `${BASE_URL}/pt`,
    },
  },
  openGraph: {
    title: resolvedTitle,
    description: resolvedDescription,
    url: `${BASE_URL}/${language}`,
    siteName: "Joana Parente",
    locale: language === "pt" ? "pt_PT" : "en_US",
    alternateLocale: language === "pt" ? "en_US" : "pt_PT",
    type: "website",
    images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: resolvedTitle,
    description: resolvedDescription,
    images: twitterImageUrl ? [twitterImageUrl] : undefined,
  },
  robots: noIndex ? "noindex" : undefined,
};
```

Replace with (images removed, destructure simplified):

```ts
const {
  title,
  metaDescription,
  keywords,
  noIndex,
} = siteSettings.metadata;

const resolvedTitle = title || "Joana Parente | Web Developer";
const resolvedDescription =
  metaDescription ||
  "Freelance web developer and digital strategist specializing in modern, high-performance websites.";

return {
  title: resolvedTitle,
  description: resolvedDescription,
  keywords: keywords?.length ? keywords.join(", ") : undefined,
  icons,
  alternates: {
    canonical: `${BASE_URL}/${language}`,
    languages: {
      pt: `${BASE_URL}/pt`,
      en: `${BASE_URL}/en`,
      "x-default": `${BASE_URL}/pt`,
    },
  },
  openGraph: {
    title: resolvedTitle,
    description: resolvedDescription,
    url: `${BASE_URL}/${language}`,
    siteName: "Joana Parente",
    locale: language === "pt" ? "pt_PT" : "en_US",
    alternateLocale: language === "pt" ? "en_US" : "pt_PT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: resolvedTitle,
    description: resolvedDescription,
  },
  robots: noIndex ? "noindex" : undefined,
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
# Expected: no errors
```

- [ ] **Step 3: Commit**

```bash
git add app/[language]/\(routes\)/layout.tsx
git commit -m "feat(og): remove openGraph.images from layout generateMetadata (file-based takes priority)"
```

---

## Task 6: Add `ResolvingMetadata` to `[slug]/page.tsx`

**Files:**
- Modify: `app/[language]/(routes)/[slug]/page.tsx`

Without this, the CMS page's `generateMetadata` returns an `openGraph` object with no `images`, which silently replaces the layout segment's OG image on Next.js shallow merge.

- [ ] **Step 1: Update imports and `generateMetadata` signature**

Current imports (top of file):

```ts
import type { Metadata } from "next";
```

Change to:

```ts
import type { Metadata, ResolvingMetadata } from "next";
```

- [ ] **Step 2: Update `generateMetadata` to inherit parent images**

Current function signature:

```ts
export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string; slug: string }>;
}): Promise<Metadata> {
  const { language, slug } = await params;
  const page = await getPageBySlug({ slug, language });

  if (!page) return { title: "Page Not Found" };

  const title = page.metadata?.title || `${page.title} | Joana Parente`;
  const description = page.metadata?.metaDescription || "";

  const ptSlug = getTranslatedSlug(page._translations, "pt") ?? slug;
  const enSlug = getTranslatedSlug(page._translations, "en") ?? slug;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${language}/${slug}`,
      languages: {
        pt: `${BASE_URL}/pt/${ptSlug}`,
        en: `${BASE_URL}/en/${enSlug}`,
        "x-default": `${BASE_URL}/pt/${ptSlug}`,
      },
    },
  };
}
```

Replace with:

```ts
export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ language: string; slug: string }>;
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { language, slug } = await params;
  const page = await getPageBySlug({ slug, language });

  if (!page) return { title: "Page Not Found" };

  const title = page.metadata?.title || `${page.title} | Joana Parente`;
  const description = page.metadata?.metaDescription || "";

  const ptSlug = getTranslatedSlug(page._translations, "pt") ?? slug;
  const enSlug = getTranslatedSlug(page._translations, "en") ?? slug;

  const parentImages = (await parent).openGraph?.images || [];

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${language}/${slug}`,
      languages: {
        pt: `${BASE_URL}/pt/${ptSlug}`,
        en: `${BASE_URL}/en/${enSlug}`,
        "x-default": `${BASE_URL}/pt/${ptSlug}`,
      },
    },
    openGraph: {
      title,
      description,
      images: parentImages,
    },
  };
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
# Expected: no errors
```

- [ ] **Step 4: Commit**

```bash
git add "app/[language]/(routes)/[slug]/page.tsx"
git commit -m "feat(og): inherit parent OG images in [slug]/page.tsx via ResolvingMetadata"
```

---

## Task 7: Add `ResolvingMetadata` to `projects/page.tsx`

**Files:**
- Modify: `app/[language]/(routes)/projects/page.tsx`

Same pattern as Task 6.

- [ ] **Step 1: Update imports**

Current:

```ts
import type { Metadata } from "next";
```

Change to:

```ts
import type { Metadata, ResolvingMetadata } from "next";
```

- [ ] **Step 2: Update `generateMetadata` to inherit parent images**

Current function:

```ts
export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string }>;
}): Promise<Metadata> {
  const { language } = await params;
  const slug = localizedPath("projects", language);
  const page = await getPageBySlug({ slug, language });

  if (!page) {
    return {
      title: language === "pt" ? "Projetos | Joana Parente" : "Projects | Joana Parente",
    };
  }

  const title = page.metadata?.title || `${page.title} | Joana Parente`;
  const description = page.metadata?.metaDescription || "";

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${language}/${slug}`,
      languages: {
        pt: `${BASE_URL}/pt/${localizedPath("projects", "pt")}`,
        en: `${BASE_URL}/en/${localizedPath("projects", "en")}`,
        "x-default": `${BASE_URL}/pt/${localizedPath("projects", "pt")}`,
      },
    },
  };
}
```

Replace with:

```ts
export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ language: string }>;
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { language } = await params;
  const slug = localizedPath("projects", language);
  const page = await getPageBySlug({ slug, language });

  const parentImages = (await parent).openGraph?.images || [];

  if (!page) {
    return {
      title: language === "pt" ? "Projetos | Joana Parente" : "Projects | Joana Parente",
      openGraph: { images: parentImages },
    };
  }

  const title = page.metadata?.title || `${page.title} | Joana Parente`;
  const description = page.metadata?.metaDescription || "";

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${language}/${slug}`,
      languages: {
        pt: `${BASE_URL}/pt/${localizedPath("projects", "pt")}`,
        en: `${BASE_URL}/en/${localizedPath("projects", "en")}`,
        "x-default": `${BASE_URL}/pt/${localizedPath("projects", "pt")}`,
      },
    },
    openGraph: {
      title,
      description,
      images: parentImages,
    },
  };
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
# Expected: no errors
```

- [ ] **Step 4: Commit**

```bash
git add "app/[language]/(routes)/projects/page.tsx"
git commit -m "feat(og): inherit parent OG images in projects/page.tsx via ResolvingMetadata"
```

---

## Task 8: Add `parentImages` fallback to `projects/[slug]/page.tsx`

**Files:**
- Modify: `app/[language]/(routes)/projects/[slug]/page.tsx` (lines 68–116)

This page already has explicit OG images from `featuredScreenshot`. The only change: when `imageUrl` is `undefined` (no screenshot, no project image), fall back to `parentImages` instead of `undefined`.

- [ ] **Step 1: Update imports**

Current:

```ts
import type { Metadata } from "next";
```

Change to:

```ts
import type { Metadata, ResolvingMetadata } from "next";
```

- [ ] **Step 2: Update `generateMetadata` signature and fallback**

Current signature:

```ts
export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string; slug: string }>;
}): Promise<Metadata> {
```

Change to:

```ts
export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ language: string; slug: string }>;
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
```

After the `imageUrl` assignment (currently around line 90), add:

```ts
const parentImages = (await parent).openGraph?.images || [];
```

Then update the `openGraph.images` line from:

```ts
images: imageUrl ? [{ url: imageUrl }] : undefined,
```

to:

```ts
images: imageUrl ? [{ url: imageUrl }] : parentImages,
```

And the `twitter.images` line from:

```ts
images: imageUrl ? [imageUrl] : undefined,
```

to:

```ts
images: imageUrl ? [imageUrl] : undefined,
```

(Twitter images stay `undefined` when no screenshot — the `og:image` tag is reused by Twitter automatically.)

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
# Expected: no errors
```

- [ ] **Step 4: Commit**

```bash
git add "app/[language]/(routes)/projects/[slug]/page.tsx"
git commit -m "feat(og): use parentImages fallback in projects/[slug] when no screenshot"
```

---

## Task 9: Production build verification

- [ ] **Step 1: Run production build**

```bash
npm run build
# Expected: ✓ Compiled successfully
# Expected: opengraph-image routes appear in output:
#   ○ /[language]/opengraph-image  (static)
```

- [ ] **Step 2: Test OG image URLs locally**

Start the production server:

```bash
npm run start
```

Open in browser:
- `http://localhost:3000/pt/opengraph-image` → PNG with "Strategist who codes." tagline
- `http://localhost:3000/en/opengraph-image` → same card (tagline comes from Sanity; both languages may show the same text until CMS is updated)

- [ ] **Step 3: Verify OG tags on a page**

View page source of `http://localhost:3000/pt`:

```
<meta property="og:image" content="https://www.joanaparente.com/pt/opengraph-image?...">
```

Also check `/pt/projetos` and any CMS page slug — all should show the OG image meta tag.

- [ ] **Step 4: Verify projects/[slug] OG uses screenshot**

View page source of a project detail page. If it has a `featuredScreenshot`, the `og:image` should point to Sanity CDN (not the layout opengraph-image URL).

- [ ] **Step 5: Final commit (if any loose files)**

```bash
git status
# If clean, nothing to do.
```

---

## Post-implementation: Enter tagline in Sanity Studio

After deploying, navigate to **Sanity Studio → Site Settings → SEO tab** and fill in the **OG Card Tagline** field (max 60 characters) for both PT and EN language versions. The `opengraph-image.tsx` will revalidate within 1 hour (`revalidate = 3600`) and reflect the new tagline without a redeploy.

Default fallback (shown if field is empty): `"Strategist who codes."`
