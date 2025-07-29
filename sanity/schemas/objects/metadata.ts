import { defineField, defineType } from "sanity";

export default defineType({
  name: "metadata",
  title: "Metadata",
  description: "For search engines",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.max(70).warning(),
    }),
    // SEO Settings
    defineField({
      name: "metaDescription",
      title: "Default Meta Description",
      type: "text",
      description:
        "This is the default meta description for the site. Individual pages can override this.",

      validation: (Rule) =>
        Rule.max(160).warning("Keep under 160 characters for best SEO."),
    }),
    defineField({
      name: "keywords",
      title: "Default SEO Keywords",
      type: "array",
      of: [{ type: "string" }],
      description: "Enter keywords to help with SEO (comma-separated).",
    }),

    defineField({
      name: "defaultOgImage",
      title: "Default Open Graph Image",
      type: "image",
      description:
        "Fallback OG image for social sharing if a page doesn’t have its own.",
      options: { hotspot: true },
    }),
    defineField({
      name: "defaultTwitterImage",
      title: "Default Twitter Image",
      type: "image",
      description:
        "Fallback Twitter card image if a page doesn’t have its own.",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      description: "Prevent search engines from indexing this page",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
