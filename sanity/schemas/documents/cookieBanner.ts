import { defineField, defineType } from "sanity";
import { ControlsIcon } from "@sanity/icons";

export default defineType({
  name: "cookieBanner",
  title: "Cookie Banner",
  icon: ControlsIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Banner Title",
      type: "string",
      description: 'Heading shown on the cookie banner. e.g. "We use cookies"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Banner Description",
      type: "string",
      description:
        "Body text explaining what cookies are used for and what the user can do.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "acceptLabel",
      title: "Accept Button Label",
      type: "string",
      description: 'Text for the accept button. e.g. "Accept"',
      initialValue: "Accept",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rejectLabel",
      title: "Reject Button Label",
      type: "string",
      description: 'Text for the reject button. e.g. "Reject"',
      initialValue: "Reject",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "privacyPolicyLink",
      title: "Privacy Policy Link",
      type: "link",
      description: "Link to the Privacy Policy page, shown in the banner text.",
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      language: "language",
    },
    prepare: ({ language }) => ({
      title: `Cookie Banner${language ? ` (${language.toUpperCase()})` : ""}`,
      media: ControlsIcon,
    }),
  },
});
