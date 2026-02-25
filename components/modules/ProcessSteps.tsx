import {
  MessageSquare,
  FileSearch,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import { ProcessStepsBlock } from "@/types/Sanity";

const iconMap: Record<string, LucideIcon> = {
  MessageSquare,
  FileSearch,
  Handshake,
};

type Props = {
  block: ProcessStepsBlock;
};

const ProcessSteps = ({ block }: Props) => {
  const { heading, steps } = block;

  if (!steps || steps.length === 0) return null;

  return (
    <section className="w-full">
      <div className="max-w-2xl mx-auto px-4">
        <hr className="my-12 border-border" />

        {heading && (
          <h2 className="text-2xl font-bold tracking-tight">{heading}</h2>
        )}

        <ol className="mt-8 space-y-8">
          {steps.map((step, i) => {
            const Icon = step.icon ? iconMap[step.icon] : undefined;

            return (
              <li key={i} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand-dark)]">
                  {Icon ? (
                    <Icon className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{i + 1}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="mt-1 text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default ProcessSteps;
