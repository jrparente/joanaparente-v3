import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjectSlugs } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { RichText } from "@/components/portabletext/RichText";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { TrackProjectView } from "@/components/analytics/TrackProjectView";
import { TrackCtaClick } from "@/components/analytics/TrackCtaClick";
import { localizedPath } from "@/lib/utils";

const projectTypeLabels: Record<string, Record<string, string>> = {
  pt: { website: "Website", webapp: "Web App", "e-commerce": "E-Commerce" },
  en: { website: "Website", webapp: "Web App", "e-commerce": "E-Commerce" },
};

const industryLabels: Record<string, Record<string, string>> = {
  pt: {
    "tourism-activities": "Turismo & Atividades",
    "tourism-hospitality": "Turismo & Hotelaria",
    "photography-creative": "Fotografia & Criativo",
    "food-beverage": "Alimentação & Bebidas",
    consulting: "Consultoria",
    other: "Outro",
  },
  en: {
    "tourism-activities": "Tourism & Activities",
    "tourism-hospitality": "Tourism & Hospitality",
    "photography-creative": "Photography & Creative",
    "food-beverage": "Food & Beverage",
    consulting: "Consulting",
    other: "Other",
  },
};

const labels: Record<string, Record<string, string>> = {
  pt: {
    objective: "O Objetivo",
    solution: "A Solução",
    keyFeatures: "Funcionalidades",
    challenges: "Desafios",
    impact: "Impacto",
    gallery: "Galeria",
    cta: "Quer resultados semelhantes?",
    ctaBtn: "Fale comigo",
    visitSite: "Visitar site",
    sourceCode: "Código fonte",
    role: "Função",
    duration: "Duração",
    type: "Tipo",
    techStack: "Tecnologias",
    backToProjects: "← Todos os projetos",
  },
  en: {
    objective: "The Objective",
    solution: "The Solution",
    keyFeatures: "Key Features",
    challenges: "Challenges",
    impact: "Impact",
    gallery: "Gallery",
    cta: "Want similar results?",
    ctaBtn: "Let's talk",
    visitSite: "Visit site",
    sourceCode: "Source code",
    role: "Role",
    duration: "Duration",
    type: "Type",
    techStack: "Tech Stack",
    backToProjects: "← All projects",
  },
};

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
  const imageUrl = project.image?.asset
    ? urlFor(project.image).width(1200).height(630).url()
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

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ language: string; slug: string }>;
}) {
  const { language, slug } = await params;
  const project = await getProject({ slug, language });

  if (!project) return notFound();

  const l = labels[language] || labels.en;
  const typeLabels = projectTypeLabels[language] || projectTypeLabels.en;
  const imageUrl = project.image?.asset
    ? urlFor(project.image).width(1200).height(630).url()
    : undefined;

  return (
    <main className="flex flex-col items-center justify-start pb-16">
      <TrackProjectView projectSlug={slug} pageLanguage={language} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getCreativeWorkJsonLd(project, language, slug, imageUrl)
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd(project.title, language, slug)
          ),
        }}
      />
      {/* Hero */}
      <section className="w-full bg-background pt-8 md:pt-12 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <Link
            href={`/${language}/${localizedPath("projects", language)}`}
            className="text-sm font-sans font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block"
          >
            {l.backToProjects}
          </Link>

          <div className="grid gap-8 md:grid-cols-[1fr_300px] items-start">
            <div>
              {/* Industry tag */}
              {project.clientIndustry && (
                <span className="inline-block mb-3 rounded-full bg-[var(--color-accent-light)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-dark)]">
                  {industryLabels[language]?.[project.clientIndustry] ||
                    project.clientIndustry}
                </span>
              )}

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {project.title}
              </h1>
              {project.tagline && (
                <p className="mt-3 text-xl text-muted-foreground">
                  {project.tagline}
                </p>
              )}
              {project.subtitle && (
                <p className="mt-2 text-lg text-muted-foreground/80">
                  {project.subtitle}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                {project.liveUrl && (
                  <Button asChild>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {l.visitSite} <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
                {project.sourceCodeUrl && (
                  <Button asChild variant="outline">
                    <a
                      href={project.sourceCodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {l.sourceCode} <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-4 rounded-lg border border-border p-5 bg-card">
              {project.role && (
                <div>
                  <dt className="text-xs font-sans font-medium uppercase tracking-widest text-muted-foreground">
                    {l.role}
                  </dt>
                  <dd className="mt-1 text-sm font-medium">{project.role}</dd>
                </div>
              )}
              {project.projectType && (
                <div>
                  <dt className="text-xs font-sans font-medium uppercase tracking-widest text-muted-foreground">
                    {l.type}
                  </dt>
                  <dd className="mt-1 text-sm font-medium">
                    {typeLabels[project.projectType] || project.projectType}
                  </dd>
                </div>
              )}
              {project.duration && (
                <div>
                  <dt className="text-xs font-sans font-medium uppercase tracking-widest text-muted-foreground">
                    {l.duration}
                  </dt>
                  <dd className="mt-1 text-sm font-medium">
                    {project.duration}
                  </dd>
                </div>
              )}
              {project.techStack?.logos && project.techStack.logos.length > 0 && (
                <div>
                  <dt className="text-xs font-sans font-medium uppercase tracking-widest text-muted-foreground">
                    {l.techStack}
                  </dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {project.techStack.logos.map((logo) => (
                      <span
                        key={logo._id}
                        className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                      >
                        {logo.name}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Featured Screenshot (case study hero) or Main Image fallback */}
      {(project.featuredScreenshot?.asset || project.image?.asset) && (
        <section className="w-full">
          <div className="max-w-6xl mx-auto px-4">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
              <Image
                src={
                  project.featuredScreenshot?.asset
                    ? urlFor(project.featuredScreenshot)
                        .width(1600)
                        .height(900)
                        .url()
                    : urlFor(project.image).width(1600).height(900).url()
                }
                alt={
                  project.featuredScreenshot?.alt ??
                  project.image.alt ??
                  project.title
                }
                fill
                className="object-cover"
                priority
                sizes="(min-width: 1024px) 1152px, 100vw"
              />
            </div>
            {project.featuredScreenshot?.caption && (
              <p className="mt-2 text-sm text-muted-foreground text-center">
                {project.featuredScreenshot.caption}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Business Metrics Bar */}
      {project.businessMetrics && project.businessMetrics.length > 0 && (
        <section className="w-full">
          <div className="max-w-6xl mx-auto px-4 mt-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.businessMetrics.map((metric, i) => (
                <div
                  key={i}
                  className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 text-center"
                >
                  <p className="font-heading font-bold text-[var(--text-3xl)] text-[var(--color-brand)]">
                    {metric.value}
                  </p>
                  <p className="mt-1 font-sans font-medium text-[var(--text-sm)] text-muted-foreground">
                    {metric.label}
                  </p>
                  {metric.context && (
                    <p className="mt-0.5 font-sans text-[var(--text-xs)] text-[var(--color-text-subtle)]">
                      {metric.context}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content sections */}
      <div className="w-full max-w-4xl mx-auto px-4 mt-12 space-y-16">
        {/* Objective */}
        {project.objective && project.objective.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              {l.objective}
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <RichText value={project.objective} />
            </div>
          </section>
        )}

        {/* Solution / Description */}
        {project.description && project.description.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              {l.solution}
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <RichText value={project.description} />
            </div>
          </section>
        )}

        {/* Key Features */}
        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              {l.keyFeatures}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.keyFeatures.map((feature, i) => (
                <div
                  key={feature._key || i}
                  className="rounded-lg border border-border p-5 bg-card"
                >
                  <h3 className="font-semibold">{feature.title}</h3>
                  {feature.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Challenges */}
        {project.challenges && project.challenges.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              {l.challenges}
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <RichText value={project.challenges} />
            </div>
          </section>
        )}

        {/* Impact */}
        {project.impact && project.impact.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              {l.impact}
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <RichText value={project.impact} />
            </div>
          </section>
        )}

        {/* Photo Gallery */}
        {project.photoGallery && project.photoGallery.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              {l.gallery}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.photoGallery.map((photo, i) => (
                <div key={i} className="relative aspect-[16/10] overflow-hidden rounded-lg">
                  <Image
                    src={urlFor(photo).width(800).height(500).url()}
                    alt={photo.alt ?? `${project.title} screenshot ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Product Bridge */}
        {project.productBridge?.productName && (
          <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 md:p-8">
            <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[var(--color-brand)] mb-2">
              {language === "pt" ? "Recurso relacionado" : "Related resource"}
            </p>
            <h3 className="text-xl font-bold tracking-tight">
              {project.productBridge.productName}
            </h3>
            {project.productBridge.productTeaser && (
              <p className="mt-2 text-muted-foreground">
                {project.productBridge.productTeaser}
              </p>
            )}
            <div className="mt-4 flex items-center gap-4">
              {project.productBridge.productUrl && (
                <Button asChild variant="outline">
                  <a
                    href={project.productBridge.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {language === "pt" ? "Saber mais" : "Learn more"}
                  </a>
                </Button>
              )}
              {project.productBridge.productPrice && (
                <span className="text-sm font-medium text-muted-foreground">
                  {project.productBridge.productPrice}
                </span>
              )}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="rounded-[var(--radius-xl)] bg-primary p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-primary-foreground">
            {project.transformationStatement || l.cta}
          </h2>
          <div className="mt-6">
            <TrackCtaClick
              ctaLocation="project_detail"
              pageLanguage={language}
            >
              <Button asChild variant="secondary" size="lg">
                <Link href={`/${language}/${localizedPath("contact", language)}`}>{l.ctaBtn}</Link>
              </Button>
            </TrackCtaClick>
          </div>
        </section>
      </div>
    </main>
  );
}
