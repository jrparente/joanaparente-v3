import { defineConfig, isDev } from "sanity";
import { structureTool } from "sanity/structure";

import { visionTool } from "@sanity/vision";
import schema from "./schemas";
import { structure } from "./structure";
import { apiVersion, dataset, projectId } from "./lib/env";

import { FaviconIcon } from "./FaviconIcon";
import { documentInternationalization } from "@sanity/document-internationalization";
import { i18n } from "@/i18n.config";

export const BASE_URL = isDev
  ? "http://localhost:3000"
  : process.env.NEXT_PUBLIC_BASE_URL!;

const allPlugins = [
  structureTool({
    name: "content",
    title: "Website Content",
    structure,
  }),

  documentInternationalization({
    supportedLanguages: i18n.languages,
    schemaTypes: ["homepage", "page", "site", "navigation"],
  }),
];

export default defineConfig({
  icon: FaviconIcon,
  name: "JoanaParente",
  title: "Joana Parente",
  projectId,
  dataset,
  basePath: "/admin",

  plugins: isDev
    ? [...allPlugins, visionTool({ defaultApiVersion: apiVersion })]
    : allPlugins,

  tasks: { enabled: false },
  scheduledPublishing: { enabled: false },

  schema,
});
