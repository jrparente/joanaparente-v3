import Link from "next/link";
import { TrackCaseStudyClick } from "@/components/analytics/TrackCaseStudyClick";
import { localizedPath } from "@/lib/utils";
import type { CaseStudySpotlightBlock, CaseStudySpotlightItem } from "@/types/Sanity";

type Props = {
  block: CaseStudySpotlightBlock;
  language?: string;
};

function SpotlightCard({
  item,
  heading,
  highlightMetrics,
  language,
}: {
  item: CaseStudySpotlightItem;
  heading?: string;
  highlightMetrics?: boolean;
  language: string;
}) {
  const { project } = item;
  const transformationStatement =
    item.transformationStatementOverride ?? project.transformationStatement;
  const businessMetrics = item.businessMetricsOverride?.length
    ? item.businessMetricsOverride
    : project.businessMetrics;
  const ctaLabel = item.ctaLabel || "Read the full case study";
  const projectUrl = `/${language}/${localizedPath("projects", language)}/${project.slug}`;

  return (
    <div className="rounded-[var(--radius-lg)] border-l-4 border-[var(--color-brand)] bg-[var(--color-surface)] p-8 shadow-md">
      {highlightMetrics && businessMetrics?.[0] && (
        <div className="mb-5">
          <p
            className="font-heading text-2xl font-semibold text-[var(--color-accent)]"
            style={{ fontVariationSettings: "'WONK' 0" }}
          >
            {businessMetrics[0].value}
          </p>
          <p className="mt-0.5 font-sans text-sm text-[var(--color-text-subtle)]">
            {businessMetrics[0].label}
          </p>
        </div>
      )}

      {heading && (
        <p className="mb-3 flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-[var(--color-brand)]">
          <span className="inline-block h-0.5 w-6 rounded-full bg-[var(--color-brand)]" />
          {heading}
        </p>
      )}

      <h3
        className="font-heading text-xl font-semibold tracking-tight text-[var(--color-text)]"
        style={{ fontVariationSettings: "'WONK' 0" }}
      >
        {project.title}
      </h3>

      {transformationStatement && (
        <p className="mt-2 font-sans text-base text-[var(--color-text-muted)]">
          {transformationStatement}
        </p>
      )}

      <TrackCaseStudyClick projectSlug={project.slug}>
        <Link
          href={projectUrl}
          className="mt-5 inline-flex items-center gap-1 font-sans text-sm font-semibold text-[var(--color-brand)] hover:underline"
        >
          {ctaLabel}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </TrackCaseStudyClick>
    </div>
  );
}

const CaseStudySpotlight = ({ block, language = "en" }: Props) => {
  const { heading, highlightMetrics, projects } = block;

  if (!projects?.length) return null;

  const isSingle = projects.length === 1;

  return (
    <section
      className="relative z-[1] w-full bg-[var(--color-surface-elevated)] border-t border-[var(--color-border)]"
    >
      <div className="mx-auto max-w-[720px] px-8 py-12">
        <div className={`grid grid-cols-1 gap-4 ${isSingle ? "" : "md:grid-cols-2"}`}>
          {projects.map((item) => (
            <SpotlightCard
              key={item._key}
              item={item}
              heading={heading}
              highlightMetrics={highlightMetrics}
              language={language}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudySpotlight;
