import { defineType } from "sanity";

export const caseStudyBlocks = defineType({
  name: "caseStudyBlocks",
  title: "Case Study Blocks",
  type: "array",
  of: [
    // Reused existing modules
    { type: "richText" },
    { type: "metricBar" },
    { type: "testimonials" },
    { type: "cta" },
    // Case-study-specific modules
    { type: "caseStudyTakeaway" },
    { type: "caseStudyTransformation" },
    { type: "caseStudyScreenshot" },
    { type: "techStackBlock" },
    { type: "relatedProjectsBlock" },
  ],
});
