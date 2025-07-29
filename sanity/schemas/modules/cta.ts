import { defineField, defineType } from "sanity";
import { RocketIcon } from "@sanity/icons";

export const cta = defineType({
  name: "cta",
  title: "Call to Action",
  type: "object",
  icon: RocketIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(100),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required().min(1).max(200),
    }),
    defineField({
      name: "buttonLink",
      title: "Button Link 1",
      type: "link",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "buttonLink2",
      title: "Button Link 2",
      type: "link",
    }),
  ],
});
