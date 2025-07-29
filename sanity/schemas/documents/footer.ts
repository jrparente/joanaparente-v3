import { defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

export default defineType({
  name: "footer",
  title: "Footer",
  icon: EarthGlobeIcon,
  type: "document",
  fields: [
    defineField({
      name: "message",
      title: "Footer Message",
      type: "string",
      initialValue: "Designed and built by Joana Parente",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
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
            defineField({ name: "platform", type: "string" }),
            defineField({ name: "url", type: "url" }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      socialLinks: "socialLinks",
    },
    prepare: ({ socialLinks }) => ({
      title: "Footer",
      media: EarthGlobeIcon,
    }),
  },
});
