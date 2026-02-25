import Link from "next/link";
import { ProjectListBlock } from "@/types/Sanity";
import { getProjects } from "@/lib/sanity/queries";
import { localizedPath } from "@/lib/utils";
import ProjectGrid from "./ProjectGrid";

type Props = {
  block: ProjectListBlock;
  language?: string;
};

const ProjectList = async ({ block, language }: Props) => {
  const {
    title,
    description,
    headingLevel,
    maxProjects,
    showViewAll,
    viewAllLabel,
    emptyStateText,
  } = block;

  const lang = language ?? "pt";
  const allProjects = await getProjects({ language: lang });
  const projects = maxProjects
    ? allProjects.slice(0, maxProjects)
    : allProjects;

  const Heading = headingLevel === "h1" ? "h1" : "h2";
  const headingClass =
    headingLevel === "h1"
      ? "text-4xl font-bold tracking-tight sm:text-5xl"
      : "text-3xl font-bold tracking-tight sm:text-4xl";

  const projectsHref = `/${lang}/${localizedPath("projects", lang)}`;

  if (!projects || projects.length === 0) {
    return (
      <section className="w-full bg-background py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          {title && (
            <Heading className={`${headingClass} mb-8`}>{title}</Heading>
          )}
          {description && (
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mb-8">
              {description}
            </p>
          )}
          {emptyStateText && (
            <div className="flex h-64 items-center justify-center rounded-md border border-dashed bg-muted">
              <p className="text-muted-foreground">{emptyStateText}</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-background py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        {title && (
          <Heading className={`${headingClass} mb-4`}>{title}</Heading>
        )}
        {description && (
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            {description}
          </p>
        )}

        <ProjectGrid projects={projects} language={language} />

        {(showViewAll ?? true) && viewAllLabel && (
          <div className="mt-8 text-center">
            <Link
              href={projectsHref}
              className="text-sm font-sans font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {viewAllLabel} →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectList;
