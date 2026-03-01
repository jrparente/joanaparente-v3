import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export const serviceTierPreview = defineType({
  name: "serviceTierPreview",
  title: "Service Tier Preview",
  icon: TagIcon,
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: 'Section eyebrow label. e.g. "Services" / "Serviços"',
    }),
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      description: 'e.g. "What I build"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tiers",
      title: "Tiers",
      type: "array",
      of: [
        {
          type: "object",
          name: "tier",
          fields: [
            defineField({
              name: "name",
              title: "Tier Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "tagline",
              title: "Tagline",
              type: "string",
              description: "One short line describing who this is for.",
            }),
            defineField({
              name: "startingPrice",
              title: "Starting Price",
              type: "string",
              description: 'e.g. "From €1,200" or "From €3,500"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "highlights",
              title: "Highlights",
              type: "array",
              of: [{ type: "string" }],
              description:
                "Up to 4 key deliverables. Keep each under 8 words.",
              validation: (rule) => rule.max(4),
            }),
            defineField({
              name: "highlighted",
              title: "Highlighted",
              type: "boolean",
              description:
                'Mark as recommended tier. Shows "Most popular" badge and terracotta border.',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "startingPrice" },
          },
        },
      ],
      validation: (rule) => rule.required().min(1).max(3),
    }),
    defineField({
      name: "ctaLink",
      title: "Link to Full Services Page",
      type: "link",
      description:
        'Shared CTA below all cards. e.g. "See full services & pricing" → /services',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading", visible: "visible" },
    prepare({ title, visible }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}Service Tier Preview: ${title}`,
        media: TagIcon,
      };
    },
  },
});
