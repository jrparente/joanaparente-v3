import { defineField, defineType } from "sanity";
import { ComposeIcon } from "@sanity/icons";
import { visibleField } from "../fragments/visibleField";

export const intro = defineType({
  name: "intro",
  title: "Intro Section",
  icon: ComposeIcon,
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: "anchor",
      title: "Anchor ID (slug)",
      type: "string",
      description:
        "Used for anchor navigation (e.g., #about-me). Must be unique on the page.",
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "string",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "richText",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "byline",
      title: "Byline",
      type: "string",
      description:
        'Displayed after the content. e.g. "Joana Ramos Parente · Faro, Portugal"',
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
        title: `${visible === false ? "[Hidden] " : ""}Intro Section`,
        subtitle: `${title} - ${subtitle}`,
        media: ComposeIcon,
      };
    },
  },
});
