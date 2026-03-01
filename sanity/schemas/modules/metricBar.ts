import { BarChartIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export const metricBar = defineType({
  name: "metricBar",
  title: "Metric Bar",
  icon: BarChartIcon,
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "items",
      title: "Metrics",
      type: "array",
      of: [
        {
          type: "object",
          name: "metric",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description:
                'e.g. "6 years" or "20+" or "€0 → €120k"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description:
                'e.g. "at Booking.com" or "projects delivered"',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
      validation: (rule) => rule.required().min(2).max(4),
    }),
  ],
  preview: {
    select: { items: "items", visible: "visible" },
    prepare({ items, visible }) {
      const preview = (items ?? [])
        .map((i: { value: string }) => i.value)
        .join(" · ");
      return {
        title: `${visible === false ? "[Hidden] " : ""}Metrics: ${preview}`,
        media: BarChartIcon,
      };
    },
  },
});
