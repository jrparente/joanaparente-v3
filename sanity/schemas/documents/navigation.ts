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
