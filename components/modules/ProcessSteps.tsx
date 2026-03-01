import { ProcessStepsBlock } from "@/types/Sanity";

type Props = {
  block: ProcessStepsBlock;
};

const ProcessSteps = ({ block }: Props) => {
  const { eyebrow, heading, steps } = block;

  if (!steps || steps.length === 0) return null;

  return (
    <section className="relative z-[1] w-full py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-8">
        {eyebrow && (
          <div className="section-eyebrow mb-4">{eyebrow}</div>
        )}

        {heading && (
          <h2 className="mb-12 text-[var(--color-text)]">{heading}</h2>
        )}

        {/* Grid with connecting line */}
        <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Connecting line — desktop only */}
          <div
            className="pointer-events-none absolute left-[calc(2rem+2px)] right-[calc(2rem+2px)] top-8 hidden h-0.5 lg:block"
            style={{
              background:
                "linear-gradient(to right, var(--color-brand-light), var(--color-brand-light))",
            }}
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <div
              key={i}
              className="group flex flex-col items-center text-center"
            >
              {/* Numbered circle */}
              <div className="relative z-[1] flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--color-brand-light)] bg-[var(--color-surface-elevated)] transition-all duration-200 group-hover:border-[var(--color-brand)] group-hover:bg-[var(--color-brand-light)]">
                <span className="font-heading text-xl text-[var(--color-brand)]">
                  {i + 1}
                </span>
              </div>

              {/* Step title */}
              <h3 className="mt-5 font-heading text-lg font-semibold text-[var(--color-text)]">
                {step.title}
              </h3>

              {/* Step description */}
              {step.description && (
                <p className="mt-2 max-w-[240px] font-sans text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {step.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
