import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getProject, getProjectSlugs } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { RichText } from "@/components/portabletext/RichText";
import { TrackProjectView } from "@/components/analytics/TrackProjectView";
import { TrackCtaClick } from "@/components/analytics/TrackCtaClick";
import { localizedPath } from "@/lib/utils";

// ─── Bilingual fallback labels ──────────────────────────────────────

const fallbacks = {
  pt: {
    backLabel: "Todos os projetos",
    eyebrow: "Caso de Estudo",
    objectiveEyebrow: "O objetivo",
    objectiveHeading: "O que definimos construir",
    challengesEyebrow: "O desafio",
    challengesHeading: "Como o projeto se desenrolou",
    impactEyebrow: "O impacto",
    impactHeading: "O que mudou",
    takeawayEyebrow: "A conclusão",
    takeawayHeading: "O que aprendi",
    techStackEyebrow: "Construído com",
    techStackHeading: "Stack tecnológico",
    relatedEyebrow: "Mais trabalho",
    relatedHeading: "Projetos relacionados",
    viewCaseStudy: "Ver caso de estudo",
    ctaFallback: "Vamos trabalhar juntos?",
    ctaButton: "Iniciar conversa",
  },
  en: {
    backLabel: "All projects",
    eyebrow: "Case Study",
    objectiveEyebrow: "The objective",
    objectiveHeading: "What we set out to build",
    challengesEyebrow: "The challenge",
    challengesHeading: "How the project unfolded",
    impactEyebrow: "The impact",
    impactHeading: "What changed",
    takeawayEyebrow: "The takeaway",
    takeawayHeading: "What I learned",
    techStackEyebrow: "Built with",
    techStackHeading: "Tech stack",
    relatedEyebrow: "More work",
    relatedHeading: "Related projects",
    viewCaseStudy: "View case study",
    ctaFallback: "Shall we work together?",
    ctaButton: "Start a conversation",
  },
} as const;

type FallbackLang = keyof typeof fallbacks;

function fb(language: string) {
  return fallbacks[(language as FallbackLang) in fallbacks ? (language as FallbackLang) : "en"];
}

// ─── Helpers ────────────────────────────────────────────────────────

/** Parse [[text]] into <em> accent spans (same pattern as Hero.tsx) */
function renderAccentHeading(text: string): ReactNode[] {
  const parts = text.split(/(\[\[.*?\]\])/g);
  return parts.map((part, i) => {
    if (part.startsWith("[[") && part.endsWith("]]")) {
      return (
        <em key={i} className="italic text-[var(--color-brand)]">
          {part.slice(2, -2)}
        </em>
      );
    }
    return part;
  });
}

/** Extract hostname from URL for display in address bar / button */
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// ─── SVG icons (from prototype) ─────────────────────────────────────

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

function ArrowRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-[3px]"
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.638l-3.96-3.96a.75.75 0 1 1 1.06-1.06l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06l3.96-3.96H3.75A.75.75 0 0 1 3 10Z"
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string; slug: string }>;
}): Promise<Metadata> {
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
      images: imageUrl ? [{ url: imageUrl }] : undefined,
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

  const sl = project.sectionLabels;
  const f = fb(language);
  const domain = project.liveUrl ? extractDomain(project.liveUrl) : "";

  const creativeWorkLd = JSON.stringify(
    getCreativeWorkJsonLd(project, language, slug, imageUrl)
  );
  const breadcrumbLd = JSON.stringify(
    getBreadcrumbJsonLd(project.title, language, slug)
  );

  return (
    /* [H1] Page provides its own <main> landmark (layout.tsx doesn't) */
    <main id="main-content">
      {/* JSON-LD structured data (safe: serialized from our own Sanity CMS data) */}
      {/* [L3] Removed suppressHydrationWarning — unnecessary in Server Component */}
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

      {/* ════════ Section 1: Hero ════════ */}
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
            {/* [H3] Bilingual fallback */}
            {project.backLabel || f.backLabel}
          </Link>

          {/* Eyebrow */}
          <p className="section-eyebrow">
            {project.eyebrowLabel || f.eyebrow}
          </p>

          {/* Title */}
          <h1
            id="hero-heading"
            className="section-heading mb-6 text-[length:var(--text-4xl)] leading-[1.15] tracking-[-0.025em]"
          >
            {renderAccentHeading(project.title)}
          </h1>

          {/* Subtitle */}
          {project.subtitle && (
            <p className="hero-sub mx-auto max-w-[620px] font-sans text-[length:var(--text-lg)] font-normal leading-[1.65] text-[var(--color-text-muted)]">
              {project.subtitle}
            </p>
          )}

          {/* [M2] Visit site button — aria-label indicates new tab */}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${sl?.visitSiteLabel || `Visit ${domain}`} (opens in new tab)`}
              className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius-md)] border-[1.5px] border-[var(--color-brand)] px-5 py-2.5 font-sans text-[length:var(--text-sm)] font-semibold text-[var(--color-brand)] transition-all duration-200 hover:bg-[var(--color-brand)] hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--color-brand)] focus-visible:outline-offset-2"
            >
              {sl?.visitSiteLabel || `Visit ${domain}`}
              <ExternalLinkIcon className="h-3.5 w-3.5 transition-transform duration-200" />
            </a>
          )}
        </div>
      </section>

      {/* ════════ Section 2: Featured Screenshot ════════ */}
      {/* [H4] Wrapped in <figure> for semantics */}
      {project.featuredScreenshot?.asset && (
        <figure className="relative z-[1] mx-auto max-w-[680px] px-8">
          {/* [C1] Dark mode: use token bg instead of hardcoded white */}
          <div className="overflow-hidden rounded-lg bg-[var(--color-surface)] shadow-lg">
            {/* Browser bar */}
            <div className="flex items-center gap-1.5 bg-[var(--color-surface-elevated)] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" aria-hidden="true" />
              {/* [M1] Address bar with accessible label */}
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

      {/* ════════ Section 3: Metric Bar ════════ */}
      {project.businessMetrics && project.businessMetrics.length > 0 && (
        <section
          className="metric-bar relative z-[1] mt-16 border-t border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-10"
          aria-label="Project metrics"
        >
          <dl className="mx-auto flex max-w-[1200px] flex-col items-center gap-6 px-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-0">
            {project.businessMetrics.map((metric, i) => (
              <div
                key={metric.label}
                className={`flex flex-col items-center gap-1.5 px-10 sm:flex-[0_0_50%] sm:px-8 md:flex-initial ${
                  i < project.businessMetrics!.length - 1
                    ? "max-md:border-b-0 md:border-r md:border-[var(--color-border)]"
                    : ""
                }`}
              >
                {/* [H2] Correct semantic order: dt (term) before dd (definition) */}
                <dt className="order-2 text-center font-sans text-[length:var(--text-sm)] font-normal text-[var(--color-text-muted)]">
                  {metric.label}
                </dt>
                <dd className="order-1 whitespace-nowrap font-heading text-[length:var(--text-2xl)] font-semibold text-[var(--color-text)] [font-variant-numeric:tabular-nums] [font-variation-settings:'WONK'_0]">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* ════════ Section 4: Objective ════════ */}
      {project.objective && project.objective.length > 0 && (
        <section
          className="relative z-[1] py-16 md:py-24"
          aria-labelledby="objective-heading"
        >
          <div className="mx-auto max-w-[680px] px-8">
            <div className="mb-10">
              <p className="section-eyebrow">
                {sl?.objectiveEyebrow || f.objectiveEyebrow}
              </p>
              <h2 className="section-heading" id="objective-heading">
                {sl?.objectiveHeading || f.objectiveHeading}
              </h2>
            </div>
            <div className="case-study-prose">
              <RichText value={project.objective} />
            </div>
          </div>
        </section>
      )}

      {/* ════════ Section 5: Challenges ════════ */}
      {project.challenges && project.challenges.length > 0 && (
        <section
          className="relative z-[1] border-t border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-16 md:py-24"
          aria-labelledby="challenges-heading"
        >
          <div className="mx-auto max-w-[680px] px-8">
            <div className="mb-10">
              <p className="section-eyebrow">
                {sl?.challengesEyebrow || f.challengesEyebrow}
              </p>
              <h2 className="section-heading" id="challenges-heading">
                {sl?.challengesHeading || f.challengesHeading}
              </h2>
            </div>
            <div className="case-study-prose">
              <RichText value={project.challenges} />
            </div>
          </div>
        </section>
      )}

      {/* ════════ Section 6: Impact ════════ */}
      {project.impact && project.impact.length > 0 && (
        <section
          className="relative z-[1] py-16 md:py-24"
          aria-labelledby="impact-heading"
        >
          <div className="mx-auto max-w-[680px] px-8">
            <div className="mb-10">
              <p className="section-eyebrow">
                {sl?.impactEyebrow || f.impactEyebrow}
              </p>
              <h2 className="section-heading" id="impact-heading">
                {sl?.impactHeading || f.impactHeading}
              </h2>
            </div>
            <div className="case-study-prose">
              <RichText value={project.impact} />
            </div>
          </div>
        </section>
      )}

      {/* ════════ Section 7: Takeaway ════════ */}
      {project.takeaway && project.takeaway.length > 0 && (
        <section
          className="relative z-[1] py-16 md:py-24"
          aria-labelledby="takeaway-heading"
        >
          <div className="mx-auto max-w-[680px] px-8">
            <div className="mb-10">
              <p className="section-eyebrow">
                {sl?.takeawayEyebrow || f.takeawayEyebrow}
              </p>
              <h2 className="section-heading" id="takeaway-heading">
                {sl?.takeawayHeading || f.takeawayHeading}
              </h2>
            </div>
            <div className="my-12 border-l-4 border-[var(--color-brand)] py-6 pl-7 max-sm:border-l-2 max-sm:pl-5">
              {/* Lead sentence — first block */}
              <PortableText
                value={[project.takeaway[0]]}
                components={{
                  block: {
                    normal: ({ children }) => (
                      <p className="font-heading text-[length:var(--text-2xl)] italic font-normal leading-[1.35] text-[var(--color-brand)] [font-variation-settings:'WONK'_0]">
                        {children}
                      </p>
                    ),
                  },
                }}
              />
              {/* Body — remaining blocks */}
              {project.takeaway.length > 1 && (
                <div className="mt-6">
                  <PortableText
                    value={project.takeaway.slice(1)}
                    components={{
                      block: {
                        normal: ({ children }) => (
                          <p className="mt-6 font-sans text-[length:var(--text-lg)] font-normal leading-[1.75] text-[var(--color-text)] first:mt-0">
                            {children}
                          </p>
                        ),
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ════════ Section 8: Transformation Statement ════════ */}
      {/* [C1] Dark mode: use CSS class instead of inline oklch */}
      {project.transformationStatement && (
        <section
          className="relative z-[1] border-t border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-16 text-center md:py-20"
          aria-label="Transformation statement"
        >
          <div className="mx-auto max-w-[680px] px-8">
            <p className="section-heading text-[length:var(--text-3xl)] leading-[1.25]">
              {project.transformationStatement}
            </p>
          </div>
        </section>
      )}

      {/* ════════ Section 9: Testimonial (HOLD) ════════ */}
      {project.clientTestimonial?.quote && (
        <section className="relative z-[1] py-16 md:py-20">
          <div className="mx-auto max-w-[680px] px-8 text-center">
            <blockquote>
              <p className="font-heading text-[length:var(--text-2xl)] italic font-normal leading-[1.35] text-[var(--color-brand)] [font-variation-settings:'WONK'_0]">
                &ldquo;{project.clientTestimonial.quote}&rdquo;
              </p>
              <cite className="mt-4 block text-[length:var(--text-sm)] not-italic text-[var(--color-text-muted)]">
                {project.clientTestimonial.authorName}
                {project.clientTestimonial.authorRole &&
                  `, ${project.clientTestimonial.authorRole}`}
                {project.clientTestimonial.authorCompany &&
                  ` — ${project.clientTestimonial.authorCompany}`}
              </cite>
            </blockquote>
          </div>
        </section>
      )}

      {/* ════════ Section 10: Tech Stack ════════ */}
      {project.techStack?.logos && project.techStack.logos.length > 0 && (
        <section
          className="relative z-[1] border-t border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-12 md:py-16"
          aria-labelledby="tech-heading"
        >
          <div className="mx-auto max-w-[680px] px-8">
            <div className="mb-8">
              <p className="section-eyebrow">
                {sl?.techStackEyebrow || f.techStackEyebrow}
              </p>
              <h2 className="section-heading" id="tech-heading">
                {sl?.techStackHeading || f.techStackHeading}
              </h2>
            </div>
            <ul className="flex flex-wrap gap-3">
              {project.techStack.logos.map((logo) => (
                <li
                  key={logo._id}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2 font-sans text-[length:var(--text-sm)] font-medium text-[var(--color-text)]"
                >
                  {logo.name}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ════════ Section 11: Related Work ════════ */}
      {/* [M4] Uses border-t only — avoids double border with tech stack's border-b */}
      {project.relatedProjects && project.relatedProjects.length > 0 && (
        <section
          className="relative z-[1] border-t border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-16 md:py-24"
          aria-labelledby="related-heading"
        >
          <div className="mx-auto max-w-[680px] px-8">
            <div className="mb-8">
              <p className="section-eyebrow">
                {sl?.relatedEyebrow || f.relatedEyebrow}
              </p>
              <h2 className="section-heading" id="related-heading">
                {sl?.relatedHeading || f.relatedHeading}
              </h2>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {project.relatedProjects.map((rp) => (
                <Link
                  key={rp._id}
                  href={`/${language}/${localizedPath("projects", language)}/${rp.slug}`}
                  className="group flex flex-col gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition-all duration-200 hover:border-[var(--color-brand)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[var(--color-brand)] focus-visible:outline-offset-2"
                >
                  <h3 className="section-heading text-[length:var(--text-xl)]">
                    {rp.title}
                  </h3>
                  <span className="font-sans text-[length:var(--text-sm)] leading-snug text-[var(--color-text-muted)]">
                    {rp.subtitle}
                  </span>
                  <span className="mt-auto pt-2 font-sans text-[length:var(--text-sm)] font-semibold text-[var(--color-brand)] group-hover:underline">
                    {f.viewCaseStudy} &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════ Section 12: CTA ════════ */}
      {/* [M5] Conditional: only render when there's CTA or transformation content */}
      {(project.ctaHeading || project.transformationStatement) && (
        <section
          className="relative z-[1] bg-[var(--color-brand)] py-16 md:py-20"
          aria-label="Get in touch"
        >
          <div className="mx-auto max-w-[1200px] px-8 text-center">
            <h2 className="font-heading text-[length:var(--text-3xl)] font-semibold leading-[1.2] text-white [font-variation-settings:'WONK'_0]">
              {project.ctaHeading || project.transformationStatement || f.ctaFallback}
            </h2>
            {project.ctaSubheading && (
              <p className="mx-auto mt-4 mb-8 max-w-[520px] font-sans text-[length:var(--text-lg)] leading-[1.65] text-white/85">
                {project.ctaSubheading}
              </p>
            )}
            <TrackCtaClick ctaLocation="project_detail" pageLanguage={language}>
              <Link
                href={`/${language}/${localizedPath("contact", language)}`}
                className="group mt-8 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-white px-8 py-3.5 font-sans text-[length:var(--text-base)] font-semibold text-[var(--color-brand)] transition-all duration-200 hover:bg-[var(--color-surface)] hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                {project.ctaButtonLabel || f.ctaButton}
                <ArrowRightIcon />
              </Link>
            </TrackCtaClick>
          </div>
        </section>
      )}
    </main>
  );
}
