"use client";

import Link from "next/link";
import { Button } from "../ui/button";
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
    <section className="w-full bg-primary py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 text-center">
        {title && (
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            {title}
          </h2>
        )}

        {description && (
          <p className="mt-4 text-lg text-primary-foreground/80">
            {description}
          </p>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {buttonLink && (
            <Button asChild variant="secondary" size="lg">
              <Link
                href={href}
                onClick={() =>
                  trackContactCtaClick("cta_block", language || "en")
                }
              >
                {buttonLink.label || "Learn More"}
              </Link>
            </Button>
          )}

          {buttonLink2 && href2 && (
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link href={href2}>{buttonLink2.label || "Learn More"}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cta;
