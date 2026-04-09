import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export const relatedProjectsBlock = defineType({
  name: "relatedProjectsBlock",
  title: "Related Projects",
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: 'e.g. "More work" / "Mais trabalho"',
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'e.g. "Related projects" / "Projetos relacionados"',
    }),
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
      validation: (rule) => rule.max(3),
      description: "Select 2-3 related case studies.",
    }),
    defineField({
      name: "ctaLabel",
      title: "Card CTA Label",
      type: "string",
      description: 'e.g. "View case study" / "Ver caso de estudo"',
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      visible: "visible",
    },
    prepare({ heading, visible }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}Related${heading ? `: ${heading}` : ""}`,
      };
    },
  },
});
