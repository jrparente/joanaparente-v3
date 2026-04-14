import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug, getPageSlugs } from "@/lib/sanity/queries";
import ContentBlocks from "@/components/ContentBlocks";
import { getTranslatedSlug } from "@/lib/utils";

const BASE_URL = "https://www.joanaparente.com";

export async function generateStaticParams() {
  const pages = await getPageSlugs();
  return pages
    .filter((p) => typeof p.slug === "string" && typeof p.language === "string")
    .map(({ slug, language }) => ({ slug, language }));
}

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

  // Build translated alternates from CMS translation metadata
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
