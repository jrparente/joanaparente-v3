import { DocumentsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const blogPostList = defineType({
  name: "blogPostList",
  title: "Blog Post List",
  icon: DocumentsIcon,
  type: "object",
  fields: [
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
    prepare() {
      return {
        title: "Blog Post List",
        subtitle: "Displays all blog posts automatically",
      };
    },
  },
});
