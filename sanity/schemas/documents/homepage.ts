import { defineField, defineType } from "sanity";

export default defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  icon: () => "🏠",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        "The main title for the homepage - will be displayed as an H1, but visually it's smaller and below the subtitle.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contentBlocks",
      title: "Content Blocks",
      type: "contentBlocks",
      description: "Add various content blocks to structure your homepage.",
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      readOnly: true,
    }),
  ],
});
