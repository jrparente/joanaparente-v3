import { PresentationIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: PresentationIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The title of the page, displayed as an H1.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (slug, context) => {
          const { document, getClient } = context;
          if (!document) return true;
          const client = getClient({ apiVersion: "2024-01-01" });
          const id = document._id.replace(/^drafts\./, "");
          return client.fetch(
            `!defined(*[
              !(_id in [$draft, $published]) &&
              _type == "page" &&
              slug.current == $slug &&
              language == $language
            ][0]._id)`,
            {
              draft: `drafts.${id}`,
              published: id,
              slug,
              language: document.language,
            }
          );
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "metadata",
      title: "Metadata",
      type: "metadata",
      description: "SEO metadata for search engines and social sharing.",
    }),
    defineField({
      name: "contentBlocks",
      title: "Content Blocks",
      type: "contentBlocks",
      description: "Add various content blocks to structure your page.",
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      readOnly: true,
    }),
  ],
});
