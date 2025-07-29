// components/portabletext/RichText.tsx
import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

export const RichText = ({ value }: { value: any }) => {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children, value }) => {
        const align = value?.markDefs?.find((def: any) =>
          ["left", "center", "right"].includes(def?.value)
        );

        const alignment = value?.style || "normal";
        const textAlignClass =
          {
            left: "text-left",
            center: "text-center",
            right: "text-right",
          }[alignment] || "";

        return (
          <p className={`mt-4 text-muted-foreground ${textAlignClass}`}>
            {children}
          </p>
        );
      },
      h2: ({ children }) => (
        <h2 className="mt-6 text-xl font-semibold">{children}</h2>
      ),
    },
    marks: {
      link: ({ value, children }) => {
        const href = value?.href || "#";
        const isExternal = href.startsWith("http");
        return isExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-primary"
          >
            {children}
          </a>
        ) : (
          <Link href={href} className="underline text-primary">
            {children}
          </Link>
        );
      },
      code: ({ children }) => (
        <code className="bg-muted px-1 py-0.5 text-sm font-mono rounded">
          {children}
        </code>
      ),
      underline: ({ children }) => (
        <span className="underline">{children}</span>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc pl-6">{children}</ul>,
    },
    types: {
      image: ({ value }) => {
        const imageUrl = value?.asset?.url;
        const alt = value?.alt || "";
        if (!imageUrl) return null;

        return (
          <div className="my-6">
            <Image
              src={imageUrl}
              alt={alt}
              width={800}
              height={500}
              className="rounded-md object-cover"
            />
          </div>
        );
      },
    },
  };

  return <PortableText value={value} components={components} />;
};
