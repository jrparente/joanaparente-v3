import { PresentationIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

const metricOverrideFields = [
  defineField({ name: "value", title: "Value", type: "string" }),
  defineField({ name: "label", title: "Label", type: "string" }),
  defineField({ name: "context", title: "Context (optional)", type: "string" }),
];

export const caseStudySpotlight = defineType({
  name: "caseStudySpotlight",
  title: "Case Study Spotlight",
  icon: PresentationIcon,
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "heading",
      title: "Section Heading (optional)",
      type: "string",
      description: 'e.g. "Built with Next.js" — shown as eyebrow on every card. Leave blank to omit.',
    }),
    defineField({
      name: "highlightMetrics",
      title: "Show business metrics",
      type: "boolean",
      description: "Displays the first metric from each project as a large headline figure.",
      initialValue: true,
    }),
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      description: "Add one or more case studies. Two projects render as a side-by-side grid; one renders full-width.",
      validation: (rule) => rule.min(1).error("At least one project is required."),
      of: [
        {
          type: "object",
          name: "caseStudySpotlightItem",
          fields: [
            defineField({
              name: "project",
              title: "Project",
              type: "reference",
              to: [{ type: "project" }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "transformationStatementOverride",
              title: "Summary override (optional)",
              type: "text",
              rows: 3,
              description: "Overrides the project's transformation statement for this card. Leave blank to use the project default.",
            }),
            defineField({
              name: "businessMetricsOverride",
              title: "Metrics override (optional)",
              type: "array",
              description: "Overrides the project's business metrics for this card. Leave blank to use the project defaults.",
              of: [
                {
                  type: "object",
                  name: "metricOverride",
                  fields: metricOverrideFields,
                  preview: { select: { title: "value", subtitle: "label" } },
                },
              ],
            }),
            defineField({
              name: "ctaLabel",
              title: "CTA Label",
              type: "string",
              description: 'Label for the "read more" link. Defaults to "Read the full case study".',
              initialValue: "Read the full case study",
            }),
          ],
          preview: {
            select: { title: "project.title", subtitle: "ctaLabel" },
            prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
              return { title: title ?? "Unselected project", subtitle, media: PresentationIcon };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      projects: "projects",
      subtitle: "heading",
      visible: "visible",
    },
    prepare({ projects, subtitle, visible }: { projects?: unknown[]; subtitle?: string; visible?: boolean }) {
      const count = Array.isArray(projects) ? projects.length : 0;
      return {
        title: `${visible === false ? "[Hidden] " : ""}Case Study Spotlight (${count} project${count !== 1 ? "s" : ""})`,
        subtitle,
        media: PresentationIcon,
      };
    },
  },
});
