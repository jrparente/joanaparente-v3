import { FolderCodeIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  type: "document",
  icon: FolderCodeIcon,

  groups: [
    { name: "pageSettings", title: "Page Settings" },
    { name: "content", default: true, title: "Content" },
    { name: "technicalDetails", title: "Technical Details" },
    { name: "gallery", title: "Gallery" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "pageSettings",
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: "slug",
      type: "slug",
      group: "pageSettings",
      description:
        "The slug is the part of a URL which identifies a particular page on a website in an easy-to-read form. Use ´index´ for the homepage.",
      options: {
        source: "title",
      },
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "content",
      description: "A catchy phrase to introduce the project.",
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      group: "content",
      description: "A short and compelling one-liner to summarize the project.",
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      group: "content",
      description:
        "A detailed explanation of the project goals, challenges, and solutions.",
    }),

    defineField({
      name: "objective",
      title: "Objective",
      type: "array",
      of: [{ type: "block" }],
      group: "content",
      description: "Describe the project's main objective.",
    }),

    defineField({
      name: "liveUrl",
      title: "Live URL",
      type: "url",
      group: "content",
    }),

    defineField({
      name: "sourceCodeUrl",
      title: "Source Code URL",
      type: "url",
      group: "content",
    }),

    defineField({
      name: "date",
      title: "Project Date",
      type: "date",
      group: "content",
      description: "The date when the project was completed.",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
    }),

    defineField({
      name: "duration",
      title: "Project Duration",
      type: "string",
      group: "technicalDetails",
      description: "e.g., 2 months, 6 weeks.",
    }),

    defineField({
      name: "image",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      group: "content",
      validation: (Rule: any) => Rule.required(),
      fields: [
        {
          title: "Alt Text",
          name: "alt",
          type: "string",
          options: {
            isHighlighted: true,
          },
        },
      ],
    }),

    // New photo gallery field
    defineField({
      name: "photoGallery",
      title: "Photo Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "description", title: "Description", type: "string" },
            { name: "alt", title: "Alt Text", type: "string" },
          ],
        },
      ],
      group: "gallery",
    }),

    defineField({
      name: "keyFeatures",
      title: "Key Features Implemented",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "title",
              title: "Feature Title",
              type: "string",
            },
            {
              name: "description",
              title: "Feature Description",
              type: "text",
              description:
                "Detailed description of the feature and its impact.",
            },
          ],
        },
      ],
      group: "content",
      description:
        "List of key features implemented in the project, with titles and detailed descriptions.",
    }),

    defineField({
      name: "projectCategory",
      title: "Project Category",
      type: "string",
      group: "technicalDetails",
      description: "Distinguish between personal and client projects.",
      options: {
        list: [
          { title: "Client Project", value: "client" },
          { title: "Personal Project", value: "personal" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: "projectType",
      title: "Project Type",
      type: "string",
      group: "technicalDetails",
      description: "e.g., Website, App, E-commerce, API Integration",
      options: {
        list: [
          { title: "Website", value: "website" },
          { title: "Web App", value: "webapp" },
          { title: "E-Commerce", value: "e-commerce" },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: "techStack",
      title: "Tech Stack",
      type: "logoList",
      group: "technicalDetails",
      description: "e.g., React, Next.js, Sanity.io, Tailwind CSS, TypeScript.",
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: "role",
      title: "Your Role",
      type: "string",
      group: "technicalDetails",
      description:
        "e.g., Full-stack Developer, Frontend Developer, UX Designer.",
      validation: (Rule: any) => Rule.required(),
    }),

    defineField({
      name: "challenges",
      title: "Challenges",
      type: "array",
      group: "content",
      of: [{ type: "block" }],
      description: "Describe the challenges faced and how they were overcome.",
    }),

    defineField({
      name: "impact",
      title: "Project Impact",
      type: "array",
      group: "content",
      of: [{ type: "block" }],
      description:
        "Explain the project's impact on the client's business or users, including any quantifiable results (e.g., increased website traffic, improved performance, etc.).",
    }),

    // Reference to testimonials object
    // defineField({
    //   name: "testimonials",
    //   title: "Testimonials",
    //   type: "array",
    //   group: "content",
    //   of: [{ type: "reference", to: [{ type: "testimonial" }] }],
    // }),

    defineField({
      name: "seo",
      type: "metadata",
      group: "seo",
    }),

    defineField({
      name: "language",
      type: "string",
      readOnly: true,
    }),
  ],
});
