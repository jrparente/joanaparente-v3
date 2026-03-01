import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export const testimonials = defineType({
  name: "testimonials",
  title: "Testimonials",
  icon: UsersIcon,
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: 'e.g. "Clients"',
    }),
    defineField({
      name: "heading",
      title: "Section Heading (optional)",
      type: "string",
      description:
        'e.g. "What clients say". Leave blank to omit the heading.',
    }),
    defineField({
      name: "items",
      title: "Testimonials",
      type: "array",
      of: [
        {
          type: "object",
          name: "testimonial",
          fields: [
            defineField({
              name: "quote",
              title: "Quote",
              type: "text",
              description:
                "The testimonial text. First person. Specific outcome preferred.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "authorName",
              title: "Author Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "authorRole",
              title: "Author Role",
              type: "string",
              description: 'e.g. "Owner"',
            }),
            defineField({
              name: "authorCompany",
              title: "Author Company",
              type: "string",
              description: 'e.g. "Farol Discover"',
            }),
            defineField({
              name: "authorImage",
              title: "Author Photo (optional)",
              type: "image",
              description:
                "Small circular avatar. Use only if you have a real photo with permission.",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: "authorName", subtitle: "authorCompany" },
          },
        },
      ],
      validation: (rule) => rule.min(0),
    }),
  ],
  preview: {
    select: { title: "heading", visible: "visible" },
    prepare({ title, visible }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}Testimonials: ${title ?? "(no heading)"}`,
        media: UsersIcon,
      };
    },
  },
});
