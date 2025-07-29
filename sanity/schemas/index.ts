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

const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    homepage,
    page,
    blogPost,
    site,
    navigation,
    footer,

    // Modules
    contentBlocks,
    blogPostList,
    richText,
    imageGallery,
    cta,
    hero,
    intro,

    // objects
    link,
    metadata,
  ],
};

export default schema;
