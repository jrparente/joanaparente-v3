import { defineField, defineType } from "sanity";

export default defineType({
  name: "logo",
  title: "Logo",
  type: "document",

  fields: [
    defineField({
      name: "name",
      type: "string",
    }),
    defineField({
      name: "image",
      type: "object",
      options: {
        columns: 3,
      },
      fields: [
        defineField({
          name: "default",
          type: "image",
          validation: (Rule: any) => Rule.required(),
        }),
        defineField({
          name: "light",
          description: "On dark backgrounds",
          type: "image",
        }),
        defineField({
          name: "dark",
          description: "On light backgrounds",
          type: "image",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image.default",
    },
    prepare: ({ title, media }) => ({
      title,
      subtitle: "Logo",
      media,
    }),
  },
});
