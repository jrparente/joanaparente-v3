import type { CaseStudyTransformationBlock } from "@/types/Sanity";

export default function CaseStudyTransformation({ block }: { block: CaseStudyTransformationBlock }) {
  if (!block.text) return null;

  return (
    <section
      className="relative z-[1] border-t border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-16 text-center md:py-20"
      aria-label="Transformation statement"
    >
      <div className="mx-auto max-w-[680px] px-8">
        <p className="section-heading text-[length:var(--text-3xl)] leading-[1.25]">
          {block.text}
        </p>
      </div>
    </section>
  );
}
