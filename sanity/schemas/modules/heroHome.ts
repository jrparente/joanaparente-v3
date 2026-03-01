import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export const heroHome = defineType({
  name: "heroHome",
  title: "Homepage Hero",
  icon: HomeIcon,
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description:
        'Small label above the heading. e.g. "Full-Stack Developer & Digital Strategist"',
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description:
        "The large display heading. Use [[ ]] around words to apply brand accent colour (terracotta). Example: \"Websites that [[earn revenue]].\"",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "string",
      description: "Supporting line below the heading. 1–2 sentences max.",
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: "description",
      title: "Description (optional)",
      type: "array",
      of: [{ type: "block" }],
      description:
        "Optional short paragraph below the subheading. Use sparingly — the hero should be concise.",
    }),
    defineField({
      name: "ctaPrimary",
      title: "Primary CTA",
      type: "link",
      description:
        'Main button. Terracotta fill. Example: "See services & pricing" → /services',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ctaSecondary",
      title: "Secondary CTA (optional)",
      type: "link",
      description:
        'Ghost/outline button. Example: "View my work" → /projects',
    }),
    defineField({
      name: "proofStrip",
      title: "Proof Strip",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description: 'e.g. "50+", "8+", "100%"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: 'e.g. "Projects Delivered", "Years Experience"',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
      description: "Up to 4 key stats displayed below CTAs.",
      validation: (rule) => rule.max(4),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "subheading",
      visible: "visible",
    },
    prepare({ title, subtitle, visible }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}Hero: ${title}`,
        subtitle,
        media: HomeIcon,
      };
    },
  },
});
