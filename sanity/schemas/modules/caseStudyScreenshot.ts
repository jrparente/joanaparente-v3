import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export const caseStudyScreenshot = defineType({
  name: "caseStudyScreenshot",
  title: "Screenshot",
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "image",
      title: "Screenshot Image",
      type: "image",
      description: "Browser / No Frame: capture at 1360x850px (16:10). Phone: use Chrome DevTools mobile mode (iPhone 14: 390x844px viewport) then screenshot, or take a screenshot on your phone.",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule: any) => rule.required(),
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "liveUrl",
      title: "Live URL",
      type: "url",
      description:
        "Optional. Shows in the browser address bar and links to the live site.",
    }),
    defineField({
      name: "frameStyle",
      title: "Frame Style",
      type: "string",
      description:
        "Browser / No Frame: 1360x850px. Phone: capture in mobile view (DevTools iPhone mode or real phone screenshot).",
      options: {
        list: [
          { title: "Browser Window (1360x850px)", value: "browser" },
          { title: "Phone (DevTools mobile or real phone screenshot)", value: "phone" },
          { title: "No Frame (1360x850px)", value: "none" },
        ],
        layout: "radio",
      },
      initialValue: "browser",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional caption below the image.",
    }),
  ],
  preview: {
    select: {
      alt: "image.alt",
      visible: "visible",
      media: "image",
    },
    prepare({ alt, visible, media }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}Screenshot${alt ? `: ${alt}` : ""}`,
        media,
      };
    },
  },
});
