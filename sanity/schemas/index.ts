import { SchemaTypeDefinition } from "sanity";
import homepage from "./documents/homepage";
import site from "./documents/site";
import page from "./documents/page";
import link from "./objects/link";
import metadata from "./objects/metadata";
import navigation from "./documents/navigation";
import blogPost from "./documents/blogPost";
import { blogPostList } from "./modules/blogPostList";
import { richText } from "./modules/richText";
import { imageGallery } from "./modules/imageGallery";
import footer from "./documents/footer";
import { cta } from "./modules/cta";
import { hero } from "./modules/hero";
import { contentBlocks } from "./modules/contentBlocks";
import { intro } from "./modules/intro";
import project from "./documents/project";
import logoList from "./modules/logoList";
import logo from "./documents/logo";
import bioPage from "./modules/bioPage";
import { projectList } from "./modules/projectList";
import { contactSection } from "./modules/contactSection";
import { processSteps } from "./modules/processSteps";
import { heroHome } from "./modules/heroHome";
import { serviceTierPreview } from "./modules/serviceTierPreview";
import { serviceTiers } from "./modules/serviceTiers";
import { testimonials } from "./modules/testimonials";
import { faqAccordion } from "./modules/faqAccordion";
import { metricBar } from "./modules/metricBar";
import { caseStudySpotlight } from "./modules/caseStudySpotlight";
import { contactForm } from "./modules/contactForm";

const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    logo,
    homepage,
    page,
    blogPost,
    site,
    navigation,
    footer,
    project,
    bioPage,

    // Modules
    contentBlocks,
    blogPostList,
    richText,
    imageGallery,
    cta,
    hero,
    intro,
    logoList,
    projectList,
    contactSection,
    processSteps,
    heroHome,
    serviceTierPreview,
    serviceTiers,
    testimonials,
    faqAccordion,
    metricBar,
    caseStudySpotlight,
    contactForm,

    // objects
    link,
    metadata,
  ],
};

export default schema;
