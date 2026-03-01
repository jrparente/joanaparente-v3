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
      blockquote: ({ children }) => (
        <blockquote className="my-12 border-l-4 border-[var(--color-brand)] py-6 pl-7">
          <p className="font-heading text-2xl italic font-normal leading-snug text-[var(--color-brand)]">
            {children}
          </p>
        </blockquote>
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
      highlight: ({ children }) => (
        <mark className="rounded-sm bg-[var(--color-brand-light)] px-1.5 py-0.5 font-inherit text-inherit">
          {children}
        </mark>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc pl-6 text-muted-foreground">{children}</ul>
      ),
    },
    types: {
      break: () => (
        <div className="my-12 flex items-center justify-center">
          <div className="h-0.5 w-10 rounded-[1px] bg-[var(--color-brand)]" />
        </div>
      ),
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
