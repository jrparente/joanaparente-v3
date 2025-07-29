import { defineField, defineType } from "sanity";

export default defineType({
  title: "Logo List",
  name: "logoList",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: "logos",
      type: "array",
      of: [{ type: "reference", to: [{ type: "logo" }] }],
      description: "Leave empty to display all logos",
    }),
  ],

  preview: {
    select: {
      title: "title",
    },
    prepare(selection: any) {
      const { title } = selection;
      return {
        title: title,
        subtitle: "Logo List",
      };
    },
  },
});
