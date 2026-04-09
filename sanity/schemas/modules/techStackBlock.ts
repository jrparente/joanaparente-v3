import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export const techStackBlock = defineType({
  name: "techStackBlock",
  title: "Tech Stack",
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: 'e.g. "Built with" / "Construído com"',
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'e.g. "Tech stack" / "Stack tecnológico"',
    }),
    defineField({
      name: "techStack",
      title: "Tech Stack",
      type: "logoList",
      description: "Select or create a logo list with the technologies used.",
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      visible: "visible",
    },
    prepare({ heading, visible }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}Tech Stack${heading ? `: ${heading}` : ""}`,
      };
    },
  },
});
