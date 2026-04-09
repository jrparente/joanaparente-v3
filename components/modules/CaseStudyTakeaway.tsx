import type { CaseStudyTakeawayBlock } from "@/types/Sanity";
import { PortableText } from "@portabletext/react";

export default function CaseStudyTakeaway({ block }: { block: CaseStudyTakeawayBlock }) {
  if (!block.content || block.content.length === 0) return null;

  return (
    <section className="relative z-[1] py-16 md:py-24" aria-labelledby={block.heading ? "takeaway-heading" : undefined}>
      <div className="mx-auto max-w-[680px] px-8">
        {(block.eyebrow || block.heading) && (
          <div className="mb-10">
            {block.eyebrow && <p className="section-eyebrow">{block.eyebrow}</p>}
            {block.heading && (
              <h2 className="section-heading" id="takeaway-heading">{block.heading}</h2>
            )}
          </div>
        )}
        <div className="my-12 border-l-4 border-[var(--color-brand)] py-6 pl-7 max-sm:border-l-2 max-sm:pl-5">
          <PortableText
            value={[block.content[0]]}
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
          {block.content.length > 1 && (
            <div className="mt-6">
              <PortableText
                value={block.content.slice(1)}
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
  );
}
