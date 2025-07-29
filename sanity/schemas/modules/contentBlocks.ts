import { defineType } from "sanity";

export const contentBlocks = defineType({
  name: "contentBlocks",
  title: "Content Blocks",
  type: "array",
  of: [
    { type: "blogPostList" },
    { type: "richText" },
    { type: "imageGallery" },
    { type: "cta" },
    { type: "hero" },
    { type: "intro" },
  ],
});
