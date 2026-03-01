import { HelpCircleIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export const faqAccordion = defineType({
  name: "faqAccordion",
  title: "FAQ Accordion",
  icon: HelpCircleIcon,
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      description: 'e.g. "Frequently asked questions"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [
        {
          type: "object",
          name: "faqItem",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "array",
              of: [{ type: "block" }],
              description:
                "Rich text. Keep answers concise — 2–4 sentences. Long answers reduce featured snippet eligibility.",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "question" },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "generateJsonLd",
      title: "Generate FAQ structured data (JSON-LD)",
      type: "boolean",
      description:
        "Recommended: on. Renders FAQ schema for Google rich results. Only disable if this page already has a conflicting FAQ schema.",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "heading", visible: "visible" },
    prepare({ title, visible }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}FAQ: ${title}`,
        media: HelpCircleIcon,
      };
    },
  },
});
