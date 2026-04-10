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
  readMoreLabel?: string;
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

const ProjectCard = ({ project, language, position, readMoreLabel }: Props) => {
  const { title, slug, subtitle, image, projectType, clientIndustry } = project;
  const href = language
    ? `/${language}/${localizedPath("projects", language)}/${slug.current}`
    : `/projects/${slug.current}`;

  const industryLabel = clientIndustry ? industryLabels[clientIndustry] : null;
  const typeLabel = projectType ? projectTypeLabels[projectType] : null;
  const typeDisplay = [industryLabel, typeLabel].filter(Boolean).join(" · ");

  return (
    <Link
      href={href}
      className="group block"
      onClick={() => trackPortfolioCardClick(slug.current, position ?? 0)}
    >
      <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-primary/20">
        {/* Image */}
        {image?.asset && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={urlFor(image).width(800).height(500).url()}
              alt={image.alt ?? title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 768px) 50vw, 100vw"
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
        <div className="flex flex-col flex-1 p-6">
          {typeDisplay && (
            <p className="mb-1 text-xs text-[var(--color-text-subtle)]">
              {typeDisplay}
            </p>
          )}

          <h3 className="font-serif text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
            {title}
          </h3>

          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">
              {subtitle}
            </p>
          )}

          {readMoreLabel && (
            <p className="mt-4 text-sm font-semibold text-[var(--color-brand)] group-hover:text-[var(--color-brand-dark)] transition-colors">
              {readMoreLabel}{" "}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-[3px]">
                →
              </span>
            </p>
          )}
        </div>
      </article>
    </Link>
  );
};

export default ProjectCard;
