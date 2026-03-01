import { groq } from "next-sanity";
import { fetchSanity } from "./fetch";
import { client } from "./client";
import {
  FooterType,
  Homepage,
  NavigationType,
  PageType,
  ProjectCardType,
  ProjectType,
  SiteSettingsType,
} from "@/types/Sanity";

type Params = {
  language: string | null;
};

const linkProjection = `{
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
}`;

// Define as a regular string (not groq template)
export const contentBlocksProjection = `
  contentBlocks[visible != false] {
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
      buttonLink ${linkProjection}
    },
    _type == "intro" => {
      ...,
      _type,
      _key,
      heading,
      subheading,
      anchor,
      byline,
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
    },
    _type == "cta" => {
      ...,
      _type,
      _key,
      title,
      description,
      buttonLink ${linkProjection},
      buttonLink2 ${linkProjection}
    },
    _type == "richText" => {
      ...,
      _type,
      _key,
      eyebrow,
      heading,
      variant,
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
    _type == "projectList" => {
      ...,
      _type,
      _key,
      eyebrow,
      title,
      description,
      headingLevel,
      maxProjects,
      showViewAll,
      viewAllLabel,
      emptyStateText
    },
    _type == "contactSection" => {
      ...,
      _type,
      _key,
      eyebrow,
      heading,
      intro,
      emailLabel,
      linkedinLabel,
      location,
      microcopy,
      backLabel
    },
    _type == "processSteps" => {
      ...,
      _type,
      _key,
      eyebrow,
      heading,
      steps[]{ icon, title, description }
    },
    _type == "heroHome" => {
      ...,
      _type,
      _key,
      eyebrow,
      heading,
      subheading,
      description,
      ctaPrimary ${linkProjection},
      ctaSecondary ${linkProjection},
      proofStrip[] { value, label }
    },
    _type == "serviceTierPreview" => {
      ...,
      _type,
      _key,
      eyebrow,
      heading,
      tiers[] {
        name,
        tagline,
        startingPrice,
        highlights[],
        highlighted
      },
      ctaLink ${linkProjection}
    },
    _type == "serviceTiers" => {
      ...,
      _type,
      _key,
      eyebrow,
      heading,
      footnote,
      tiers[] {
        name,
        subtitle,
        priceRange,
        features[],
        highlighted,
        timeline,
        badgeLabel,
        proofLabel,
        proofLink,
        ctaLabel,
        ctaLink ${linkProjection}
      }
    },
    _type == "testimonials" => {
      ...,
      _type,
      _key,
      eyebrow,
      heading,
      items[] {
        quote,
        authorName,
        authorRole,
        authorCompany,
        authorImage {
          asset->{ _id, url, metadata { lqip } },
          alt
        }
      }
    },
    _type == "faqAccordion" => {
      ...,
      _type,
      _key,
      eyebrow,
      heading,
      items[] {
        question,
        answer
      },
      generateJsonLd
    },
    _type == "connectStrip" => {
      ...,
      _type,
      _key,
      label,
      links[] {
        label,
        url
      }
    },
    _type == "metricBar" => {
      ...,
      _type,
      _key,
      items[] {
        value,
        label
      }
    },
    _type == "caseStudySpotlight" => {
      ...,
      _type,
      _key,
      heading,
      project-> {
        title,
        "slug": slug.current,
        transformationStatement,
        businessMetrics[] {
          label,
          value,
          context
        },
        image {
          asset->{ _id, url, metadata { lqip } },
          alt
        }
      },
      highlightMetrics,
      ctaLabel
    },
    _type == "contactForm" => {
      ...,
      _type,
      _key,
      heading,
      subheading,
      submitLabel,
      successMessage,
      nameFieldLabel,
      emailFieldLabel,
      companyFieldLabel,
      projectTypeFieldLabel,
      projectTypeOptions,
      budgetRangeFieldLabel,
      budgetRangeOptions,
      messageFieldLabel,
      messageFieldPlaceholder,
      languagePreferenceLabel,
      validationMessages {
        required,
        minLength,
        invalidEmail,
        submitError
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

export async function getNavigation(language: string) {
  const query = groq`
    *[_type == "navigation" && language == $language][0] {
      title,
      items[] ${linkProjection}
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
      ${contentBlocksProjection},
      "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
        "slug": slug.current,
        language
      }
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
        ${contentBlocksProjection},
        "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
          "slug": slug.current,
          language
        }
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
        ${contentBlocksProjection},
        "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
          "slug": slug.current,
          language
        }
      }
    `;
    params = { slug };
  }

  return fetchSanity<PageType>({ query, params });
}

// Uses client directly to avoid draftMode() call in generateStaticParams
export async function getPageSlugs() {
  const query = groq`
    *[_type == "page" && defined(slug.current) && defined(language)] {
      "slug": slug.current,
      language
    }
  `;

  return client.fetch<{ slug: string; language: string }[]>(query);
}

// Uses client directly to avoid draftMode() call in sitemap generation
export async function getPagesWithTranslations() {
  const query = groq`
    *[_type == "page" && defined(slug.current) && defined(language)] {
      "slug": slug.current,
      language,
      "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
        "slug": slug.current,
        language
      }
    }
  `;
  return client.fetch<
    Array<{
      slug: string;
      language: string;
      _translations: Array<{ slug: string; language: string }>;
    }>
  >(query);
}

// ─── Project Queries ───────────────────────────────────────────────

export async function getProjects({ language }: Params) {
  const query = language
    ? groq`
        *[_type == "project" && language == $language] | order(date desc) {
          _id,
          title,
          slug,
          tagline,
          subtitle,
          image,
          projectCategory,
          projectType,
          clientIndustry,
          techStack {
            title,
            logos[]-> {
              _id,
              name,
              image
            }
          },
          businessMetrics[] {
            label,
            value,
            context
          }
        }
      `
    : groq`
        *[_type == "project"] | order(date desc) {
          _id,
          title,
          slug,
          tagline,
          subtitle,
          image,
          projectCategory,
          projectType,
          clientIndustry,
          techStack {
            title,
            logos[]-> {
              _id,
              name,
              image
            }
          },
          businessMetrics[] {
            label,
            value,
            context
          }
        }
      `;

  return fetchSanity<ProjectCardType[]>({
    query,
    params: language ? { language } : {},
  });
}

export async function getProject({
  slug,
  language,
}: {
  slug: string;
  language: string;
}) {
  const query = groq`
    *[_type == "project" && slug.current == $slug && language == $language][0] {
      _id,
      _type,
      title,
      slug,
      tagline,
      subtitle,
      description,
      objective,
      clientIndustry,
      businessMetrics,
      transformationStatement,
      productBridge,
      liveUrl,
      sourceCodeUrl,
      date,
      duration,
      image,
      featuredScreenshot {
        ...,
        asset->{
          _id,
          url
        }
      },
      photoGallery[] {
        ...,
        asset->{
          _id,
          url
        }
      },
      keyFeatures,
      projectCategory,
      projectType,
      techStack {
        title,
        logos[]-> {
          _id,
          name,
          image
        }
      },
      role,
      projectScope,
      challenges,
      impact,
      seo {
        title,
        metaDescription,
        keywords,
        defaultOgImage {
          asset->{ url }
        },
        noIndex
      },
      language,
      "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
        "slug": slug.current,
        language
      }
    }
  `;

  return fetchSanity<ProjectType>({
    query,
    params: { slug, language },
  });
}

// Uses client directly to avoid draftMode() call in generateStaticParams
export async function getProjectSlugs() {
  const query = groq`
    *[_type == "project" && defined(slug.current)] {
      "slug": slug.current,
      language
    }
  `;

  return client.fetch<{ slug: string; language: string }[]>(query);
}
