"use client";

import { urlFor } from "@/lib/sanity/image";
import { HeroBlock } from "@/types/Sanity";
import Image from "next/image";
import Link from "next/link";
import { resolveLink } from "@/lib/utils";
import { RichText } from "../portabletext/RichText";
import { trackContactCtaClick } from "@/lib/analytics";
import { ReactNode } from "react";

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

type Props = {
  block: HeroBlock;
  language?: string;
};

const Hero = ({ block, language }: Props) => {
  const { subheading, title, subtitle, image, buttonLink, description } = block;
  const hasImage = Boolean(image?.asset);
  const href = buttonLink ? resolveLink(buttonLink, language) : "#";

  return (
    <section className="relative z-[1] w-full pt-16 pb-20 md:px-8">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        {/* Layout grid */}
        <div
          className={
            hasImage
              ? "grid grid-cols-1 items-center gap-8 text-center md:grid-cols-[1.4fr_1fr] md:gap-12 md:text-left"
              : "mx-auto max-w-[780px] text-center"
          }
        >
          {/* Text content */}
          <div>
            {subheading && (
              <p className="mb-2 text-sm font-sans font-semibold uppercase tracking-widest text-[var(--color-brand)]">
                {subheading}
              </p>
            )}

            {title && (
              <h1
                className={
                  hasImage
                    ? "mb-6 leading-[1.15]"
                    : "mb-7 text-5xl leading-[1.15]"
                }
              >
                {renderAccentHeading(title)}
              </h1>
            )}

            {subtitle && (
              <p
                className={
                  hasImage
                    ? "text-lg leading-[1.65] text-[var(--color-text-muted)] mb-8"
                    : "text-lg leading-[1.65] text-[var(--color-text-muted)] mx-auto max-w-[600px] mb-10"
                }
              >
                {subtitle}
              </p>
            )}

            {description && (
              <div className="text-base leading-relaxed">
                <RichText value={description.content} />
              </div>
            )}

            {buttonLink && (
              <div className={hasImage ? "mt-8" : "mt-10 flex justify-center"}>
                <Link
                  href={href}
                  onClick={() => trackContactCtaClick("hero", language || "en")}
                  className="group inline-flex items-center gap-2 rounded-md bg-[var(--color-brand)] px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-[var(--color-brand-dark)] hover:-translate-y-px dark:text-[var(--color-surface)]"
                >
                  {buttonLink.label || "Learn More"}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 0 1 .75-.75h10.638l-3.96-3.96a.75.75 0 1 1 1.06-1.06l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06l3.96-3.96H3.75A.75.75 0 0 1 3 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Photo — Variant A only */}
          {image?.asset && (
            <div className="relative aspect-square w-full max-w-[380px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-sunken)] justify-self-center order-first md:order-last">
              <Image
                src={urlFor(image).width(2000).height(2000).url()}
                alt={image.alt ?? "Joana Parente"}
                fill
                className="rounded-lg object-cover object-center"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
