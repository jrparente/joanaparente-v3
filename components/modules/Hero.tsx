"use client";

import { urlFor } from "@/lib/sanity/image";
import { HeroBlock } from "@/types/Sanity";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn, resolveLink } from "@/lib/utils";
import { RichText } from "../portabletext/RichText";
import { trackContactCtaClick } from "@/lib/analytics";

type Props = {
  block: HeroBlock;
  language?: string;
};

const Hero = ({ block, language }: Props) => {
  const { subheading, title, subtitle, image, buttonLink, description } = block;
  const hasImage = Boolean(image?.asset);
  const href = buttonLink ? resolveLink(buttonLink, language) : "#";

  return (
    <section className="w-full bg-background py-16 md:py-24 min-h-screen">
      <div
        className={cn(
          "max-w-5xl mx-auto px-4 w-full",
          hasImage
            ? "flex flex-col-reverse items-center gap-12 md:flex-row md:justify-between"
            : "flex flex-col items-center text-center",
        )}
      >
        {/* Text content */}
        <div className="text-center md:text-left md:max-w-xl">
          {subheading && (
            <p className="text-[var(--color-brand)] mb-2 text-sm font-sans font-semibold uppercase tracking-widest">
              {subheading}
            </p>
          )}

          {title && (
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="mt-4 text-xl text-muted-foreground md:text-2xl">
              {subtitle}
            </p>
          )}

          {description && (
            <div className="mt-6 text-base leading-relaxed">
              <RichText value={description.content} />
            </div>
          )}

          {buttonLink && (
            <div className="mt-8">
              <Button asChild>
                <Link
                  href={href}
                  onClick={() =>
                    trackContactCtaClick("hero", language || "en")
                  }
                >
                  {buttonLink.label || "Learn More"}
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Image */}
        {image?.asset && (
          <div className="relative size-96 overflow-hidden">
            <Image
              src={urlFor(image).width(2000).height(2000).url()}
              alt={image.alt ?? "Joana Parente"}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
