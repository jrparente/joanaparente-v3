import { defineField, defineType } from "sanity";

export default defineType({
  name: "site",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "seo", title: "SEO" },
    { name: "navigation", title: "Navigation" },
  ],
  fields: [
    // General Settings
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      group: "general",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "domain",
      title: "Site URL",
      group: "general",
      type: "url",
      description: "Primary domain (e.g., https://www.tessaschack.com/)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      group: "general",
    }),

    defineField({
      name: "metadata",
      title: "Metadata",
      type: "metadata",
      group: "seo",
      description: "Default SEO metadata for the site.",
    }),
    defineField({
      name: "faviconLight",
      title: "Favicon (Light Mode)",
      type: "image",
      description: "Favicon used when the website is in light mode.",
      options: { hotspot: false },
      group: "seo",
    }),
    defineField({
      name: "faviconDark",
      title: "Favicon (Dark Mode)",
      type: "image",
      description: "Favicon used when the website is in dark mode.",
      options: { hotspot: false },
      group: "seo",
    }),

    // Social Links
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineField({
          name: "socialLink",
          type: "object",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              title: "Platform Name",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              type: "url",
              title: "URL",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "iconWhite",
              type: "image",
              title: "Platform Icon (Light)",
              options: { hotspot: true },
              description: "For use on light backgrounds",
            }),
            defineField({
              name: "icon",
              type: "image",
              title: "Platform Icon (Dark)",
              options: { hotspot: true },
              description: "For use on dark backgrounds",
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        }),
      ],
      group: "general",
    }),

    defineField({
      name: "language",
      title: "Language",
      type: "string",
      readOnly: true,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
