import { PresentationIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export const caseStudySpotlight = defineType({
  name: "caseStudySpotlight",
  title: "Case Study Spotlight",
  icon: PresentationIcon,
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "heading",
      title: "Section Heading (optional)",
      type: "string",
      description:
        'e.g. "Real results: Farol Discover" or leave blank to omit.',
    }),
    defineField({
      name: "project",
      title: "Project",
      type: "reference",
      to: [{ type: "project" }],
      description:
        "Select the project to spotlight. Pulls metrics and summary automatically.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "highlightMetrics",
      title: "Show business metrics",
      type: "boolean",
      description:
        "Displays the businessMetrics[] array from the project document as visual stats.",
      initialValue: true,
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Label",
      type: "string",
      description:
        'Label for the "read more" link. e.g. "Read the full case study"',
      initialValue: "Read the full case study",
    }),
  ],
  preview: {
    select: {
      title: "project.title",
      subtitle: "heading",
      visible: "visible",
    },
    prepare({ title, subtitle, visible }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}Case Study Spotlight: ${title ?? "unselected"}`,
        subtitle,
        media: PresentationIcon,
      };
    },
  },
});
