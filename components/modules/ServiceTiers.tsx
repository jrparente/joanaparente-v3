import Link from "next/link";
import { resolveLink } from "@/lib/utils";
import { ServiceTiersBlock } from "@/types/Sanity";

type Props = {
  block: ServiceTiersBlock;
  language?: string;
};

/**
 * Parses a simple markdown link syntax: `[label](url)` within plain text.
 * Returns an array of React nodes.
 */
function renderFootnote(text: string) {
  const parts = text.split(/(\[.*?\]\(.*?\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (match) {
      return (
        <a
          key={i}
          href={match[2]}
          className="font-medium text-[var(--color-brand)] transition-colors hover:text-[var(--color-brand-dark)]"
        >
          {match[1]}
        </a>
      );
    }
    return part;
  });
}

const ServiceTiers = ({ block, language }: Props) => {
  const { eyebrow, heading, tiers, footnote } = block;

  if (!tiers?.length) return null;

  return (
    <section className="relative z-[1] w-full py-12 md:py-24">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
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

        {/* Tier grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          {tiers.map((tier, i) => {
            const href = tier.ctaLink
              ? resolveLink(tier.ctaLink, language)
              : "#";

            return (
              <div
                key={i}
                className={`relative flex flex-col rounded-[var(--radius-xl)] bg-[var(--color-surface-elevated)] p-8 transition-shadow duration-200 hover:shadow-md ${
                  tier.highlighted
                    ? "border-2 border-[var(--color-brand)] shadow-lg md:scale-[1.02]"
                    : "border border-[var(--color-border)]"
                }`}
              >
                {/* Badge */}
                {tier.highlighted && tier.badgeLabel && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--color-brand)] px-4 py-1 text-xs font-semibold tracking-wide text-white dark:text-[var(--color-surface)]">
                    {tier.badgeLabel}
                  </span>
                )}

                {/* Name + subtitle */}
                <div>
                  <h3 className="font-heading text-xl font-semibold text-[var(--color-text)]">
                    {tier.name}
                  </h3>
                  {tier.subtitle && (
                    <p className="mt-1 text-sm leading-snug text-[var(--color-text-muted)]">
                      {tier.subtitle}
                    </p>
                  )}
                </div>

                {/* Price */}
                <p
                  className="mt-5 font-heading text-2xl font-semibold text-[var(--color-brand)]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {tier.priceRange}
                </p>

                {/* Timeline */}
                {tier.timeline && (
                  <p className="mt-2 text-sm text-[var(--color-text-subtle)]">
                    {tier.timeline}
                  </p>
                )}

                {/* Features */}
                {tier.features && tier.features.length > 0 && (
                  <>
                    <hr className="my-5 border-[var(--color-border)]" />
                    <ul className="flex flex-1 flex-col gap-2.5 mb-6">
                      {tier.features.map((feature, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--color-text-muted)]"
                        >
                          <span
                            className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${
                              tier.highlighted
                                ? "bg-[var(--color-brand)]"
                                : "border-2 border-[var(--color-brand)] bg-[var(--color-brand-light)]"
                            }`}
                            aria-hidden="true"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Proof link */}
                {tier.proofLink?.label && tier.proofLink?.href && (
                  <p className="mb-5 text-xs text-[var(--color-text-subtle)]">
                    {tier.proofLabel || "See it in action:"}{" "}
                    <a
                      href={tier.proofLink.href}
                      className="font-medium text-[var(--color-brand)] transition-colors hover:text-[var(--color-brand-dark)]"
                    >
                      {tier.proofLink.label}
                    </a>
                  </p>
                )}

                {/* CTA button */}
                <Link
                  href={href}
                  className={`mt-auto block w-full rounded-[var(--radius-md)] py-3.5 text-center text-base font-semibold transition-all hover:-translate-y-px ${
                    tier.highlighted
                      ? "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-dark)] dark:text-[var(--color-surface)]"
                      : "border-2 border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand-light)]"
                  }`}
                >
                  {tier.ctaLabel}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Footnote */}
        {footnote && (
          <p className="mx-auto max-w-[600px] text-center text-base leading-relaxed text-[var(--color-text-muted)]">
            {renderFootnote(footnote)}
          </p>
        )}
      </div>
    </section>
  );
};

export default ServiceTiers;
