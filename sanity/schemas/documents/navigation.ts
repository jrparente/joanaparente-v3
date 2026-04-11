import { defineField, defineType } from "sanity";
import { Menu } from "lucide-react";

export default defineType({
  name: "navigation",
  title: "Navigation",
  icon: Menu,
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "items",
      type: "array",
      of: [{ type: "link" }],
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Button Label",
      type: "string",
      description: "Label for the header CTA button (e.g. 'Let's talk' / 'Falar comigo')",
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Button Link",
      type: "link",
      description: "Page or URL the CTA button links to",
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title,
    }),
  },
});
