import { groq } from "next-sanity";
import { fetchSanity } from "./fetch";
import {
  FooterType,
  Homepage,
  NavigationType,
  PageType,
  SiteSettingsType,
} from "@/types/Sanity";

type Params = {
  language: string | null;
};

// Define as a regular string (not groq template)
export const contentBlocksProjection = `
  contentBlocks[] {
    ...,
    _type == "hero" => {
      ...,
      _type,
      _key,
      subheading,
      title,
      subtitle,
      description {
        content[]{
          ...,
          _type == "image" => {
            asset->{
              _id,
              url
            },
            alt
          }
        }
      },
      image,
      buttonLink {
        label,
        type,
        params,
        internal->{
          _type,
          _id,
          title,
          metadata {
            slug {
              current
            }
          }
        },
        external
      }
    },
    _type == "intro" => {
      ...,
      _type,
      _key,
      heading,
      subheading,
      anchor,
      content{
        content[]{
          ...,
          _type == "image" => {
            asset->{
              _id,
              url
            },
            alt
          }
        }
      },
    }
  }
`;

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

export async function getNavigation(language: string) {
  const query = groq`
    *[_type == "navigation" && language == $language][0] {
      title,
      items[] {
        label,
        type,
        params,
        internal->{
          _type,
          _id,
          title,
          metadata {
            slug {
              current
            }
          }
        },
        external
      }
    }
  `;

  return fetchSanity<NavigationType>({ query, params: { language } });
}

export async function getFooter() {
  const query = groq`
    *[_type == "footer"][0] {
      message,
      email,
      socialLinks
    }
  `;
  return fetchSanity<FooterType>({ query });
}

export async function getHomepage({ language }: Params) {
  if (!language) {
    throw new Error("Language parameter is required");
  }
  const query = groq`
    *[_type == "homepage" && language == $language][0] {
      ...,
      title,
      ${contentBlocksProjection}
    }
  `;

  const params = { language };
  const data = await fetchSanity<Homepage>({ query, params });
  return data;
}

export async function getPageBySlug({
  language,
  slug,
}: {
  slug: string;
  language?: string | null;
}) {
  if (!slug) {
    throw new Error("Slug parameter is required");
  }

  let query: string;
  let params: Record<string, any>;

  if (language) {
    query = groq`
      *[_type == "page" &&
        (
          (defined(language) && language == $language) ||
          !defined(language)
        ) &&
        slug.current == $slug
      ][0] {
        ...,
        title,
        ${contentBlocksProjection}
      }
    `;
    params = { slug, language };
  } else {
    query = groq`
      *[_type == "page" &&
        slug.current == $slug
      ][0] {
        ...,
        title,
        ${contentBlocksProjection}
      }
    `;
    params = { slug };
  }

  return fetchSanity<PageType>({ query, params });
}
