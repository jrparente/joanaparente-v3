import type { TechStackBlockType } from "@/types/Sanity";

export default function TechStackBlock({ block }: { block: TechStackBlockType }) {
  if (!block.techStack?.logos || block.techStack.logos.length === 0) return null;

  return (
    <section
      className="relative z-[1] border-t border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-12 md:py-16"
      aria-labelledby={block.heading ? "tech-heading" : undefined}
    >
      <div className="mx-auto max-w-[680px] px-8">
        {(block.eyebrow || block.heading) && (
          <div className="mb-8">
            {block.eyebrow && <p className="section-eyebrow">{block.eyebrow}</p>}
            {block.heading && (
              <h2 className="section-heading" id="tech-heading">{block.heading}</h2>
            )}
          </div>
        )}
        <ul className="flex flex-wrap gap-3">
          {block.techStack.logos.map((logo) => (
            <li
              key={logo._id}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2 font-sans text-[length:var(--text-sm)] font-medium text-[var(--color-text)]"
            >
              {logo.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
