import Hero from "./modules/Hero";
import Intro from "./modules/Intro";

type Props = {
  contentBlock: any[];
  language?: string;
};

const ContentBlocks = ({ contentBlock, language }: Props) => {
  return (
    <>
      {contentBlock.map((block, index) => {
        switch (block._type) {
          case "hero":
            return <Hero key={index} block={block} language={language} />;
          case "intro":
            return <Intro key={index} block={block} language={language} />;
          default:
            return null;
        }
      })}
    </>
  );
};

export default ContentBlocks;
