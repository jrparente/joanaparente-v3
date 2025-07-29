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

    // Modules
    contentBlocks,
    blogPostList,
    richText,
    imageGallery,
    cta,
    hero,
    intro,
    logoList,

    // objects
    link,
    metadata,
  ],
};

export default schema;
