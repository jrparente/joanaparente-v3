import { RichTextBlockType } from "@/types/Sanity";
import { RichText } from "../portabletext/RichText";

type Props = {
  block: RichTextBlockType;
};

const RichTextBlock = ({ block }: Props) => {
  const { eyebrow, heading, variant, content } = block;

  if (!content) return null;

  const isElevated = variant === "elevated";

  return (
    <section
      className={`w-full py-16 md:py-24 ${
        isElevated
          ? "bg-[var(--color-surface-elevated)] border-t border-b border-[var(--color-border)]"
          : "bg-background"
      }`}
    >
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        {(eyebrow || heading) && (
          <div className="mb-10">
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
        <div className="prose prose-neutral dark:prose-invert prose-lg">
          <RichText value={content} />
        </div>
      </div>
    </section>
  );
};

export default RichTextBlock;
