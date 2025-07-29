import { urlFor } from "@/lib/sanity/image";
import { HeroBlock } from "@/types/Sanity";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { resolveLink } from "@/lib/utils";
import { RichText } from "../portabletext/RichText";

type Props = {
  block: HeroBlock;
  language?: string;
};

const Hero = ({ block, language }: Props) => {
  const { subheading, title, subtitle, image, buttonLink, description } = block;

  const href = buttonLink ? resolveLink(buttonLink, language) : "#";

  return (
    <section className="w-full bg-background py-16 md:py-24 min-h-screen">
      <div className="max-w-5xl mx-auto flex flex-col-reverse items-center gap-12 px-4 md:flex-row md:justify-between">
        {/* Text content */}
        <div className="text-center md:text-left md:max-w-xl">
          {subheading && (
            <p className="text-muted-foreground mb-2 text-sm font-mono uppercase tracking-wide">
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
                <Link href={href}>{buttonLink.label || "Learn More"}</Link>
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
