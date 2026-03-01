import { TestimonialsBlock } from "@/types/Sanity";
import Image from "next/image";

type Props = {
  block: TestimonialsBlock;
  language?: string;
};

const Testimonials = ({ block, language }: Props) => {
  const { eyebrow, heading, items } = block;

  return (
    <section className="relative z-[1] w-full py-20">
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

        {/* Empty state */}
        {(!items || items.length === 0) && (
          <p className="py-8 text-center text-lg text-[var(--color-text-subtle)]">
            {language === "pt"
              ? "Histórias de clientes em breve."
              : "Client stories arriving soon."}
          </p>
        )}

        {/* Testimonial cards */}
        {items && items.length > 0 && (
          <div className="grid grid-cols-1 gap-8">
            {items.map((item, i) => (
              <figure
                key={i}
                className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-8"
              >
                <blockquote className="mb-6">
                  <p className="text-base leading-relaxed text-[var(--color-text)] italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  {item.authorImage?.asset?.url && (
                    <Image
                      src={item.authorImage.asset.url}
                      alt={item.authorImage.alt || item.authorName}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      {item.authorName}
                    </p>
                    {(item.authorRole || item.authorCompany) && (
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {[item.authorRole, item.authorCompany]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
