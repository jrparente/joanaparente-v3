import { ImagesIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const imageGallery = defineType({
  name: "imageGallery",
  title: "Image Gallery",
  icon: ImagesIcon,
  type: "object",
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true }, fields: [] }],
    }),
  ],
  options: {
    collapsible: true,
    collapsed: false,
    modal: { type: "popover" },
  },
  preview: {
    select: {
      images: "images",
    },
    prepare({ images }) {
      return {
        title: "Image Gallery",
        subtitle: `Displays a gallery of ${images?.length ?? 0} images`,
      };
    },
  },
});
