import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/sanity/queries";
import ContentBlocks from "@/components/ContentBlocks";
import { localizedPath } from "@/lib/utils";

const BASE_URL = "https://www.joanaparente.com";

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

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  const { language } = await params;

  if (!language) return notFound();

  const slug = localizedPath("projects", language);
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
