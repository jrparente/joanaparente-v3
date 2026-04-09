import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export const caseStudyTransformation = defineType({
  name: "caseStudyTransformation",
  title: "Transformation Statement",
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "text",
      title: "Statement",
      type: "string",
      description:
        "A bold, centered statement summarizing the project transformation. Keep under 120 characters.",
      validation: (rule) => rule.required().max(200),
    }),
  ],
  preview: {
    select: {
      text: "text",
      visible: "visible",
    },
    prepare({ text, visible }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}Transformation${text ? `: ${text}` : ""}`,
      };
    },
  },
});
