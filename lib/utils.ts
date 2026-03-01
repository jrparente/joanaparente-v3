import { LinkType } from "@/types/Sanity";
import { pathTranslations } from "@/i18n.config";
import { clsx, type ClassValue } from "clsx";
import { stegaClean } from "next-sanity";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function localizedPath(path: string, language: string): string {
  const map = pathTranslations[language];
  if (!map) return path;
  return map[path] ?? path;
}

export function getTranslatedSlug(
  translations: Array<{ slug: string; language: string }> | undefined,
  targetLanguage: string
): string | null {
  return translations?.find((t) => t.language === targetLanguage)?.slug ?? null;
}

export function resolveLink(link: LinkType, locale?: string): string {
  if (link.type === "external") return link.external ?? "#";

  const rawSlug = link.internal?.metadata?.slug?.current || "";
  const slug = stegaClean(rawSlug).trim().toLowerCase();
  const base = slug === "index" ? "" : `/${slug}`;
  const params = link.params ? stegaClean(link.params) : "";
  return locale ? `/${locale}${base}${params}` : `${base}${params}` || "/";
}
