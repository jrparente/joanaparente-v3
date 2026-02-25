import { EnvelopeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const contactSection = defineType({
  name: "contactSection",
  title: "Contact Section",
  icon: EnvelopeIcon,
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: "Small label above the heading (e.g. 'Contact')",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      description: "Introductory paragraph below the heading",
    }),
    defineField({
      name: "emailLabel",
      title: "Email Button Label",
      type: "string",
    }),
    defineField({
      name: "linkedinLabel",
      title: "LinkedIn Button Label",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "microcopy",
      title: "Microcopy",
      type: "string",
      description: "Small italic text below the CTA buttons",
    }),
    defineField({
      name: "backLabel",
      title: "Back Link Label",
      type: "string",
      description: "Label for the back-to-home link",
    }),
  ],
  preview: {
    select: {
      title: "heading",
    },
    prepare({ title }) {
      return {
        title: title || "Contact Section",
        subtitle: "Contact information and CTA",
      };
    },
  },
});
