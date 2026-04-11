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

  // Normalise path-prefix aliases to their canonical filesystem form.
  // Derived from the middleware.ts rewrite: /pt/projetos/* → /pt/projects/*
  const prefixAliases: Record<string, string> = { projetos: "projects" };
  const prefixKey = segments[0];
  const canonicalPrefix = pathPrefix
    ? `/${prefixAliases[prefixKey] ?? prefixKey}`
    : "";

  return `/${targetLanguage}${canonicalPrefix}/${translatedSlug}`;
}
