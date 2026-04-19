# Dependency Upgrades Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Zod v3→v4, Next.js 15→16, and the full Sanity stack (sanity v4→v5, next-sanity v10→v12, doc-i18n v3→v6) in three independent, committable batches.

**Architecture:** Three sequential batches with increasing risk — Zod (trivial, no code changes), Next.js 16 (one file rename via codemod), Sanity stack (data migration on staging dataset before production). Each batch produces a working, deployable state.

**Tech Stack:** Next.js 16, Sanity v5, next-sanity v12, @sanity/document-internationalization v6, sanity-plugin-internationalized-array v5, React 19.2, Zod v4, @hookform/resolvers v5

---

## Pre-flight checks

Before starting, verify the working tree is clean:

```bash
git status
```

Expected: `nothing to commit, working tree clean`. If not, stash or commit changes first.

---

## BATCH 1 — Zod v3→v4

### Files

- Modify: `package.json` (dependency version only)
- No other files change

---

### Task 1: Install Zod v4 and verify

**Why no code changes:** The only Zod usage is `components/forms/EmailCapture.tsx` — `z.string().email()` and `z.string().optional()`. Neither uses the deprecated `{ message: "..." }` API (now `{ error: "..." }` in v4). `@hookform/resolvers@5.2.2` already supports Zod v4 natively.

- [ ] **Install Zod v4**

```bash
npm install zod@latest
```

Expected: `zod@4.x.x` installed (currently 4.3.6 or higher).

- [ ] **Verify package.json updated**

Open `package.json` and confirm:

```json
"zod": "^4.3.6"
```

(exact patch may differ — major must be 4)

- [ ] **Run build**

```bash
npm run build
```

Expected: exits with code 0, no TypeScript or compile errors.

- [ ] **Run lint**

```bash
npm run lint
```

Expected: exits with code 0.

- [ ] **Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: upgrade zod v3 → v4"
```

---

## BATCH 2 — Next.js 15→16

### Files

- Rename: `middleware.ts` → `proxy.ts`
- Modify: `proxy.ts` (export name only: `middleware` → `proxy`)
- Modify: `package.json` (`next`, `eslint-config-next`)
- Modify: `package-lock.json`

The codemod handles all of this automatically.

---

### Task 2: Run the upgrade codemod

- [ ] **Run the codemod**

```bash
npx @next/codemod@latest upgrade 16
```

This will:
1. Upgrade `next` and `eslint-config-next` in `package.json`
2. Rename `middleware.ts` → `proxy.ts`
3. Rename the exported function from `middleware` to `proxy`
4. Run `npm install` automatically

Accept all prompts with `y`.

- [ ] **Verify the rename happened**

```bash
ls proxy.ts
```

Expected: file exists. If `middleware.ts` still exists, the codemod did not rename it — do it manually:

```bash
mv middleware.ts proxy.ts
```

Then open `proxy.ts` and rename the export:

```typescript
// Change this:
export function middleware(request: NextRequest) {

// To this:
export function proxy(request: NextRequest) {
```

- [ ] **Verify proxy.ts content is intact**

Open `proxy.ts` and confirm all three sections are present:
1. Early bail for `/bio` and `/card`
2. Static asset bail
3. Locale redirect + `x-language` header injection
4. `export const config = { matcher: [...] }` at the bottom — unchanged

The matcher should still be:
```typescript
export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*|admin|sitemap.xml|webhook|sentry-example-page|bio|card).*)",
  ],
};
```

- [ ] **Verify package.json**

Open `package.json` and confirm:
```json
"next": "^16.2.4",
"eslint-config-next": "^16.2.4"
```

(exact patch may differ — major must be 16)

- [ ] **Run build**

```bash
npm run build
```

Expected: exits with code 0. If you see a warning about `middleware` being deprecated, the codemod missed the rename — check Task 2 step 2 above.

- [ ] **Run lint**

```bash
npm run lint
```

Expected: exits with code 0.

- [ ] **Commit**

```bash
git add proxy.ts package.json package-lock.json
git commit -m "chore: upgrade Next.js 15 → 16"
```

---

## BATCH 3 — Sanity stack

### Files

- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `migrations/migrateToLanguageField.ts` (migration script — can be deleted after running)
- No changes to `sanity.config.ts`, `lib/sanity/queries.ts`, or `app/actions/getTranslatedPath.ts` (all GROQ already uses `value->language`, not `_key`)

### New dependency

`sanity-plugin-internationalized-array@^5.1.0` — required peer dep of `@sanity/document-internationalization` v6. Install it but do **not** add it to `sanity.config.ts` plugins — it is used internally by `documentInternationalization` and does not need to be registered separately.

---

### Task 3: Create the staging dataset

- [ ] **Create the staging dataset via Sanity CLI**

```bash
npx sanity dataset create staging
```

When prompted for ACL mode, choose `private`.

Expected output: `Dataset staging created successfully`

- [ ] **Export production data**

```bash
npx sanity dataset export production production-backup.tar.gz
```

This downloads all documents and assets from production. May take 1–2 minutes.

Expected: `production-backup.tar.gz` created in the project root.

- [ ] **Import production data into staging**

```bash
npx sanity dataset import production-backup.tar.gz staging --replace
```

Expected: import completes with a document count summary.

- [ ] **Verify staging has data**

Go to `https://sanity.io/manage/personal/project/2vq611gh/datasets` and confirm `staging` exists with documents.

- [ ] **Switch local env to staging**

Open `.env.local` and temporarily change:

```
NEXT_PUBLIC_SANITY_DATASET=staging
```

(Remember to change this back after smoke-testing.)

---

### Task 4: Install all packages

- [ ] **Install all upgraded and new packages**

```bash
npm install \
  react@19.2.5 \
  react-dom@19.2.5 \
  sanity@latest \
  @sanity/vision@latest \
  next-sanity@latest \
  @sanity/document-internationalization@latest \
  sanity-plugin-internationalized-array@latest

npm install --save-dev \
  @types/react@latest \
  @types/react-dom@latest
```

- [ ] **Verify installed versions**

```bash
npm list sanity next-sanity @sanity/document-internationalization @sanity/vision sanity-plugin-internationalized-array react zod
```

Expected output (majors must match):
```
sanity@5.x.x
next-sanity@12.x.x
@sanity/document-internationalization@6.x.x
@sanity/vision@5.x.x
sanity-plugin-internationalized-array@5.x.x
react@19.2.x
zod@4.x.x
```

- [ ] **Run build against staging**

```bash
npm run build
```

Expected: exits with code 0. Fix any TypeScript errors before continuing — do not proceed to the migration if the build fails.

Common issues and fixes:
- If `QueryParams` import from `next-sanity` changes: check `lib/sanity/fetch.ts` and update the import path if needed
- If `groq` import from `next-sanity` changes: check `lib/sanity/queries.ts` and `app/actions/getTranslatedPath.ts`

---

### Task 5: Create and run the data migration on staging

- [ ] **Create the migrations directory**

```bash
mkdir -p migrations
```

- [ ] **Create the migration file**

Create `migrations/migrateToLanguageField.ts`:

```typescript
import { migrateToLanguageField } from 'sanity-plugin-internationalized-array/migrations'

const DOCUMENT_TYPES: string[] = ['translation.metadata']

export default migrateToLanguageField(DOCUMENT_TYPES)
```

- [ ] **Run a dry run on staging first**

```bash
npx sanity migrations run migrateToLanguageField \
  --dataset staging \
  --project 2vq611gh
```

Dry run is the default. Review the output — it shows which documents would be modified without changing anything.

Expected: a list of `translation.metadata` document IDs that will be updated.

- [ ] **Run the real migration on staging**

```bash
npx sanity migrations run migrateToLanguageField \
  --dataset staging \
  --project 2vq611gh \
  --no-dry-run
```

Expected: migration completes with a success message and document count.

---

### Task 6: Smoke-test Studio on staging

- [ ] **Start the dev server**

```bash
npm run dev:admin
```

(Use `dev:admin` not `dev` — Turbopack doesn't serve the Sanity Studio correctly. `dev:admin` uses the standard Next.js dev server.)

- [ ] **Open the Studio**

Navigate to `http://localhost:3000/admin`

- [ ] **Check the Translations panel**

Open any bilingual document (e.g. the Homepage in Portuguese). Verify:
- The translations panel shows both PT and EN language variants
- No orange warning banner about outdated data format
- Language switcher between variants works

- [ ] **Check all 9 bilingual document types**

In the Studio sidebar, verify documents exist and open correctly for:
- `homepage` (PT + EN)
- `page` (PT + EN — e.g. Services, About, Contact)
- `site` (PT + EN)
- `navigation` (PT + EN)
- `footer` (PT + EN)
- `cookieBanner` (PT + EN)
- `project` (at least one PT + EN)
- `cardPage` (PT + EN)

If any show a "migration needed" warning banner, the migration did not run correctly — check Task 5.

---

### Task 7: Smoke-test frontend routes on staging

With `.env.local` still pointing to `staging` and `npm run dev` running (Turbopack):

```bash
npm run dev
```

- [ ] **Test key routes**

Visit each of the following and confirm they render without errors:

| Route | Check |
|---|---|
| `http://localhost:3000/pt` | Homepage PT loads |
| `http://localhost:3000/en` | Homepage EN loads |
| `http://localhost:3000/pt/servicos` | Services PT loads |
| `http://localhost:3000/en/services` | Services EN loads |
| `http://localhost:3000/en/projects` | Projects listing loads |
| `http://localhost:3000/card` | Card page loads |
| `http://localhost:3000/pt/contacto` | Contact PT loads |

- [ ] **Test language switcher**

On any page, click the language toggle (PT ↔ EN) and confirm it routes to the correct translated path — e.g. `/en/services` → `/pt/servicos`.

If language switching is broken, check `app/actions/getTranslatedPath.ts` — but this should work without changes since the GROQ uses `value->language` not `_key`.

---

### Task 8: Run migration on production and deploy

- [ ] **Restore production in .env.local**

Open `.env.local` and change back to:

```
NEXT_PUBLIC_SANITY_DATASET=production
```

- [ ] **Run dry run on production**

```bash
npx sanity migrations run migrateToLanguageField \
  --dataset production \
  --project 2vq611gh
```

Review the output matches what you saw on staging.

- [ ] **Run real migration on production**

```bash
npx sanity migrations run migrateToLanguageField \
  --dataset production \
  --project 2vq611gh \
  --no-dry-run
```

Expected: success message with document count.

- [ ] **Quick Studio verification on production**

Navigate to `http://localhost:3000/admin`, open a bilingual document, confirm no warning banners.

- [ ] **Delete the migration file**

The migration is a one-time script and should not stay in the repo permanently:

```bash
rm -rf migrations/
```

- [ ] **Delete the production backup**

```bash
rm production-backup.tar.gz
```

- [ ] **Commit and push**

```bash
git add package.json package-lock.json
git commit -m "chore: upgrade Sanity stack — sanity v5, next-sanity v12, doc-i18n v6"
git push
```

Wait for Vercel deployment to complete. Check the deployment preview URL for any build errors.

- [ ] **Verify live production routes**

Visit `https://joanaparente.com/en` and `https://joanaparente.com/pt` and confirm they load correctly.

---

## Post-upgrade checklist

- [ ] `zod` is at v4.x in `package.json` ✓
- [ ] `next` is at v16.x in `package.json` ✓
- [ ] `middleware.ts` no longer exists — replaced by `proxy.ts` ✓
- [ ] `sanity` is at v5.x ✓
- [ ] `next-sanity` is at v12.x ✓
- [ ] `@sanity/document-internationalization` is at v6.x ✓
- [ ] `sanity-plugin-internationalized-array` is in `package.json` ✓
- [ ] `react` is at 19.2.x ✓
- [ ] `NEXT_PUBLIC_SANITY_DATASET=production` in `.env.local` ✓
- [ ] `migrations/` directory deleted ✓
- [ ] `production-backup.tar.gz` deleted ✓
- [ ] Three commits pushed and Vercel deployment green ✓

---

## Rollback procedure (if needed)

**Batch 1 (Zod):** `git revert <commit>` — no data touched.

**Batch 2 (Next.js):** `git revert <commit>` — no data touched, middleware.ts comes back.

**Batch 3 (Sanity):**
- `git revert <commit>` to restore old package versions
- The production data migration is **not automatically reversible** — but the frontend is unaffected by the new `language` field format since all GROQ uses `value->language`
- If Studio needs to be restored: contact Sanity support for dataset point-in-time restore, or re-import `production-backup.tar.gz` (keep the backup until confident)
