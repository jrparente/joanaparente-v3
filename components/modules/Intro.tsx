import { IntroBlock } from "@/types/Sanity";
import { RichText } from "../portabletext/RichText";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { stegaClean } from "next-sanity";

type Props = {
  block: IntroBlock;
  language?: string;
};

const Intro = ({ block, language }: Props) => {
  const { heading, subheading, content, image, anchor } = block;
  const hasImage = image?.asset;

  return (
    <section
      className="w-full bg-background py-16 md:py-24 min-h-screen"
      id={stegaClean(anchor)}
    >
      <div
        className={`max-w-5xl mx-auto flex px-4 gap-12 ${
          hasImage
            ? "flex-col-reverse md:flex-row md:justify-between items-center"
            : "flex-col items-start"
        }`}
      >
        {/* Text content */}
        <div
          className={
            hasImage ? "md:max-w-xl text-center md:text-left" : "w-full"
          }
        >
          {heading && (
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {heading}
            </h2>
          )}

          {subheading && (
            <p className="mt-4 text-xl text-muted-foreground md:text-2xl">
              {subheading}
            </p>
          )}

          {content?.content && (
            <div className="mt-6 text-base leading-relaxed prose prose-neutral dark:prose-invert">
              <RichText value={content.content} />
            </div>
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
