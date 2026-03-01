"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image";
import { ProjectCardType } from "@/types/Sanity";
import { trackPortfolioCardClick } from "@/lib/analytics";
import { localizedPath } from "@/lib/utils";

type Props = {
  project: ProjectCardType;
  language?: string;
  position?: number;
};

const projectTypeLabels: Record<string, string> = {
  website: "Website",
  webapp: "Web App",
  "e-commerce": "E-Commerce",
};

const industryLabels: Record<string, string> = {
  "tourism-activities": "Tourism & Activities",
  "tourism-hospitality": "Tourism & Hospitality",
  "photography-creative": "Photography & Creative",
  "food-beverage": "Food & Beverage",
  consulting: "Consulting",
  other: "Other",
};

const ProjectCard = ({ project, language, position }: Props) => {
  const { title, slug, tagline, image, projectType, clientIndustry, techStack } =
    project;
  const href = language
    ? `/${language}/${localizedPath("projects", language)}/${slug.current}`
    : `/projects/${slug.current}`;

  return (
    <Link
      href={href}
      className="group block"
      onClick={() => trackPortfolioCardClick(slug.current, position ?? 0)}
    >
      <article className="overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/20">
        {/* Image */}
        {image?.asset && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={urlFor(image).width(800).height(500).url()}
              alt={image.alt ?? title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
            {/* Metric badge */}
            {project.businessMetrics?.[0] && (
              <span className="absolute right-3 top-3 rounded-full bg-[var(--color-brand)] px-3 py-1 text-xs font-semibold text-white dark:text-[var(--color-surface)]">
                {project.businessMetrics[0].value}
              </span>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {projectType && (
              <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[var(--color-brand)]">
                {projectTypeLabels[projectType] || projectType}
              </span>
            )}
            {clientIndustry && (
              <span className="rounded-full bg-[var(--color-accent-light)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-accent-dark)]">
                {industryLabels[clientIndustry] || clientIndustry}
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
            {title}
          </h3>

          {tagline && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {tagline}
            </p>
          )}

          {/* Tech stack pills */}
          {techStack?.logos && techStack.logos.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {techStack.logos.map((logo) => (
                <span
                  key={logo._id}
                  className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {logo.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default ProjectCard;
