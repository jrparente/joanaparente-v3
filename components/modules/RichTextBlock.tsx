import { RichTextBlockType } from "@/types/Sanity";
import { RichText } from "../portabletext/RichText";

type Props = {
  block: RichTextBlockType;
};

const RichTextBlock = ({ block }: Props) => {
  const { content } = block;

  if (!content) return null;

  return (
    <section className="w-full bg-background py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 prose prose-neutral dark:prose-invert">
        <RichText value={content} />
      </div>
    </section>
  );
};

export default RichTextBlock;
