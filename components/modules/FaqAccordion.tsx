"use client";

import { useState, useId } from "react";
import { FaqAccordionBlock, PortableTextBlock } from "@/types/Sanity";
import { PortableText } from "@portabletext/react";

type Props = {
  block: FaqAccordionBlock;
};

const FaqAccordion = ({ block }: Props) => {
  const { eyebrow, heading, items, generateJsonLd } = block;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const idPrefix = useId();

  if (!items?.length) return null;

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Generate FAQ JSON-LD structured data
  const jsonLd =
    generateJsonLd && items.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: portableTextToPlain(item.answer),
            },
          })),
        }
      : null;

  return (
    <section className="relative z-[1] w-full py-24">
      <div className="mx-auto max-w-[780px] px-5 md:px-8">
        {/* Section header */}
        {(eyebrow || heading) && (
          <div className="mb-14">
            {eyebrow && (
              <div className="section-eyebrow mb-3">{eyebrow}</div>
            )}
            {heading && (
              <h2 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-[var(--color-text)]">
                {heading}
              </h2>
            )}
          </div>
        )}

        {/* Accordion list */}
        <ul className="list-none">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            const answerId = `${idPrefix}-faq-answer-${i}`;

            return (
              <li key={i} className="border-b border-[var(--color-border)]">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-6 py-6 text-left font-heading text-lg font-semibold leading-snug text-[var(--color-text)] transition-colors hover:text-[var(--color-brand)]"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => toggle(i)}
                >
                  <span>{item.question}</span>
                  <span
                    className="flex-shrink-0 font-heading text-xl font-light leading-none text-[var(--color-brand)] select-none"
                    aria-hidden="true"
                  >
                    {isOpen ? "\u2212" : "+"}
                  </span>
                </button>
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={`${idPrefix}-faq-q-${i}`}
                  hidden={!isOpen}
                  className="pb-6"
                >
                  <div className="text-base leading-relaxed text-[var(--color-text-muted)] [&_p+p]:mt-4">
                    <PortableText value={item.answer} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* JSON-LD structured data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </section>
  );
};

/**
 * Extracts plain text from Portable Text blocks for JSON-LD.
 */
function portableTextToPlain(blocks: PortableTextBlock[]): string {
  if (!blocks) return "";
  return blocks
    .filter((block) => block._type === "block")
    .map((block) =>
      (block.children || [])
        .map((child: { text?: string }) => child.text || "")
        .join("")
    )
    .join(" ");
}

export default FaqAccordion;
