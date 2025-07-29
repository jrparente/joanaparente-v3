import { defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons";

export const hero = defineType({
  name: "hero",
  title: "Hero Section",
  icon: StarIcon,
  type: "object",
  fields: [
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(50),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(100),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(200),
    }),
    defineField({
      name: "description",
      title: "Description",
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
      name: "buttonLink",
      title: "Button Link",
      type: "link",
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
    },
    prepare({ title, subtitle }) {
      return {
        title: "Hero Section",
        subtitle: `${title} - ${subtitle}`,
        media: StarIcon,
      };
    },
  },
});
