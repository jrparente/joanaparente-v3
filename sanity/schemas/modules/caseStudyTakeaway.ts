import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export const caseStudyTakeaway = defineType({
  name: "caseStudyTakeaway",
  title: "Takeaway",
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: 'e.g. "The takeaway" / "A conclusão"',
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'e.g. "What I learned" / "O que aprendi"',
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      description:
        "First paragraph renders as the lead sentence (Fraunces italic, brand color). Remaining paragraphs render as body text.",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      visible: "visible",
    },
    prepare({ heading, visible }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}Takeaway${heading ? `: ${heading}` : ""}`,
      };
    },
  },
});
