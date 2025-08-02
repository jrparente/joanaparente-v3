import { defaultLanguage } from "@/i18n.config";
import Hero from "./modules/Hero";
import Intro from "./modules/Intro";
import BioPage from "./modules/BioPage";

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
