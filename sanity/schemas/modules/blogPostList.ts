import { DocumentsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export const blogPostList = defineType({
  name: "blogPostList",
  title: "Blog Post List",
  icon: DocumentsIcon,
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "maxPosts",
      title: "Maximum Posts",
      type: "number",
      description: "Limit the number of posts to display (leave empty for all)",
    }),
    // TODO: Implement tag filtering if needed
    // defineField({
    //   name: "tagFilter",
    //   title: "Filter by Tag",
    //   type: "reference",
    //   to: [{ type: "tag" }],
    // }),
  ],
  preview: {
    select: {
      visible: "visible",
    },
    prepare({ visible }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}Blog Post List`,
        subtitle: "Displays all blog posts automatically",
      };
    },
  },
});
