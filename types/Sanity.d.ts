export type SanityImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
};

export type PortableTextBlock = {
  _type: string;
  _key?: string;
  children?: any[];
  markDefs?: any[];
  style?: string;
  marks?: string[];
  [key: string]: any;
};

export type RichText = {
  content: PortableTextBlock[];
};

export type InternalLink = {
  _type: "reference";
  _ref: string;
  _typeOf?: string;
  title?: string;
  metadata?: {
    slug: {
      current: string;
    };
  };
};

export type Link = {
  label?: string;
  type: "internal" | "external";
  internal?: InternalLink;
  external?: string;
  params?: string;
};

export type HeroBlock = {
  _type: "hero";
  _id: string;
  _key?: string;
  subheading: string;
  title: string;
  subtitle: string;
  description?: RichText;
  image?: SanityImage;
  buttonLink: Link;
};

// Extend this union as you add new block types
export type ContentBlock = HeroBlock;

export type Homepage = {
  _id: string;
  _type: "homepage";
  title: string;
  language: string;
  contentBlocks: ContentBlock[];
};

export type FooterType = {
  _id: string;
  _type: "footer";
  message: string;
  email: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
};

export type MetadataType = {
  title: string;
  metaDescription: string;
  keywords?: string[];
  defaultOgImage?: { asset: { url: string } } | null;
  defaultTwitterImage?: { asset: { url: string } } | null;
  noIndex?: boolean;
};

export type SiteSettingsType = {
  title: string;
  domain: string;
  logo: SanityImage;
  metadata: MetadataType;
};
