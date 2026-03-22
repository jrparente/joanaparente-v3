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
    { name: "technicalDetails", title: "Technical Details" },
    { name: "gallery", title: "Gallery" },
    { name: "seo", title: "SEO" },
  ],

  fieldsets: [
    {
      name: "hero",
      title: "1 — Hero",
      description: "Back link, eyebrow, title, subtitle, visit button",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "metricBar",
      title: "2 — Metric Bar",
      description: "4 key business metrics displayed across the page",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "objectiveSection",
      title: "3 — Objective",
      description: "What you set out to build",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "challengesSection",
      title: "4 — Challenges",
      description: "How the project unfolded (long narrative)",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "impactSection",
      title: "5 — Impact",
      description: "What changed — intro paragraph + bullet list",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "takeawaySection",
      title: "6 — Takeaway",
      description: "Lead sentence (Fraunces italic) + body reflection",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "transformationSection",
      title: "7 — Transformation Statement",
      description: "One bold sentence, centered",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "testimonialSection",
      title: "8 — Testimonial (HOLD)",
      description: "Client quote — leave empty until collected",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "techStackSection",
      title: "9 — Tech Stack",
      description: "Tech pills — set in Technical Details tab",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "relatedSection",
      title: "10 — Related Work",
      description: "2 related project cards",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "ctaSection",
      title: "11 — CTA",
      description: "Terracotta band with heading, subheading, button",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "sectionLabelsFieldset",
      title: "Section Labels",
      description: "Eyebrow and heading text for each case-study section. Translated via document internationalization.",
      options: { collapsible: true, collapsed: true },
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

    // ─── Case Study (matches frontend section order) ────────────────

    // ── 1. Hero ──

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
      description:
        'e.g. "All projects" / "Todos os projetos".',
    }),

    defineField({
      name: "liveUrl",
      title: "Live URL",
      type: "url",
      group: "caseStudy",
      fieldset: "hero",
      description: "Renders the outline 'Visit site' button + browser frame address bar.",
    }),

    // ── 2. Metric Bar ──

    defineField({
      name: "businessMetrics",
      title: "Business Metrics",
      type: "array",
      group: "caseStudy",
      fieldset: "metricBar",
      description:
        "Quantifiable business outcomes. Use percentages and relative figures, not absolute revenue.",
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

    // ── 3. Objective ──

    defineField({
      name: "objective",
      title: "Objective",
      type: "array",
      of: [{ type: "block" }],
      group: "caseStudy",
      fieldset: "objectiveSection",
      description: "What the project set out to achieve. Last italic paragraph = timeline note.",
    }),

    // ── 4. Challenges ──

    defineField({
      name: "challenges",
      title: "Challenges",
      type: "array",
      group: "caseStudy",
      fieldset: "challengesSection",
      of: [{ type: "block" }],
      description:
        "Long-form narrative. Use blockquote for pull quotes. Images render inline.",
    }),

    // ── 5. Impact ──

    defineField({
      name: "impact",
      title: "Impact",
      type: "array",
      group: "caseStudy",
      fieldset: "impactSection",
      of: [{ type: "block" }],
      description:
        "Intro paragraph + bullet list with branded dots. Images render inline.",
    }),

    // ── 6. Takeaway ──

    defineField({
      name: "takeaway",
      title: "Takeaway",
      type: "array",
      of: [{ type: "block" }],
      group: "caseStudy",
      fieldset: "takeawaySection",
      description:
        "Block 1 = lead sentence (renders in Fraunces italic, brand color). Block 2+ = body text (renders in Jakarta Sans).",
    }),

    // ── 7. Transformation Statement ──

    defineField({
      name: "transformationStatement",
      title: "Transformation Statement",
      type: "string",
      group: "caseStudy",
      fieldset: "transformationSection",
      description:
        "One bold sentence (under 15 words). Centered on warm background. Also used as CTA heading fallback.",
    }),

    // ── 8. Testimonial ──

    defineField({
      name: "clientTestimonial",
      title: "Client Testimonial",
      type: "object",
      group: "caseStudy",
      fieldset: "testimonialSection",
      description:
        "Leave empty until a real quote is collected. Do not fabricate.",
      fields: [
        {
          name: "quote",
          title: "Quote",
          type: "text",
          rows: 4,
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "authorName",
          title: "Author Name",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "authorRole",
          title: "Author Role",
          type: "string",
        },
        {
          name: "authorCompany",
          title: "Author Company",
          type: "string",
        },
      ],
    }),

    // ── 9. Tech Stack (reference — managed in Technical Details tab) ──

    // Tech stack field is in the Technical Details group.
    // This fieldset is just a signpost in the Case Study tab.

    // ── 10. Related Work ──

    defineField({
      name: "relatedProjects",
      title: "Related Projects",
      type: "array",
      group: "caseStudy",
      fieldset: "relatedSection",
      description:
        "Select 2-3 related projects. Shown as text cards at the bottom.",
      of: [
        {
          type: "reference",
          to: [{ type: "project" }],
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),

    // ── 11. CTA ──

    defineField({
      name: "ctaHeading",
      title: "CTA Heading",
      type: "string",
      group: "caseStudy",
      fieldset: "ctaSection",
      description:
        "Custom heading for the terracotta CTA band. Falls back to Transformation Statement if empty.",
    }),

    defineField({
      name: "ctaSubheading",
      title: "CTA Subheading",
      type: "string",
      group: "caseStudy",
      fieldset: "ctaSection",
      description: "Subheading text below the CTA heading.",
    }),

    defineField({
      name: "ctaButtonLabel",
      title: "CTA Button Label",
      type: "string",
      group: "caseStudy",
      fieldset: "ctaSection",
      description:
        'Falls back to "Start a conversation" if empty.',
    }),

    // ── Section Labels ──

    defineField({
      name: "sectionLabels",
      title: "Section Labels",
      type: "object",
      group: "caseStudy",
      fieldset: "sectionLabelsFieldset",
      description:
        "Eyebrow and heading text for each case-study section.",
      fields: [
        {
          name: "objectiveEyebrow",
          title: "Objective Eyebrow",
          type: "string",
          description: 'e.g. "The objective"',
        },
        {
          name: "objectiveHeading",
          title: "Objective Heading",
          type: "string",
          description: 'e.g. "What we set out to build"',
        },
        {
          name: "challengesEyebrow",
          title: "Challenges Eyebrow",
          type: "string",
          description: 'e.g. "The challenge"',
        },
        {
          name: "challengesHeading",
          title: "Challenges Heading",
          type: "string",
          description: 'e.g. "How the project unfolded"',
        },
        {
          name: "impactEyebrow",
          title: "Impact Eyebrow",
          type: "string",
          description: 'e.g. "The impact"',
        },
        {
          name: "impactHeading",
          title: "Impact Heading",
          type: "string",
          description: 'e.g. "What changed"',
        },
        {
          name: "takeawayEyebrow",
          title: "Takeaway Eyebrow",
          type: "string",
          description: 'e.g. "The takeaway"',
        },
        {
          name: "takeawayHeading",
          title: "Takeaway Heading",
          type: "string",
          description: 'e.g. "What I learned"',
        },
        {
          name: "techStackEyebrow",
          title: "Tech Stack Eyebrow",
          type: "string",
          description: 'e.g. "Built with"',
        },
        {
          name: "techStackHeading",
          title: "Tech Stack Heading",
          type: "string",
          description: 'e.g. "Tech stack"',
        },
        {
          name: "relatedEyebrow",
          title: "Related Work Eyebrow",
          type: "string",
          description: 'e.g. "More work"',
        },
        {
          name: "relatedHeading",
          title: "Related Work Heading",
          type: "string",
          description: 'e.g. "Related projects"',
        },
        {
          name: "visitSiteLabel",
          title: "Visit Site Button Label",
          type: "string",
          description: 'e.g. "Visit faroldiscover.pt"',
        },
      ],
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
      description: "Used for grid cards on the portfolio page (4:3 or 3:2 crop).",
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
      description: "When the project was completed. Used in JSON-LD and sorting.",
      options: {
        dateFormat: "YYYY-MM-DD",
      },
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
        "Technologies used. Also renders as pill badges on the case study page (section 9).",
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

    // ─── Legacy fields (not in prototype, kept for backward compat) ──

    defineField({
      name: "description",
      title: "Description (legacy)",
      type: "array",
      of: [{ type: "block" }],
      group: "listing",
      description:
        "Legacy field — not rendered on the case study page. Kept for older projects.",
    }),

    defineField({
      name: "keyFeatures",
      title: "Key Features (legacy)",
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
      group: "listing",
      description: "Legacy field — not rendered on the case study page.",
    }),

    defineField({
      name: "productBridge",
      title: "Product Bridge CTA (legacy)",
      type: "object",
      group: "listing",
      description:
        "Legacy field — not rendered on the case study page.",
      fields: [
        {
          name: "productName",
          title: "Product Name",
          type: "string",
        },
        {
          name: "productUrl",
          title: "Product URL",
          type: "url",
        },
        {
          name: "productPrice",
          title: "Price Display",
          type: "string",
        },
        {
          name: "productTeaser",
          title: "Teaser Copy",
          type: "text",
        },
      ],
    }),

    defineField({
      name: "sourceCodeUrl",
      title: "Source Code URL",
      type: "url",
      group: "listing",
      hidden: ({ document }) => document?.projectCategory === "client",
    }),

    // ─── Gallery ──────────────────────────────────────────────────────

    defineField({
      name: "featuredScreenshot",
      title: "Featured Screenshot",
      type: "image",
      group: "gallery",
      options: { hotspot: true },
      description:
        "Rendered inside the browser frame on the case study page. Wide format (16:10).",
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
