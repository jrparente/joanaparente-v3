import Link from "next/link";
import type { CaseStudySpotlightBlock } from "@/types/Sanity";

type Props = {
  block: CaseStudySpotlightBlock;
  language?: string;
};

const CaseStudySpotlight = ({ block, language = "en" }: Props) => {
  const { heading, project, highlightMetrics, ctaLabel } = block;

  if (!project) return null;

  const projectUrl = `/${language}/projects/${project.slug}`;

  return (
    <section
      className="relative z-[1]"
      style={{ background: "oklch(0.97 0.01 65)" }}
      aria-labelledby={heading ? "spotlight-heading" : undefined}
    >
      <div className="mx-auto max-w-[680px] px-8 py-12">
        <div className="rounded-[var(--radius-lg)] border-l-4 border-[var(--color-brand)] bg-[var(--color-surface-elevated)] p-8 shadow-sm">
          {heading && (
            <p className="mb-3 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-[var(--color-brand)]">
              <span className="inline-block h-0.5 w-6 rounded-full bg-[var(--color-brand)]" />
              {heading}
            </p>
          )}

          <h3
            id={heading ? "spotlight-heading" : undefined}
            className="font-heading text-xl font-semibold tracking-tight text-[var(--color-text)]"
            style={{ fontVariationSettings: "'WONK' 0" }}
          >
            {project.title}
          </h3>

          {project.transformationStatement && (
            <p className="mt-2 font-sans text-base text-[var(--color-text-muted)]">
              {project.transformationStatement}
            </p>
          )}

          {highlightMetrics &&
            project.businessMetrics &&
            project.businessMetrics.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {project.businessMetrics.map((metric, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-heading font-semibold text-[var(--color-text)]">
                      {metric.value}
                    </span>{" "}
                    <span className="text-[var(--color-text-muted)]">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

          <Link
            href={projectUrl}
            className="mt-4 inline-flex items-center gap-1 font-sans text-sm font-semibold text-[var(--color-brand)] hover:underline"
          >
            {ctaLabel || "Read the case study"}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CaseStudySpotlight;
