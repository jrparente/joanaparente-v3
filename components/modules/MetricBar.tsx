import { MetricBarBlock } from "@/types/Sanity";

type Props = {
  block: MetricBarBlock;
};

const MetricBar = ({ block }: Props) => {
  const { items } = block;

  if (!items?.length) return null;

  return (
    <section className="relative z-[1] w-full border-t border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-evenly">
          {items.map((item, i) => (
            <div
              key={i}
              className={`px-6 py-8 text-center ${
                i < items.length - 1
                  ? "border-b border-[var(--color-border)] md:border-b-0 md:border-r"
                  : ""
              }`}
            >
              <p
                className="font-heading text-2xl font-semibold text-[var(--color-text)] md:text-3xl"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {item.value}
              </p>
              <p className="mt-1 font-sans text-sm text-[var(--color-text-muted)]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricBar;
