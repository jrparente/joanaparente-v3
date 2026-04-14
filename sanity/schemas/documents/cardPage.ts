import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "cardPage",
  title: "Card Page (/card)",
  icon: UserIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Displayed on the page and in the vCard FN field.",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Short brand line below the name. Same in both languages.",
    }),
    defineField({
      name: "oneliner",
      title: "One-liner",
      type: "string",
      description:
        "One grounding sentence shown below the tagline. Translate per language document.",
    }),
    defineField({
      name: "saveContactLabel",
      title: "Save Contact Button Label",
      type: "string",
      description:
        'Label for the primary CTA. e.g. "Save Contact" / "Guardar contacto"',
    }),
    defineField({
      name: "visitWebsiteLabel",
      title: "Visit Website Button Label",
      type: "string",
      description:
        'Label for the secondary CTA. e.g. "Visit Website" / "Visitar website"',
    }),
    defineField({
      name: "links",
      title: "Contact Links",
      type: "array",
      of: [{ type: "link" }],
      description:
        "Email (mailto:), website, LinkedIn — all external type. Order determines display order.",
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      name: "jobTitle",
      title: "Job Title (vCard only)",
      type: "string",
      description: "Appears in the downloaded contact TITLE field.",
    }),
    defineField({
      name: "location",
      title: "Location (vCard only)",
      type: "string",
      description:
        'City, Country for the vCard ADR field. e.g. "Faro, Portugal"',
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      readOnly: true,
    }),
  ],
  preview: {
    select: { language: "language" },
    prepare: ({ language }) => ({
      title: `Card Page (/card)${language ? ` (${language.toUpperCase()})` : ""}`,
      media: UserIcon,
    }),
  },
});
