import ContentBlocks from "@/components/ContentBlocks";
import { getPageBySlug } from "@/lib/sanity/queries";
import React from "react";

export async function generateMetadata() {
  const page = await getPageBySlug({ slug: "bio" });
  if (!page) {
    return {};
  }

  return {
    title: page.metadata.title,
    description: page.metadata.metaDescription,
    alternates: {
      canonical: "https://www.joanaparente.com/bio",
    },
  };
}

async function BioPage() {
  const page = await getPageBySlug({ slug: "bio" });

  if (!page) {
    return <div>Page not found</div>;
  }

  return <ContentBlocks contentBlock={page.contentBlocks} language={null} />;
}

export default BioPage;
