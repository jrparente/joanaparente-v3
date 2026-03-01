import { CreditCardIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export const serviceTiers = defineType({
  name: "serviceTiers",
  title: "Service Tiers (Full)",
  icon: CreditCardIcon,
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: 'e.g. "Services" or "Serviços"',
    }),
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      description: 'e.g. "Services & Pricing"',
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
              name: "subtitle",
              title: "Subtitle",
              type: "string",
              description:
                'Who this tier is for. e.g. "For boutique hotels and guesthouses"',
            }),
            defineField({
              name: "priceRange",
              title: "Price Range",
              type: "string",
              description: 'e.g. "€1,200 – €2,500"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "features",
              title: "Features / Deliverables",
              type: "array",
              of: [{ type: "string" }],
              description:
                'What is included. Be specific. "Custom Sanity CMS with client training" not "CMS".',
            }),
            defineField({
              name: "highlighted",
              title: "Mark as Recommended",
              type: "boolean",
              description:
                'Shows this tier with a terracotta border and "Most popular" badge.',
              initialValue: false,
            }),
            defineField({
              name: "timeline",
              title: "Timeline",
              type: "string",
              description: 'e.g. "4–6 weeks from kickoff"',
            }),
            defineField({
              name: "badgeLabel",
              title: "Badge Label",
              type: "string",
              description:
                'Shown above highlighted tiers. e.g. "Most popular" or "Mais popular"',
            }),
            defineField({
              name: "proofLabel",
              title: "Proof Label",
              type: "string",
              description:
                'e.g. "See it in action:" or "Vê em ação:"',
            }),
            defineField({
              name: "proofLink",
              title: "Proof Link",
              type: "object",
              description: "Case study link shown below features",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                }),
                defineField({
                  name: "href",
                  title: "URL",
                  type: "url",
                  validation: (rule) =>
                    rule.uri({
                      allowRelative: true,
                      scheme: ["http", "https"],
                    }),
                }),
              ],
            }),
            defineField({
              name: "ctaLabel",
              title: "CTA Button Label",
              type: "string",
              description: 'e.g. "Get a free quote"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "ctaLink",
              title: "CTA Link",
              type: "link",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "priceRange" },
          },
        },
      ],
      validation: (rule) => rule.required().min(1).max(4),
    }),
    defineField({
      name: "footnote",
      title: "Footnote",
      type: "string",
      description:
        'Text below tier cards. Supports a markdown-style link: [label](url). e.g. "Not sure? [Tell me what you need](/contact)."',
    }),
  ],
  preview: {
    select: { title: "heading", visible: "visible" },
    prepare({ title, visible }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}Service Tiers: ${title}`,
        media: CreditCardIcon,
      };
    },
  },
});
