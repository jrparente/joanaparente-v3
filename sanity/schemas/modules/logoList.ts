import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export default defineType({
  title: "Logo List",
  name: "logoList",
  type: "object",
  fields: [
    visibleField,
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
      visible: "visible",
    },
    prepare(selection: any) {
      const { title, visible } = selection;
      return {
        title: `${visible === false ? "[Hidden] " : ""}${title}`,
        subtitle: "Logo List",
      };
    },
  },
});
