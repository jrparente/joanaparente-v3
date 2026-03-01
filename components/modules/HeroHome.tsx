import Link from "next/link";
import { resolveLink } from "@/lib/utils";
import { HeroHomeBlock } from "@/types/Sanity";
import { ReactNode } from "react";

type Props = {
  block: HeroHomeBlock;
  language?: string;
};

function renderAccentHeading(text: string): ReactNode[] {
  const parts = text.split(/(\[\[.*?\]\])/g);
  return parts.map((part, i) => {
    if (part.startsWith("[[") && part.endsWith("]]")) {
      return (
        <em key={i} className="italic text-[var(--color-brand)]">
          {part.slice(2, -2)}
        </em>
      );
    }
    return part;
  });
}

const HeroHome = ({ block, language }: Props) => {
  const {
    heading,
    subheading,
    ctaPrimary,
    ctaSecondary,
    eyebrow,
    proofStrip,
  } = block;
  const primaryHref = ctaPrimary ? resolveLink(ctaPrimary, language) : "#";
  const secondaryHref = ctaSecondary
    ? resolveLink(ctaSecondary, language)
    : null;

  return (
    <section className="relative z-[1] w-full bg-[var(--color-surface)] py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="max-w-[780px]">
          {/* Eyebrow */}
          {eyebrow && (
            <div
              className="section-eyebrow mb-6 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              {eyebrow}
            </div>
          )}

          {/* Heading */}
          {heading && (
            <h1
              className="font-heading text-5xl font-semibold tracking-tight animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              {renderAccentHeading(heading)}
            </h1>
          )}

          {/* Subheading */}
          {subheading && (
            <p
              className="mt-6 max-w-[580px] text-xl text-[var(--color-text-muted)] animate-fade-up"
              style={{ animationDelay: "0.35s" }}
            >
              {subheading}
            </p>
          )}

          {/* CTAs */}
          <div
            className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            {ctaPrimary && (
              <Link
                href={primaryHref}
                className="inline-flex items-center gap-2 rounded-md bg-[var(--color-brand)] px-8 py-3 font-semibold text-white transition-colors hover:bg-[var(--color-brand-dark)]"
              >
                {ctaPrimary.label || "Learn More"}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}

            {ctaSecondary && secondaryHref && (
              <Link
                href={secondaryHref}
                className="inline-flex items-center gap-1 font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-brand)]"
              >
                {ctaSecondary.label || "Learn More"}
                <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
          </div>

          {/* Proof Strip */}
          {proofStrip && proofStrip.length > 0 && (
            <div
              className="mt-12 flex flex-wrap gap-8 border-t border-[var(--color-border)] pt-8 animate-fade-up"
              style={{ animationDelay: "0.65s" }}
            >
              {proofStrip.map((item, i) => (
                <div key={i} className="flex flex-col">
                  <span
                    className="font-heading text-2xl font-semibold text-[var(--color-text)]"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {item.value}
                  </span>
                  <span className="mt-1 font-sans text-xs text-[var(--color-text-muted)]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Decorative vertical line */}
      <div
        className="pointer-events-none absolute inset-y-0 right-[8%] hidden w-px md:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--color-border) 30%, var(--color-border) 70%, transparent)",
        }}
        aria-hidden="true"
      />
    </section>
  );
};

export default HeroHome;
