import { defineType, defineField } from "sanity";
import { UserIcon } from "@sanity/icons";

export default defineType({
  name: "bioPage",
  title: "Bio Page",
  type: "object",
  icon: UserIcon,
  fields: [
    defineField({
      name: "profileImage",
      title: "Profile Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "name",
      title: "Display Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Short Bio",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "url",
              title: "URL",
              type: "string",
              validation: (Rule) =>
                Rule.required().custom((value) => {
                  if (
                    !value ||
                    (typeof value === "string" &&
                      (value.startsWith("http://") ||
                        value.startsWith("https://") ||
                        value.startsWith("mailto:") ||
                        value.startsWith("tel:")))
                  ) {
                    return true;
                  }
                  return "Must be a valid URL (http, https, mailto, or tel)";
                }),
            },
            {
              name: "icon",
              title: "Icon (optional)",
              type: "string",
              description: "Name of an icon (e.g., 'github', 'linkedin').",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "backgroundColor",
      title: "Background Color",
      type: "string",
      description: "Hex color (e.g., #ffffff). Optional.",
    }),
    defineField({
      name: "textColor",
      title: "Text Color",
      type: "string",
      description: "Hex color (e.g., #000000). Optional.",
    }),
    defineField({
      name: "noIndex",
      title: "No Index",
      type: "boolean",
      description: "Prevent search engines from indexing this page.",
    }),
  ],
});
