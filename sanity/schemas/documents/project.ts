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
    // ─── Page Settings ────────────────────────────────────────────────

    defineField({
      name: "title",
      type: "string",
      group: "pageSettings",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      type: "slug",
      group: "pageSettings",
      description:
        "The slug is the part of a URL which identifies a particular page on a website in an easy-to-read form. Use 'index' for the homepage.",
      options: {
        source: "title",
      },
      validation: (Rule) => Rule.required(),
    }),

    // ─── Content ──────────────────────────────────────────────────────

    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "content",
      description: "A catchy phrase to introduce the project.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      group: "content",
      description:
        "A short and compelling one-liner to summarize the project.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "clientIndustry",
      title: "Client Industry",
      type: "string",
      group: "content",
      description:
        "The client's industry for filtering and persona matching.",
      options: {
        list: [
          { title: "Tourism & Activities", value: "tourism-activities" },
          { title: "Tourism & Hospitality", value: "tourism-hospitality" },
          { title: "Photography & Creative", value: "photography-creative" },
          { title: "Food & Beverage", value: "food-beverage" },
          { title: "Consulting", value: "consulting" },
          { title: "Other", value: "other" },
        ],
      },
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
      name: "businessMetrics",
      title: "Business Metrics",
      type: "array",
      group: "content",
      description:
        "Quantifiable business outcomes shown as stat cards. Use percentages and relative figures, not absolute revenue.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Metric Label",
              type: "string",
              description: "e.g., Direct Booking Rate",
            },
            {
              name: "value",
              title: "Metric Value",
              type: "string",
              description: "e.g., 0% → 15% or 200%+",
            },
            {
              name: "context",
              title: "Context Note",
              type: "string",
              description:
                "Optional. e.g., Year 1 result, held in 2025–2026.",
            },
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
    }),

    defineField({
      name: "transformationStatement",
      title: "Transformation Statement",
      type: "string",
      group: "content",
      description:
        "The case study's primary value statement (under 15 words). Used in the CTA block at the bottom.",
    }),

    defineField({
      name: "productBridge",
      title: "Product Bridge CTA",
      type: "object",
      group: "content",
      description:
        "The low-ticket product linked at the bottom of this case study.",
      fields: [
        {
          name: "productName",
          title: "Product Name",
          type: "string",
          description: "e.g., The Direct Booking Playbook",
        },
        {
          name: "productUrl",
          title: "Product URL",
          type: "url",
          description: "Gumroad/LemonSqueezy link.",
        },
        {
          name: "productPrice",
          title: "Price Display",
          type: "string",
          description: "e.g., $147 / €135",
        },
        {
          name: "productTeaser",
          title: "Teaser Copy",
          type: "text",
          description:
            "One sentence describing what the product teaches. Max 20 words.",
        },
      ],
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
      hidden: ({ document }) => document?.projectCategory === "client",
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
      name: "image",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      group: "content",
      description: "Used for grid cards (4:3 or 3:2 crop).",
      validation: (Rule) => Rule.required(),
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
      description: "List of key features implemented in the project.",
    }),

    defineField({
      name: "challenges",
      title: "Challenges",
      type: "array",
      group: "content",
      of: [{ type: "block" }],
      description:
        "Describe the challenges faced and how they were overcome.",
    }),

    defineField({
      name: "impact",
      title: "Project Impact",
      type: "array",
      group: "content",
      of: [{ type: "block" }],
      description:
        "Explain the project's impact on the client's business or users.",
    }),

    // ─── Technical Details ────────────────────────────────────────────

    defineField({
      name: "duration",
      title: "Project Duration",
      type: "string",
      group: "technicalDetails",
      description: "e.g., 2 months, 6 weeks.",
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
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "projectType",
      title: "Project Type",
      type: "string",
      group: "technicalDetails",
      description: "e.g., Website, App, E-commerce",
      options: {
        list: [
          { title: "Website", value: "website" },
          { title: "Web App", value: "webapp" },
          { title: "E-Commerce", value: "e-commerce" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "techStack",
      title: "Tech Stack",
      type: "logoList",
      group: "technicalDetails",
      description:
        "e.g., React, Next.js, Sanity.io, Tailwind CSS, TypeScript.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "role",
      title: "Your Role",
      type: "string",
      group: "technicalDetails",
      description:
        "e.g., Full-stack Developer, Frontend Developer, UX Designer.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "projectScope",
      title: "Project Scope Summary",
      type: "string",
      group: "technicalDetails",
      description:
        "One-line scope description. e.g., Multilingual tourism platform, built from scratch.",
    }),

    defineField({
      name: "hoursInvested",
      title: "Hours Invested",
      type: "number",
      group: "technicalDetails",
      description:
        "Total hours tracked on this project. Internal reference.",
    }),

    defineField({
      name: "targetPersona",
      title: "Primary Target Persona",
      type: "string",
      group: "technicalDetails",
      description:
        "The primary audience persona this case study speaks to.",
      options: {
        list: [
          { title: "Boutique Hospitality Owner", value: "hospitality-owner" },
          { title: "Tourism Activity Operator", value: "activity-operator" },
          { title: "Tourism DMC / B2B Operator", value: "tourism-b2b" },
          {
            title: "International Remote-First Client",
            value: "international-remote",
          },
          { title: "Algarve Expat Entrepreneur", value: "expat-entrepreneur" },
        ],
      },
    }),

    // ─── Gallery ──────────────────────────────────────────────────────

    defineField({
      name: "featuredScreenshot",
      title: "Featured Screenshot",
      type: "image",
      group: "gallery",
      options: { hotspot: true },
      description:
        "Wide-format hero screenshot for the case study page. Distinct from the grid card image.",
      fields: [
        { name: "alt", title: "Alt Text", type: "string" },
        {
          name: "caption",
          title: "Caption",
          type: "string",
          description: "Optional caption displayed below the screenshot.",
        },
      ],
    }),

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

    // ─── SEO ──────────────────────────────────────────────────────────

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
