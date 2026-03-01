import { ConnectStripBlock } from "@/types/Sanity";

type Props = {
  block: ConnectStripBlock;
};

const ConnectStrip = ({ block }: Props) => {
  const { label, links } = block;

  return (
    <section className="relative z-[1] w-full py-12 md:py-16">
      <div className="mx-auto max-w-[680px] px-4 text-center">
        {label && (
          <p className="mb-5 text-base font-medium text-[var(--color-text-muted)]">
            {label}
          </p>
        )}

        {links && links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-10">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-base font-semibold text-[var(--color-brand)] transition-colors hover:text-[var(--color-brand-dark)]"
              >
                {link.label}{" "}
                <span
                  className="inline-block text-[var(--color-text-muted)] transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  &rarr;
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ConnectStrip;
