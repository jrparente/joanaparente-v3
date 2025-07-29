import Hero from "./modules/Hero";

type Props = {
  contentBlock: any[];
};

const ContentBlocks = ({ contentBlock }: Props) => {
  return (
    <>
      {contentBlock.map((block, index) => {
        switch (block._type) {
          case "hero":
            return <Hero key={index} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
};

export default ContentBlocks;
