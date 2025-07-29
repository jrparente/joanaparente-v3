import { MoreHorizontal } from "lucide-react";
import { defineField, defineType } from "sanity";

const separator = defineType({
  name: "separator",
  title: "Separator",
  type: "object",
  icon: MoreHorizontal,

  fields: [
    defineField({
      name: "type",
      type: "string",
      options: {
        list: ["line", "space", "dots"],
      },
      validation: (rule: any) => rule.required(),
    }),
  ],
});

export default separator;
