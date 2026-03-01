import { defineField } from "sanity";

export const visibleField = defineField({
  name: "visible",
  title: "Visible on site",
  type: "boolean",
  description:
    "Uncheck to hide this section from the live website without deleting it.",
  initialValue: true,
  validation: (rule) => rule.required(),
});
