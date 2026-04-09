import Link from "next/link";
import type { RelatedProjectsBlockType } from "@/types/Sanity";
import { localizedPath } from "@/lib/utils";

export default function RelatedProjectsBlock({
  block,
  language,
}: {
  block: RelatedProjectsBlockType;
  language?: string;
}) {
  if (!block.projects || block.projects.length === 0) return null;

  const lang = language || "en";

  return (
    <section
      className="relative z-[1] border-t border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-16 md:py-24"
      aria-labelledby={block.heading ? "related-heading" : undefined}
    >
      <div className="mx-auto max-w-[680px] px-8">
        {(block.eyebrow || block.heading) && (
          <div className="mb-8">
            {block.eyebrow && <p className="section-eyebrow">{block.eyebrow}</p>}
            {block.heading && (
              <h2 className="section-heading" id="related-heading">{block.heading}</h2>
            )}
          </div>
        )}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {block.projects.map((rp) => (
            <Link
              key={rp._id}
              href={`/${lang}/${localizedPath("projects", lang)}/${rp.slug}`}
              className="group flex flex-col gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition-all duration-200 hover:border-[var(--color-brand)] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[var(--color-brand)] focus-visible:outline-offset-2"
            >
              <h3 className="section-heading text-[length:var(--text-xl)]">
                {rp.title}
              </h3>
              <span className="font-sans text-[length:var(--text-sm)] leading-snug text-[var(--color-text-muted)]">
                {rp.subtitle}
              </span>
              <span className="mt-auto pt-2 font-sans text-[length:var(--text-sm)] font-semibold text-[var(--color-brand)] group-hover:underline">
                {block.ctaLabel || "View case study"} &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
