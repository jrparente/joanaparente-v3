import {
  BlockContentIcon,
  EnterIcon,
  EnterRightIcon,
  EqualIcon,
} from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { TextAlign } from "../fragments/TextAlign";
import { visibleField } from "../fragments/visibleField";

export const richText = defineType({
  name: "richText",
  title: "Rich Text",
  icon: BlockContentIcon,
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: 'Optional section eyebrow. e.g. "Your accounts. Your code."',
    }),
    defineField({
      name: "heading",
      title: "Section Heading",
      type: "string",
      description: 'Optional heading above content. e.g. "How ownership works"',
    }),
    defineField({
      name: "variant",
      title: "Visual Variant",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Elevated", value: "elevated" },
        ],
        layout: "radio",
      },
      initialValue: "default",
      description:
        '"Elevated" adds a tinted background with top/bottom borders.',
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "Blockquote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
              { title: "Highlight", value: "highlight" },
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
        {
          type: "object",
          name: "break",
          title: "Divider",
          fields: [
            {
              name: "style",
              title: "Style",
              type: "string",
              options: {
                list: [{ title: "Line", value: "line" }],
              },
              initialValue: "line",
            },
          ],
          preview: {
            prepare() {
              return { title: "── Divider ──" };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      visible: "visible",
    },
    prepare({ visible }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}Rich Text`,
        subtitle: "A flexible rich text editor for content blocks",
      };
    },
  },
});
