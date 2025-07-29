import { groq } from "next-sanity";
import { fetchSanity } from "./fetch";
import { FooterType, Homepage, SiteSettingsType } from "@/types/Sanity";

type Params = {
  language: string;
};

// Define as a regular string (not groq template)
export const contentBlocksProjection = `
  contentBlocks[] {
    ...,
    _type == "hero" => {
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
