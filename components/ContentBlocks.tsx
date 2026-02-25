import { defaultLanguage } from "@/i18n.config";
import Hero from "./modules/Hero";
import Intro from "./modules/Intro";
import BioPage from "./modules/BioPage";
import Cta from "./modules/Cta";
import RichTextBlock from "./modules/RichTextBlock";
import ProjectList from "./modules/ProjectList";
import ContactSection from "./modules/ContactSection";
import ProcessSteps from "./modules/ProcessSteps";

type Props = {
  contentBlock: any[];
  language?: string | null;
};

const ContentBlocks = ({ contentBlock, language }: Props) => {
  return (
    <>
      {contentBlock.map((block, index) => {
        switch (block._type) {
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
          case "processSteps":
            return <ProcessSteps key={index} block={block} />;
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
