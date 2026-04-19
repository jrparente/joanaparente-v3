import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjectSlugs } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { TrackProjectView } from "@/components/analytics/TrackProjectView";
import { TrackExternalLink } from "@/components/analytics/TrackExternalLink";
import { localizedPath } from "@/lib/utils";
import ContentBlocks from "@/components/ContentBlocks";
import { renderAccentHeading } from "@/components/portabletext/renderAccentHeading";

// ─── Helpers ────────────────────────────────────────────────────────

/** Extract hostname from URL for display */
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// ─── SVG icons ──────────────────────────────────────────────────────

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Zm7.97-2.03a.75.75 0 0 1 1.06 0l3.5 3.5a.75.75 0 0 1-1.06 1.06l-2.22-2.22V12a.75.75 0 0 1-1.5 0V5.81l-2.22 2.22a.75.75 0 1 1-1.06-1.06l3.5-3.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ─── Static params & metadata ───────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map(({ slug, language }) => ({ slug, language }));
}

const BASE_URL = "https://www.joanaparente.com";

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ language: string; slug: string }>;
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { language, slug } = await params;
  const project = await getProject({ slug, language });

  if (!project) return { title: "Project Not Found" };

  const resolvedTitle =
    project.seo?.title || `${project.title} | Joana Parente`;
  const resolvedDescription =
    project.seo?.metaDescription || project.tagline || project.subtitle;

  const ogImageSource = project.featuredScreenshot?.asset
    ? project.featuredScreenshot
    : project.image?.asset
      ? project.image
      : undefined;
  const imageUrl = ogImageSource
    ? urlFor(ogImageSource).width(1200).height(630).url()
    : undefined;

  const parentImages = (await parent).openGraph?.images || [];

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical: `${BASE_URL}/${language}/${localizedPath("projects", language)}/${slug}`,
      languages: {
        pt: `${BASE_URL}/pt/${localizedPath("projects", "pt")}/${slug}`,
        en: `${BASE_URL}/en/${localizedPath("projects", "en")}/${slug}`,
        "x-default": `${BASE_URL}/pt/${localizedPath("projects", "pt")}/${slug}`,
      },
    },
    openGraph: {
      title: project.title,
      description: project.tagline,
      url: `${BASE_URL}/${language}/${localizedPath("projects", language)}/${slug}`,
      images: imageUrl ? [{ url: imageUrl }] : parentImages,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

// ─── JSON-LD structured data ────────────────────────────────────────

function getCreativeWorkJsonLd(
  project: import("@/types/Sanity").ProjectType,
  language: string,
  slug: string,
  imageUrl?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.tagline || project.subtitle,
    url: `https://www.joanaparente.com/${language}/${localizedPath("projects", language)}/${slug}`,
    ...(project.date && { dateCreated: project.date }),
    ...(imageUrl && { image: imageUrl }),
    author: {
      "@type": "Person",
      "@id": "https://www.joanaparente.com/#person",
      name: "Joana Parente",
    },
    ...(project.techStack?.logos?.length && {
      keywords: project.techStack.logos.map((l) => l.name).join(", "),
    }),
  };
}

function getBreadcrumbJsonLd(
  projectTitle: string,
  language: string,
  slug: string
) {
  const homeLabel = language === "pt" ? "Início" : "Home";
  const projectsLabel = language === "pt" ? "Projetos" : "Projects";

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: homeLabel,
        item: `https://www.joanaparente.com/${language}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: projectsLabel,
        item: `https://www.joanaparente.com/${language}/${localizedPath("projects", language)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: projectTitle,
        item: `https://www.joanaparente.com/${language}/${localizedPath("projects", language)}/${slug}`,
      },
    ],
  };
}

// ─── Page component ─────────────────────────────────────────────────

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ language: string; slug: string }>;
}) {
  const { language, slug } = await params;
  const project = await getProject({ slug, language });

  if (!project) return notFound();

  const imageUrl = project.featuredScreenshot?.asset
    ? urlFor(project.featuredScreenshot).width(1200).height(630).url()
    : project.image?.asset
      ? urlFor(project.image).width(1200).height(630).url()
      : undefined;

  const domain = project.liveUrl ? extractDomain(project.liveUrl) : "";

  const creativeWorkLd = JSON.stringify(
    getCreativeWorkJsonLd(project, language, slug, imageUrl)
  );
  const breadcrumbLd = JSON.stringify(
    getBreadcrumbJsonLd(project.title, language, slug)
  );

  const defaultEyebrow = language === "pt" ? "Caso de Estudo" : "Case Study";
  const defaultBackLabel =
    language === "pt" ? "Todos os projetos" : "All projects";

  return (
    <main id="main-content">
      {/* JSON-LD structured data (safe: serialized from our own Sanity CMS data) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: creativeWorkLd }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbLd }}
      />

      {/* Analytics */}
      <TrackProjectView projectSlug={slug} pageLanguage={language} />

      {/* ════════ Hero (fixed, from document-level fields) ════════ */}
      <section
        className="case-study-hero relative z-[1] mx-auto max-w-[1200px] px-8 pt-20 pb-16 text-center md:pt-24"
        aria-labelledby="hero-heading"
      >
        <div className="mx-auto max-w-[780px]">
          {/* Back link */}
          <Link
            href={`/${language}/${localizedPath("projects", language)}`}
            className="group mx-auto mb-6 flex w-fit items-center gap-1.5 font-sans text-[length:var(--text-sm)] font-medium text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-brand)]"
          >
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-200 group-hover:-translate-x-[3px]"
            >
              &larr;
            </span>
            {project.backLabel || defaultBackLabel}
          </Link>

          {/* Eyebrow */}
          <p className="section-eyebrow">
            {project.eyebrowLabel || defaultEyebrow}
          </p>

          {/* Title */}
          <h1
            id="hero-heading"
            className="section-heading mb-6 text-[length:var(--text-4xl)] leading-[1.15] tracking-[-0.025em]"
          >
            {renderAccentHeading(project.tagline || project.title)}
          </h1>

          {/* Subtitle */}
          {project.subtitle && (
            <p className="hero-sub mx-auto max-w-[620px] font-sans text-[length:var(--text-lg)] font-normal leading-[1.65] text-[var(--color-text-muted)]">
              {project.subtitle}
            </p>
          )}

          {/* Visit site button */}
          {project.liveUrl && (
            <TrackExternalLink destinationUrl={project.liveUrl} linkType="project_visit_site">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${domain} (opens in new tab)`}
                className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius-md)] border-[1.5px] border-[var(--color-brand)] px-5 py-2.5 font-sans text-[length:var(--text-sm)] font-semibold text-[var(--color-brand)] transition-all duration-200 hover:bg-[var(--color-brand)] hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--color-brand)] focus-visible:outline-offset-2"
              >
                Visit {domain}
                <ExternalLinkIcon className="h-3.5 w-3.5 transition-transform duration-200" />
              </a>
            </TrackExternalLink>
          )}
        </div>
      </section>

      {/* ════════ Featured Screenshot (browser frame) ════════ */}
      {project.featuredScreenshot?.asset && (
        <figure className="relative z-[1] mx-auto max-w-[680px] px-8 my-10">
          <div className="overflow-hidden rounded-lg bg-[var(--color-surface)] shadow-lg">
            {/* Browser bar */}
            <div className="flex items-center gap-1.5 bg-[var(--color-surface-elevated)] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" aria-hidden="true" />
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${domain} (opens in new tab)`}
                  className="group/addr ml-2 flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--color-surface)] px-3 py-1 font-sans text-[0.7rem] font-normal tracking-[0.01em] text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-brand)]"
                >
                  {domain}
                  <ExternalLinkIcon className="h-2.5 w-2.5 flex-shrink-0 opacity-0 transition-all duration-200 group-hover/addr:translate-x-px group-hover/addr:-translate-y-px group-hover/addr:opacity-100" />
                </a>
              )}
            </div>
            {/* Screenshot */}
            <div className="relative aspect-[16/10]">
              <Image
                src={urlFor(project.featuredScreenshot).width(1360).height(850).url()}
                alt={project.featuredScreenshot.alt || `${project.title} screenshot`}
                fill
                className="object-cover"
                priority
                sizes="(min-width: 768px) 680px, 100vw"
              />
            </div>
          </div>
        </figure>
      )}

      {/* ════════ Content Blocks (modular, CMS-driven) ════════ */}
      <ContentBlocks
        contentBlock={project.caseStudyBlocks || []}
        language={language}
      />
    </main>
  );
}
