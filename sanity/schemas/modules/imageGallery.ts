import { ImagesIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export const imageGallery = defineType({
  name: "imageGallery",
  title: "Image Gallery",
  icon: ImagesIcon,
  type: "object",
  fields: [
    visibleField,
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
      visible: "visible",
    },
    prepare({ images, visible }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}Image Gallery`,
        subtitle: `Displays a gallery of ${images?.length ?? 0} images`,
      };
    },
  },
});
