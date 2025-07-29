import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveLink(link: {
  type: "internal" | "external";
  internal?: { metadata?: { slug?: { current: string } } };
  external?: string;
  params?: string;
}): string {
  if (link.type === "external") return link.external ?? "#";
  const slug = link.internal?.metadata?.slug?.current ?? "";
  const base = slug === "index" ? "/" : `/${slug}`;
  return link.params ? `${base}${link.params}` : base;
}
