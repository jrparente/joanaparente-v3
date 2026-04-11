import { defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

export default defineType({
  name: "footer",
  title: "Footer",
  icon: EarthGlobeIcon,
  type: "document",
  fields: [
    defineField({
      name: "showLogo",
      title: "Show Logo",
      type: "boolean",
      initialValue: true,
      description: "Toggle the logo in the footer",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: 'e.g. "Algarve, Portugal". Leave empty to hide.',
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;
          return value.includes("@") || "Must be a valid email address";
        }),
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineField({
          name: "social",
          type: "object",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              title: "Platform",
            }),
            defineField({
              name: "url",
              type: "url",
              title: "URL",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "navLinks",
      title: "Navigation Links",
      type: "array",
      description:
        "Footer navigation items. Path should be the English slug (e.g. /about, /services). Localized paths are resolved automatically.",
      of: [
        defineField({
          name: "navLink",
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              title: "Label",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "path",
              type: "string",
              title: "Path",
              description: 'Relative path, e.g. "/about", "/services"',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "path" },
          },
        }),
      ],
    }),
    defineField({
      name: "legalLinks",
      title: "Legal Links",
      type: "array",
      description: "Privacy Policy, Terms, etc.",
      of: [
        defineField({
          name: "legalLink",
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              title: "Label",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "path",
              type: "string",
              title: "Path",
              description: 'Relative path, e.g. "/privacy"',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "path" },
          },
        }),
      ],
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      description:
        'Text after "© 2026". e.g. "Joana Parente". Year is added automatically.',
      initialValue: "Joana Parente",
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Footer",
      media: EarthGlobeIcon,
    }),
  },
});
