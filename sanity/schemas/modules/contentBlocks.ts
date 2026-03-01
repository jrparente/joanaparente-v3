import { defineType } from "sanity";

export const contentBlocks = defineType({
  name: "contentBlocks",
  title: "Content Blocks",
  type: "array",
  of: [
    { type: "blogPostList" },
    { type: "richText" },
    { type: "imageGallery" },
    { type: "cta" },
    { type: "hero" },
    { type: "intro" },
    { type: "bioPage" },
    { type: "projectList" },
    { type: "contactSection" },
    { type: "processSteps" },
    { type: "heroHome" },
    { type: "serviceTierPreview" },
    { type: "serviceTiers" },
    { type: "testimonials" },
    { type: "faqAccordion" },
    { type: "metricBar" },
    { type: "caseStudySpotlight" },
    { type: "contactForm" },
    { type: "connectStrip" },
  ],
});
