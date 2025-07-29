import {
  BlockContentIcon,
  EnterIcon,
  EnterRightIcon,
  EqualIcon,
} from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { TextAlign } from "../fragments/TextAlign";

export const richText = defineType({
  name: "richText",
  title: "Rich Text",
  icon: BlockContentIcon,
  type: "object",
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block",
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
              {
                title: "Left",
                value: "left",
                icon: EnterIcon,
                component: TextAlign,
              },
              {
                title: "Center",
                value: "center",
                icon: EqualIcon,
                component: TextAlign,
              },
              {
                title: "Right",
                value: "right",
                icon: EnterRightIcon,
                component: TextAlign,
              },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                ],
              },
            ],
          },
        },
        { type: "image" },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Rich Text",
        subtitle: "A flexible rich text editor for content blocks",
      };
    },
  },
});
