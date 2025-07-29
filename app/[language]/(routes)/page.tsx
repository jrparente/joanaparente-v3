import ContentBlocks from "@/components/ContentBlocks";
import { RichText } from "@/components/portabletext/RichText";
import { getHomepage } from "@/lib/sanity/queries";
import { notFound } from "next/navigation";

type Props = {
  params: {
    language: string;
  };
};

export default async function Home({ params }: Props) {
  const { language } = await params;

  if (!language) return notFound();

  const page = await getHomepage({ language });

  if (!page || !page.contentBlocks) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 text-center">
        <p className="text-muted-foreground text-lg">
          This portfolio is still under construction. Please check back soon.
        </p>
      </main>
    );
  }

  const hasBlocks = page.contentBlocks.length > 0;

  return (
    <main className="flex flex-col items-center justify-start px-4 pb-16 pt-8 md:pt-12">
      <div className="w-full max-w-7xl">
        {hasBlocks ? (
          <ContentBlocks contentBlock={page.contentBlocks} />
        ) : (
          <div className="flex h-96 items-center justify-center rounded-md border border-dashed bg-muted">
            <p className="text-muted-foreground">No content available yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
