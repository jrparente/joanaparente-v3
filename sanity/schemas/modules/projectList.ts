import { BlockElementIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { visibleField } from "../fragments/visibleField";

export const projectList = defineType({
  name: "projectList",
  title: "Project List",
  icon: BlockElementIcon,
  type: "object",
  fields: [
    visibleField,
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: 'Section eyebrow label. e.g. "Portfolio" / "Portfólio"',
    }),
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      description: "Optional heading above the project grid",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Intro paragraph below the heading",
    }),
    defineField({
      name: "headingLevel",
      title: "Heading Level",
      type: "string",
      options: {
        list: [
          { title: "H1", value: "h1" },
          { title: "H2", value: "h2" },
        ],
      },
      initialValue: "h2",
    }),
    defineField({
      name: "maxProjects",
      title: "Maximum Projects",
      type: "number",
      description: "Limit the number of projects to display (leave empty for all)",
    }),
    defineField({
      name: "showViewAll",
      title: "Show View All Link",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "viewAllLabel",
      title: "View All Label",
      type: "string",
      description: "Text for the 'View all projects' link",
    }),
    defineField({
      name: "emptyStateText",
      title: "Empty State Text",
      type: "string",
      description: "Message shown when there are no projects",
    }),
  ],
  preview: {
    select: {
      title: "title",
      visible: "visible",
    },
    prepare({ title, visible }) {
      return {
        title: `${visible === false ? "[Hidden] " : ""}${title || "Project List"}`,
        subtitle: "Displays projects in a grid",
      };
    },
  },
});
