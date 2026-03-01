import { defineField, defineType } from "sanity";
import { LinkIcon } from "@sanity/icons";
import { visibleField } from "../fragments/visibleField";

export const connectStrip = defineType({
  name: "connectStrip",
  title: "Connect Strip",
  icon: LinkIcon,
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: 'e.g. "See more of my work and thinking"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [
        {
          type: "object",
          name: "connectLink",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) =>
                Rule.required().uri({
                  scheme: ["http", "https"],
                }),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        },
      ],
      validation: (Rule) => Rule.max(5),
    }),
  ],
  preview: {
    select: {
      title: "label",
      visible: "visible",
    },
    prepare({ title, visible }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}Connect Strip`,
        subtitle: title,
        media: LinkIcon,
      };
    },
  },
});
