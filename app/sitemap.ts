import type { MetadataRoute } from "next";
import { getProjectSlugs } from "@/lib/sanity/queries";
import { localizedPath } from "@/lib/utils";

const BASE_URL = "https://www.joanaparente.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projectSlugs = await getProjectSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/pt`,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          pt: `${BASE_URL}/pt`,
          en: `${BASE_URL}/en`,
        },
      },
    },
    {
      url: `${BASE_URL}/en`,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          pt: `${BASE_URL}/pt`,
          en: `${BASE_URL}/en`,
        },
      },
    },
    {
      url: `${BASE_URL}/pt/${localizedPath("projects", "pt")}`,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          pt: `${BASE_URL}/pt/${localizedPath("projects", "pt")}`,
          en: `${BASE_URL}/en/${localizedPath("projects", "en")}`,
        },
      },
    },
    {
      url: `${BASE_URL}/en/${localizedPath("projects", "en")}`,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          pt: `${BASE_URL}/pt/${localizedPath("projects", "pt")}`,
          en: `${BASE_URL}/en/${localizedPath("projects", "en")}`,
        },
      },
    },
    {
      url: `${BASE_URL}/pt/${localizedPath("contact", "pt")}`,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          pt: `${BASE_URL}/pt/${localizedPath("contact", "pt")}`,
          en: `${BASE_URL}/en/${localizedPath("contact", "en")}`,
        },
      },
    },
    {
      url: `${BASE_URL}/en/${localizedPath("contact", "en")}`,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          pt: `${BASE_URL}/pt/${localizedPath("contact", "pt")}`,
          en: `${BASE_URL}/en/${localizedPath("contact", "en")}`,
        },
      },
    },
    {
      url: `${BASE_URL}/bio`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Group project slugs by slug to pair pt/en versions
  const slugsByName = new Map<string, string[]>();
  for (const { slug, language } of projectSlugs) {
    if (!slugsByName.has(slug)) {
      slugsByName.set(slug, []);
    }
    slugsByName.get(slug)!.push(language);
  }

  const projectPages: MetadataRoute.Sitemap = projectSlugs.map(
    ({ slug, language }) => {
      const languages = slugsByName.get(slug) || [];
      const hasAlternate = languages.length > 1;

      return {
        url: `${BASE_URL}/${language}/${localizedPath("projects", language)}/${slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.9,
        ...(hasAlternate && {
          alternates: {
            languages: Object.fromEntries(
              languages.map((lang) => [
                lang,
                `${BASE_URL}/${lang}/${localizedPath("projects", lang)}/${slug}`,
              ])
            ),
          },
        }),
      };
    }
  );

  return [...staticPages, ...projectPages];
}
