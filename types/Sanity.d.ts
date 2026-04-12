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
  slug?: string;
};

export type LinkType = {
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
  visible?: boolean;
  subheading: string;
  title: string;
  subtitle: string;
  description?: RichText;
  image?: SanityImage;
  buttonLink: LinkType;
};

export type IntroBlock = {
  _type: "intro";
  _id: string;
  _key?: string;
  visible?: boolean;
  heading?: string;
  anchor: string;
  subheading?: string;
  content: { content: PortableTextBlock[] };
  image?: SanityImage;
  byline?: string;
};

export type CtaBlock = {
  _type: "cta";
  _key?: string;
  visible?: boolean;
  title: string;
  description: string;
  buttonLink: LinkType;
  buttonLink2?: LinkType;
};

export type RichTextBlockType = {
  _type: "richText";
  _key?: string;
  visible?: boolean;
  eyebrow?: string;
  heading?: string;
  variant?: "default" | "elevated";
  content: PortableTextBlock[];
};

export type ProjectListBlock = {
  _type: "projectList";
  _key?: string;
  visible?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  headingLevel?: "h1" | "h2";
  maxProjects?: number;
  showViewAll?: boolean;
  viewAllLabel?: string;
  readMoreLabel?: string;
  emptyStateText?: string;
};

export type ContactSectionBlock = {
  _type: "contactSection";
  _key?: string;
  visible?: boolean;
  eyebrow?: string;
  heading: string;
  intro?: string;
  emailLabel?: string;
  linkedinLabel?: string;
  location?: string;
  microcopy?: string;
  backLabel?: string;
};

export type ProcessStepsBlock = {
  _type: "processSteps";
  _key?: string;
  visible?: boolean;
  eyebrow?: string;
  heading: string;
  steps?: {
    icon?: string;
    title: string;
    description?: string;
  }[];
};

export type HeroHomeBlock = {
  _type: "heroHome";
  _key?: string;
  visible?: boolean;
  eyebrow?: string;
  heading: string;
  subheading: string;
  description?: PortableTextBlock[];
  ctaPrimary: LinkType;
  ctaSecondary?: LinkType;
  proofStrip?: Array<{ value: string; label: string }>;
};

export type ServiceTierPreviewBlock = {
  _type: "serviceTierPreview";
  _key?: string;
  visible?: boolean;
  eyebrow?: string;
  heading: string;
  tiers: {
    name: string;
    tagline?: string;
    startingPrice: string;
    highlights?: string[];
    highlighted?: boolean;
  }[];
  ctaLink: LinkType;
};

export type ServiceTiersBlock = {
  _type: "serviceTiers";
  _key?: string;
  visible?: boolean;
  eyebrow?: string;
  heading: string;
  footnote?: string;
  tiers: {
    name: string;
    subtitle?: string;
    priceRange: string;
    features?: string[];
    highlighted?: boolean;
    timeline?: string;
    badgeLabel?: string;
    proofLabel?: string;
    proofLink?: { label: string; href: string };
    ctaLabel: string;
    ctaLink: LinkType;
  }[];
};

export type TestimonialsBlock = {
  _type: "testimonials";
  _key?: string;
  visible?: boolean;
  eyebrow?: string;
  heading?: string;
  items: {
    quote: string;
    authorName: string;
    authorRole?: string;
    authorCompany?: string;
    authorImage?: {
      asset: { _id: string; url: string; metadata?: { lqip?: string } };
      alt?: string;
    };
  }[];
};

export type FaqAccordionBlock = {
  _type: "faqAccordion";
  _key?: string;
  visible?: boolean;
  eyebrow?: string;
  heading: string;
  items: {
    question: string;
    answer: PortableTextBlock[];
  }[];
  generateJsonLd?: boolean;
};

export type ConnectStripBlock = {
  _type: "connectStrip";
  _key?: string;
  visible?: boolean;
  label: string;
  links: {
    label: string;
    url: string;
  }[];
};

export type MetricBarBlock = {
  _type: "metricBar";
  _key?: string;
  visible?: boolean;
  items: {
    value: string;
    label: string;
    source?: string;
  }[];
};

export type CaseStudySpotlightBlock = {
  _type: "caseStudySpotlight";
  _key?: string;
  visible?: boolean;
  heading?: string;
  project: {
    title: string;
    slug: string;
    transformationStatement?: string;
    businessMetrics?: {
      label: string;
      value: string;
      context?: string;
    }[];
    image?: {
      asset: { _id: string; url: string; metadata?: { lqip?: string } };
      alt?: string;
    };
  };
  highlightMetrics?: boolean;
  ctaLabel?: string;
};

export type ContactFormBlock = {
  _type: "contactForm";
  _key?: string;
  visible?: boolean;
  heading: string;
  subheading?: string;
  submitLabel: string;
  successMessage: PortableTextBlock[];
  nameFieldLabel?: string;
  emailFieldLabel?: string;
  companyFieldLabel?: string;
  projectTypeFieldLabel?: string;
  projectTypeOptions?: string[];
  budgetRangeFieldLabel?: string;
  budgetRangeOptions?: string[];
  timelineFieldLabel?: string;
  timelineOptions?: string[];
  messageFieldLabel?: string;
  messageFieldPlaceholder?: string;
  languagePreferenceLabel?: string;
  selectPlaceholder?: string;
  submittingLabel?: string;
  consentText?: string;
  privacyPolicyLink?: LinkType;
  validationMessages?: {
    required?: string;
    minLength?: string;
    invalidEmail?: string;
    submitError?: string;
    consentRequired?: string;
  };
};

export type LogoType = {
  _id: string;
  name: string;
  image: {
    default: SanityImage;
    light?: SanityImage;
    dark?: SanityImage;
  };
};

export type BusinessMetric = {
  label: string;
  value: string;
  context?: string;
};

export type ProductBridge = {
  productName?: string;
  productUrl?: string;
  productPrice?: string;
  productTeaser?: string;
};

export type ProjectCardType = {
  _id: string;
  title: string;
  slug: { current: string };
  tagline: string;
  subtitle: string;
  image: SanityImage;
  projectCategory: "client" | "personal";
  projectType: "website" | "webapp" | "e-commerce";
  clientIndustry?: string;
  techStack?: {
    title: string;
    logos: LogoType[];
  };
  businessMetrics?: Array<{
    label: string;
    value: string;
    context?: string;
  }>;
};

export type ProjectType = {
  _id: string;
  _type: "project";
  title: string;
  slug: { current: string };
  tagline: string;
  subtitle: string;
  clientIndustry?: string;
  businessMetrics?: BusinessMetric[];
  transformationStatement?: string;
  liveUrl?: string;
  date?: string;
  image: SanityImage;
  featuredScreenshot?: SanityImage & { caption?: string };
  projectCategory: "client" | "personal";
  projectType: "website" | "webapp" | "e-commerce";
  techStack?: {
    title: string;
    logos: LogoType[];
  };
  eyebrowLabel?: string;
  backLabel?: string;
  caseStudyBlocks?: ContentBlock[];
  seo?: MetadataType;
  language?: string;
  _translations?: Array<{ slug: string; language: string }>;
};

export type CaseStudyTakeawayBlock = {
  _type: "caseStudyTakeaway";
  _key?: string;
  visible?: boolean;
  eyebrow?: string;
  heading?: string;
  content: PortableTextBlock[];
};

export type CaseStudyTransformationBlock = {
  _type: "caseStudyTransformation";
  _key?: string;
  visible?: boolean;
  text: string;
};

export type CaseStudyScreenshotBlock = {
  _type: "caseStudyScreenshot";
  _key?: string;
  visible?: boolean;
  image: SanityImage;
  liveUrl?: string;
  frameStyle?: "browser" | "phone" | "none";
  caption?: string;
};

export type TechStackBlockType = {
  _type: "techStackBlock";
  _key?: string;
  visible?: boolean;
  eyebrow?: string;
  heading?: string;
  techStack?: {
    title: string;
    logos: LogoType[];
  };
};

export type RelatedProjectsBlockType = {
  _type: "relatedProjectsBlock";
  _key?: string;
  visible?: boolean;
  eyebrow?: string;
  heading?: string;
  projects?: {
    _id: string;
    title: string;
    slug: string;
    tagline: string;
    subtitle: string;
    image?: SanityImage;
    projectCategory: "client" | "personal";
    clientIndustry?: string;
    language?: string;
  }[];
  ctaLabel?: string;
};

// Extend this union as you add new block types
export type ContentBlock =
  | HeroBlock
  | IntroBlock
  | CtaBlock
  | RichTextBlockType
  | ProjectListBlock
  | ContactSectionBlock
  | ProcessStepsBlock
  | HeroHomeBlock
  | ServiceTierPreviewBlock
  | ServiceTiersBlock
  | TestimonialsBlock
  | FaqAccordionBlock
  | MetricBarBlock
  | CaseStudySpotlightBlock
  | ContactFormBlock
  | ConnectStripBlock
  | CaseStudyTakeawayBlock
  | CaseStudyTransformationBlock
  | CaseStudyScreenshotBlock
  | TechStackBlockType
  | RelatedProjectsBlockType;

export type Homepage = {
  _id: string;
  _type: "homepage";
  title: string;
  language: string;
  contentBlocks: ContentBlock[];
  _translations?: Array<{ slug: string; language: string }>;
};

export type FooterType = {
  _id: string;
  _type: "footer";
  showLogo?: boolean;
  brandText?: string;
  location?: string;
  email?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
  navLinks?: LinkType[];
  legalLinks?: LinkType[];
  copyrightText?: string;
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

export type NavigationType = {
  _id: string;
  _type: "navigation";
  items: LinkType[];
  ctaLabel?: string;
  ctaLink?: LinkType;
};

export type PageType = {
  _id: string;
  _type: "page";
  title: string;
  slug: { current: string };
  metadata: MetadataType;
  contentBlocks: ContentBlock[];
  _translations?: Array<{ slug: string; language: string }>;
};

export type BioPageProps = {
  profileImage?: SanityImage;
  name: string;
  bio?: string;
  links?: {
    label: string;
    url: string;
    icon?: string; // e.g., 'github', 'linkedin'
  }[];
  backgroundColor?: string; // Hex color, e.g., '#fefaf7'
  textColor?: string; // Hex color, e.g., '#1a1a1a'
};
