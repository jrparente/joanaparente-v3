import { IntroBlock } from "@/types/Sanity";
import { RichText } from "../portabletext/RichText";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { stegaClean } from "next-sanity";
import { cn } from "@/lib/utils";

type Props = {
  block: IntroBlock;
  language?: string;
};

const Intro = ({ block, language }: Props) => {
  const { heading, subheading, content, image, anchor, byline } = block;
  const hasImage = image?.asset;
  const isStoryMode = !hasImage && !heading;

  return (
    <section
      className={cn(
        "w-full bg-[var(--color-surface)]",
        isStoryMode ? "py-32 md:py-36" : "py-16 md:py-24 min-h-screen",
      )}
      id={stegaClean(anchor)}
    >
      <div
        className={cn(
          hasImage
            ? "max-w-5xl mx-auto flex px-4 gap-12 flex-col-reverse md:flex-row md:justify-between items-center"
            : isStoryMode
              ? "max-w-[680px] mx-auto px-4"
              : "max-w-5xl mx-auto flex px-4 gap-12 flex-col items-start",
        )}
      >
        {/* Text content */}
        <div
          className={
            hasImage ? "md:max-w-xl text-center md:text-left" : "w-full"
          }
        >
          {heading ? (
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {heading}
            </h2>
          ) : isStoryMode ? (
            <h2 className="sr-only">My story</h2>
          ) : null}

          {subheading && (
            <p className="mt-4 text-xl text-muted-foreground md:text-2xl">
              {subheading}
            </p>
          )}

          {content?.content && (
            <div
              className={cn(
                "text-base leading-relaxed prose prose-neutral dark:prose-invert",
                !isStoryMode && "mt-6",
                isStoryMode &&
                  "story-prose text-lg [&>p]:mt-7 [&>p]:leading-[1.75] [&>p:first-child]:mt-0",
              )}
            >
              <RichText value={content.content} />
            </div>
          )}

          {byline && (
            <p className="mt-12 text-center text-sm font-medium tracking-wide text-[var(--color-text-subtle)]">
              {byline}
            </p>
          )}
        </div>

        {/* Image */}
        {hasImage && (
          <div className="relative size-96 overflow-hidden">
            <Image
              src={urlFor(image).width(2000).height(2000).url()}
              alt={image.alt ?? heading ?? "Intro Image"}
              fill
              className="object-cover object-center rounded-lg"
              sizes="(min-width: 768px) 384px, 100vw"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Intro;
