import { FolderCodeIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  type: "document",
  icon: FolderCodeIcon,

  groups: [
    { name: "pageSettings", title: "Page Settings" },
    { name: "caseStudy", default: true, title: "Case Study" },
    { name: "listing", title: "Listing & Cards" },
    { name: "seo", title: "SEO" },
  ],

  fieldsets: [
    {
      name: "hero",
      title: "Hero",
      description: "Back link, eyebrow, title, subtitle, visit button",
      options: { collapsible: true, collapsed: false },
    },
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

    // ─── Case Study ──────────────────────────────────────────────────

    // ── Hero (fixed fields — document identity) ──

    defineField({
      name: "eyebrowLabel",
      title: "Eyebrow Label",
      type: "string",
      group: "caseStudy",
      fieldset: "hero",
      description:
        'Text above the title. Defaults to "Case Study" / "Caso de Estudo" if empty.',
    }),

    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 4,
      group: "caseStudy",
      fieldset: "hero",
      description:
        "The long paragraph below the title. Also used as card description in listing.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "backLabel",
      title: "Back Link Label",
      type: "string",
      group: "caseStudy",
      fieldset: "hero",
      description: 'e.g. "All projects" / "Todos os projetos".',
    }),

    defineField({
      name: "liveUrl",
      title: "Live URL",
      type: "url",
      group: "caseStudy",
      fieldset: "hero",
      description:
        "Renders the outline 'Visit site' button in the hero section.",
    }),

    defineField({
      name: "featuredScreenshot",
      title: "Featured Screenshot",
      type: "image",
      group: "caseStudy",
      fieldset: "hero",
      options: { hotspot: true },
      description:
        "Renders inside the browser frame at the top of the case study. Capture at 1360×850px (16:10).",
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

    // ── Content Blocks (modular, reorderable) ──

    defineField({
      name: "caseStudyBlocks",
      title: "Case Study Content",
      type: "caseStudyBlocks",
      group: "caseStudy",
      description:
        "Build your case study from reusable content blocks. Add, reorder, or hide sections as needed.",
    }),

    // ── Card/Listing fields that also serve other components ──

    defineField({
      name: "businessMetrics",
      title: "Business Metrics",
      type: "array",
      group: "caseStudy",
      description:
        "Quantifiable business outcomes. Used by ProjectCard metric badge and CaseStudySpotlight. For the case study page, use a MetricBar content block instead.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Metric Label",
              type: "string",
              description: "e.g., direct revenue in the first full year",
            },
            {
              name: "value",
              title: "Metric Value",
              type: "string",
              description: "e.g., 0% → ~15% or ~4.5x",
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
      group: "caseStudy",
      description:
        "One bold sentence. Used by CaseStudySpotlight on other pages. For the case study page, use a Transformation Statement content block instead.",
    }),

    // ─── Listing & Cards ────────────────────────────────────────────

    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "listing",
      description: "Short phrase for project cards in the portfolio grid.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "clientIndustry",
      title: "Client Industry",
      type: "string",
      group: "listing",
      description:
        "Used for filtering and persona matching on the portfolio page.",
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
      name: "image",
      title: "Card Image",
      type: "image",
      options: { hotspot: true },
      group: "listing",
      description:
        "Used for grid cards on the portfolio page (4:3 or 3:2 crop).",
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
      name: "date",
      title: "Project Date",
      type: "date",
      group: "listing",
      description:
        "When the project was completed. Used in JSON-LD and sorting.",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
    }),

    defineField({
      name: "projectCategory",
      title: "Project Category",
      type: "string",
      group: "listing",
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
      group: "listing",
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
      group: "listing",
      description:
        "Technologies used. Shown as pill badges on ProjectCard and used for JSON-LD keywords.",
      validation: (Rule) => Rule.required(),
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
