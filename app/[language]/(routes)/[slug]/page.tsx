import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug, getPageSlugs } from "@/lib/sanity/queries";
import ContentBlocks from "@/components/ContentBlocks";
import { localizedPath } from "@/lib/utils";

const BASE_URL = "https://www.joanaparente.com";

export async function generateStaticParams() {
  const pages = await getPageSlugs();
  return pages
    .filter((p) => typeof p.slug === "string" && typeof p.language === "string")
    .map(({ slug, language }) => ({ slug, language }));
}

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

  // Build translated alternates
  const ptSlug = localizedPath(slug, "pt") || slug;
  const enSlug = localizedPath(slug, "en") || slug;

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

export default async function CmsPage({
  params,
}: {
  params: Promise<{ language: string; slug: string }>;
}) {
  const { language, slug } = await params;
  const page = await getPageBySlug({ slug, language });

  if (!page) return notFound();

  return (
    <main className="flex flex-col items-center justify-start pb-16 pt-8 md:pt-12">
      <ContentBlocks
        contentBlock={page.contentBlocks || []}
        language={language}
      />
    </main>
  );
}
