# Dependency Upgrades Design

**Date:** 2026-04-19  
**Scope:** P5 — Zod v3→v4, Next.js 15→16, Sanity stack v4→v5  
**Approach:** Option A — three sequential batches, each independently committable

---

## Context

### Current versions

| Package | Current | Target |
|---|---|---|
| `next` | 15.5.12 | 16.2.4 |
| `sanity` | 4.1.1 | 5.21.0 |
| `@sanity/document-internationalization` | 3.3.3 | 6.1.0 |
| `next-sanity` | 10.0.4 | 12.3.0 |
| `@sanity/vision` | 4.1.1 | 5.21.0 |
| `react` / `react-dom` | 19.1.2 | 19.2.5 |
| `zod` | 3.23.8 | 4.3.6 |
| `@hookform/resolvers` | 5.2.2 | 5.2.2 (no change) |

### Key constraints

- `next-sanity` v12 requires **both** Next.js 16 and Sanity v5 — these must go together (Batch 3)
- `@sanity/document-internationalization` v6 requires `react ^19.2` and a **data migration** on `translation.metadata` documents
- This project does NOT use `SanityLive` / `defineLive` — the Next.js 16 + SanityLive request overage issue does not apply
- Only one Sanity dataset exists (`production`) — a `staging` dataset must be created before Batch 3

---

## Batch 1 — Zod v3→v4

**Estimated time:** 15 min  
**Risk:** Minimal — no breaking changes affect this project  
**Staging required:** No

### What changes

- `package.json`: `zod` bumped to `^4.3.6`
- No code changes needed

### Why no code changes

The only Zod usage is `components/forms/EmailCapture.tsx`:

```ts
z.object({ email: z.string().email(), firstName: z.string().optional() })
```

Neither method uses the deprecated `{ message: "..." }` pattern (changed to `{ error: "..." }` in v4). `@hookform/resolvers@5.2.2` already supports Zod v4.

### Steps

1. `npm install zod@latest`
2. `npm run build && npm run lint`
3. Commit: `chore: upgrade zod v3 → v4`

---

## Batch 2 — Next.js 15→16

**Estimated time:** 30 min  
**Risk:** Low — one breaking change affects this project (middleware rename); codemod handles it  
**Staging required:** No

### What changes

- `package.json`: `next` → `16.2.4`, `eslint-config-next` → `16.2.4`
- `middleware.ts` → `proxy.ts` (file rename)
- Export `middleware()` → `proxy()` (function rename inside the file)

### Breaking changes that do NOT apply

- Turbopack config move (`experimental.turbopack` → `turbopack`): not used in this project
- `unstable_cacheLife`, `unstable_cacheTag`, `experimental.dynamicIO`: not used
- SanityLive request overage: not applicable (project uses plain 60s ISR)

### Steps

1. `npx @next/codemod upgrade 16` — handles middleware rename, config updates, ESLint migration automatically
2. Verify `proxy.ts` matcher config is intact (i18n routes + `/bio` + `/admin` exclusions)
3. `npm run build && npm run lint`
4. Commit: `chore: upgrade Next.js 15 → 16`

---

## Batch 3 — Sanity stack

**Estimated time:** 2–3 hrs  
**Risk:** Medium — data migration required on `translation.metadata` documents  
**Staging required:** Yes — production copy

### Packages

| Package | Change |
|---|---|
| `react` + `react-dom` | `19.1.2` → `19.2.5` |
| `@types/react` + `@types/react-dom` | update to match |
| `sanity` | `4.1.1` → `5.21.0` |
| `@sanity/vision` | `4.1.1` → `5.21.0` |
| `next-sanity` | `10.0.4` → `12.3.0` |
| `@sanity/document-internationalization` | `3.3.3` → `6.1.0` |
| `sanity-plugin-internationalized-array` | **NEW** `^5.1.0` |

### Why `sanity-plugin-internationalized-array` is new

`@sanity/document-internationalization` v6 introduces it as a required peer dependency. It manages metadata files and provides the `migrateToLanguageField` migration helper.

### Data migration

`@sanity/document-internationalization` v6 changes how language is stored in `translation.metadata` documents:

- **Before (v3):** `{ _key: "en", ... }` — language code stored in `_key`
- **After (v6):** `{ _key: "<uuid>", language: "en", ... }` — language in dedicated field, `_key` is a random stable ID

Without migration: Studio shows a warning banner. Frontend routes are unaffected (this is metadata storage only). With migration: clean Studio, no warnings.

Migration uses: `import { migrateToLanguageField } from 'sanity-plugin-internationalized-array/migrations'`

### GROQ queries to audit

Check `lib/sanity/queries.ts` for any GROQ that reads `translation.metadata` and references `_key` for language lookup. Update to `language` field after migration. The `getTranslatedPath` server action in `app/actions/getTranslatedPath.ts` likely queries this — must be audited.

### Steps

**Phase A — Staging setup**
1. Create `staging` dataset (Sanity MCP or `sanity dataset create staging`)
2. Export production + import into staging (`sanity dataset export production` then `sanity dataset import ./export.tar.gz staging`)

**Phase B — Install + code changes**
1. `npm install react@19.2.5 react-dom@19.2.5 @types/react@latest @types/react-dom@latest sanity@latest @sanity/vision@latest next-sanity@latest @sanity/document-internationalization@latest sanity-plugin-internationalized-array@latest`
2. Set `NEXT_PUBLIC_SANITY_DATASET=staging` in `.env.local` temporarily
3. Audit `sanity.config.ts` for any v5 API changes
4. Audit `lib/sanity/queries.ts` and `app/actions/getTranslatedPath.ts` for `_key`-based language lookups in `translation.metadata` queries
5. `npm run build` — verify clean against staging

**Phase C — Data migration (staging first)**
1. Run `migrateToLanguageField` migration against `staging` dataset
2. Smoke-test Sanity Studio at `/admin`: translations panel, all 9 bilingual document types (`homepage`, `page`, `site`, `navigation`, `footer`, `cookieBanner`, `project`, `blogPost`, `cardPage`), language switcher
3. Verify all bilingual frontend routes: `/en/`, `/pt/`, `/en/services`, `/pt/servicos`, `/en/projects/[slug]`, `/pt/projectos/[slug]`, `/en/contacto`, `/pt/contacto`, `/card`
4. If all green → switch back to `NEXT_PUBLIC_SANITY_DATASET=production`, run migration against production

**Phase D — Deploy**
1. Restore `NEXT_PUBLIC_SANITY_DATASET=production` in `.env.local`
2. Commit: `chore: upgrade Sanity stack — sanity v5, next-sanity v12, doc-i18n v6`
3. Push → Vercel deploys

### Rollback plan

If the production data migration causes issues: `translation.metadata` documents are metadata only. Reverting `@sanity/document-internationalization` to v3.3.3 in `package.json` and redeploying restores full functionality. The migrated data format is backwards-compatible with older plugin versions in read mode.

---

## Commit sequence

```
chore: upgrade zod v3 → v4
chore: upgrade Next.js 15 → 16
chore: upgrade Sanity stack — sanity v5, next-sanity v12, doc-i18n v6
```

Each commit is independently deployable and bisectable.
