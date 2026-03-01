import Link from "next/link";
import { resolveLink } from "@/lib/utils";
import { ServiceTierPreviewBlock } from "@/types/Sanity";

type Props = {
  block: ServiceTierPreviewBlock;
  language?: string;
};

const ServiceTierPreview = ({ block, language }: Props) => {
  const { eyebrow, heading, tiers, ctaLink } = block;

  if (!tiers?.length) return null;

  const href = ctaLink ? resolveLink(ctaLink, language) : "#";

  return (
    <section className="relative z-[1] w-full bg-[var(--color-surface)] py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-8">
        {eyebrow && (
          <div className="section-eyebrow mb-4">{eyebrow}</div>
        )}

        {heading && (
          <h2 className="mb-12 text-[var(--color-text)]">{heading}</h2>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`relative flex flex-col gap-4 rounded-[var(--radius-xl)] bg-[var(--color-surface-elevated)] p-8 ${
                tier.highlighted
                  ? "border-2 border-[var(--color-brand)]"
                  : "border border-[var(--color-border)]"
              }`}
            >
              {/* "Most popular" badge */}
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-brand)] px-4 py-1 text-xs font-semibold text-white dark:text-[var(--color-surface)]">
                  {language === "pt" ? "Mais popular" : "Most popular"}
                </span>
              )}

              <div>
                <h3 className="font-heading text-xl font-semibold text-[var(--color-text)]">
                  {tier.name}
                </h3>
                {tier.tagline && (
                  <p className="mt-1 text-sm leading-snug text-[var(--color-text-muted)]">
                    {tier.tagline}
                  </p>
                )}
              </div>

              <p
                className="font-heading text-2xl font-semibold text-[var(--color-brand)]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {tier.startingPrice}
              </p>

              {tier.highlights && tier.highlights.length > 0 && (
                <>
                  <hr className="border-[var(--color-border)]" />
                  <ul className="flex flex-col gap-2.5">
                    {tier.highlights.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--color-text)]"
                      >
                        <span
                          className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${
                            tier.highlighted
                              ? "bg-[var(--color-brand)]"
                              : "border-2 border-[var(--color-brand)] bg-[var(--color-brand-light)]"
                          }`}
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>

        {ctaLink && (
          <div className="mt-12 text-center">
            <Link
              href={href}
              className="inline-flex items-center gap-1 font-medium text-[var(--color-brand)] transition-colors hover:text-[var(--color-brand-dark)]"
            >
              {ctaLink.label || "Learn More"}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceTierPreview;
