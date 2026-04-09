import Image from "next/image";
import type { CaseStudyScreenshotBlock } from "@/types/Sanity";
import { urlFor } from "@/lib/sanity/image";
import { stegaClean } from "@sanity/client/stega";

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Zm7.97-2.03a.75.75 0 0 1 1.06 0l3.5 3.5a.75.75 0 0 1-1.06 1.06l-2.22-2.22V12a.75.75 0 0 1-1.5 0V5.81l-2.22 2.22a.75.75 0 1 1-1.06-1.06l3.5-3.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function CaseStudyScreenshot({ block }: { block: CaseStudyScreenshotBlock }) {
  if (!block.image?.asset) return null;

  const domain = block.liveUrl ? extractDomain(block.liveUrl) : "";
  const frameStyle = stegaClean(block.frameStyle) || "browser";

  if (frameStyle === "none") {
    return (
      <figure className="relative z-[1] mx-auto max-w-[680px] px-8">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-lg">
          <Image
            src={urlFor(block.image).width(1360).height(850).url()}
            alt={block.image.alt || "Screenshot"}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 680px, 100vw"
          />
        </div>
        {block.caption && (
          <figcaption className="mt-3 text-center font-sans text-[length:var(--text-sm)] text-[var(--color-text-muted)]">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (frameStyle === "phone") {
    return (
      <figure className="relative z-[1] mx-auto my-10 max-w-[320px]">
        <div className="overflow-hidden rounded-[2rem] border-[8px] border-[var(--color-text)] bg-white shadow-lg">
          <Image
            src={urlFor(block.image).width(640).url()}
            alt={block.image.alt || "Mobile screenshot"}
            width={640}
            height={1138}
            className="block h-auto w-full"
            sizes="320px"
          />
        </div>
        {block.caption && (
          <figcaption className="mt-3 text-center font-sans text-[length:var(--text-sm)] text-[var(--color-text-muted)]">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // Browser frame (default)
  return (
    <figure className="relative z-[1] mx-auto max-w-[680px] px-8">
      <div className="overflow-hidden rounded-lg bg-[var(--color-surface)] shadow-lg">
        <div className="flex items-center gap-1.5 bg-[var(--color-surface-elevated)] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" aria-hidden="true" />
          {block.liveUrl && (
            <a
              href={block.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${domain} (opens in new tab)`}
              className="group/addr ml-2 flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--color-surface)] px-3 py-1 font-sans text-[0.7rem] font-normal tracking-[0.01em] text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-brand)]"
            >
              {domain}
              <ExternalLinkIcon className="h-2.5 w-2.5 flex-shrink-0 opacity-0 transition-all duration-200 group-hover/addr:translate-x-px group-hover/addr:-translate-y-px group-hover/addr:opacity-100" />
            </a>
          )}
        </div>
        <div className="relative aspect-[16/10]">
          <Image
            src={urlFor(block.image).width(1360).height(850).url()}
            alt={block.image.alt || "Screenshot"}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 680px, 100vw"
          />
        </div>
      </div>
      {block.caption && (
        <figcaption className="mt-3 text-center font-sans text-[length:var(--text-sm)] text-[var(--color-text-muted)]">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
