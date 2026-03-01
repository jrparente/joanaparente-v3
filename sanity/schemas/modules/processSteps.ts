import { NumberIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export const processSteps = defineType({
  name: "processSteps",
  title: "Process Steps",
  icon: NumberIcon,
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: 'Section eyebrow label. e.g. "Process" / "Processo"',
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              description:
                "Lucide icon name (e.g. 'MessageSquare', 'FileSearch', 'Handshake')",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
            }),
          ],
          preview: {
            select: { title: "title", icon: "icon" },
            prepare({ title, icon }) {
              return {
                title: title || "Step",
                subtitle: icon ? `Icon: ${icon}` : undefined,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "heading",
      steps: "steps",
      visible: "visible",
    },
    prepare({ title, steps, visible }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}${title || "Process Steps"}`,
        subtitle: `${steps?.length || 0} steps`,
      };
    },
  },
});
