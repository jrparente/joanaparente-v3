import { defaultLanguage } from "@/i18n.config";
import Hero from "./modules/Hero";
import Intro from "./modules/Intro";
import BioPage from "./modules/BioPage";
import Cta from "./modules/Cta";
import RichTextBlock from "./modules/RichTextBlock";
import ProjectList from "./modules/ProjectList";
import ContactSection from "./modules/ContactSection";
import ProcessSteps from "./modules/ProcessSteps";
import HeroHome from "./modules/HeroHome";
import MetricBar from "./modules/MetricBar";
import ServiceTierPreview from "./modules/ServiceTierPreview";
import ServiceTiers from "./modules/ServiceTiers";
import FaqAccordion from "./modules/FaqAccordion";
import Testimonials from "./modules/Testimonials";
import ConnectStrip from "./modules/ConnectStrip";

type Props = {
  contentBlock: any[];
  language?: string | null;
};

const ContentBlocks = ({ contentBlock, language }: Props) => {
  return (
    <>
      {contentBlock.map((block, index) => {
        switch (block._type) {
          case "heroHome":
            return (
              <HeroHome
                key={index}
                block={block}
                language={language ?? (defaultLanguage?.id || undefined)}
              />
            );
          case "hero":
            return (
              <Hero
                key={index}
                block={block}
                language={language ?? (defaultLanguage?.id || undefined)}
              />
            );
          case "intro":
            return (
              <Intro
                key={index}
                block={block}
                language={language ?? (defaultLanguage?.id || undefined)}
              />
            );
          case "cta":
            return (
              <Cta
                key={index}
                block={block}
                language={language ?? (defaultLanguage?.id || undefined)}
              />
            );
          case "richText":
            return <RichTextBlock key={index} block={block} />;
          case "projectList":
            return (
              <ProjectList
                key={index}
                block={block}
                language={language ?? (defaultLanguage?.id || undefined)}
              />
            );
          case "contactSection":
            return (
              <ContactSection
                key={index}
                block={block}
                language={language ?? (defaultLanguage?.id || undefined)}
              />
            );
          case "serviceTierPreview":
            return (
              <ServiceTierPreview
                key={index}
                block={block}
                language={language ?? (defaultLanguage?.id || undefined)}
              />
            );
          case "metricBar":
            return <MetricBar key={index} block={block} />;
          case "processSteps":
            return <ProcessSteps key={index} block={block} />;
          case "serviceTiers":
            return (
              <ServiceTiers
                key={index}
                block={block}
                language={language ?? (defaultLanguage?.id || undefined)}
              />
            );
          case "faqAccordion":
            return <FaqAccordion key={index} block={block} />;
          case "testimonials":
            return (
              <Testimonials
                key={index}
                block={block}
                language={language ?? (defaultLanguage?.id || undefined)}
              />
            );
          case "connectStrip":
            return <ConnectStrip key={index} block={block} />;
          case "bioPage":
            return <BioPage key={index} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
};

export default ContentBlocks;
