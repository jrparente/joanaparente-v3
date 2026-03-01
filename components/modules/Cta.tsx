"use client";

import Link from "next/link";
import { resolveLink } from "@/lib/utils";
import { CtaBlock } from "@/types/Sanity";
import { trackContactCtaClick } from "@/lib/analytics";

type Props = {
  block: CtaBlock;
  language?: string;
};

const Cta = ({ block, language }: Props) => {
  const { title, description, buttonLink, buttonLink2 } = block;
  const href = buttonLink ? resolveLink(buttonLink, language) : "#";
  const href2 = buttonLink2 ? resolveLink(buttonLink2, language) : null;

  return (
    <section className="relative z-[1] w-full bg-[var(--color-brand)] dark:bg-[var(--color-brand-light)] py-20">
      <div className="mx-auto max-w-[1200px] px-8 text-center">
        {title && (
          <h2 className="font-heading text-balance text-3xl font-semibold text-white dark:text-[var(--color-text)]">
            {title}
          </h2>
        )}

        {description && (
          <p className="mt-4 text-lg text-white/85 dark:text-[var(--color-text-muted)] text-balance">
            {description}
          </p>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {buttonLink && (
            <Link
              href={href}
              onClick={() =>
                trackContactCtaClick("cta_block", language || "en")
              }
              className="inline-flex items-center gap-2 rounded-md bg-white dark:bg-[var(--color-brand)] px-8 py-3 font-semibold text-[var(--color-brand)] dark:text-[var(--color-surface)] transition-colors hover:bg-[var(--color-surface)] dark:hover:bg-[var(--color-brand-dark)]"
            >
              {buttonLink.label || "Learn More"}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
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

          {buttonLink2 && href2 && (
            <Link
              href={href2}
              className="inline-flex items-center gap-1 font-medium text-white/80 dark:text-[var(--color-text-muted)] transition-colors hover:text-white dark:hover:text-[var(--color-text)]"
            >
              {buttonLink2.label || "Learn More"}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cta;
