import { headers } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const copy = {
  en: {
    headline: "This page doesn't exist.",
    subtext:
      "You may have followed a broken link or mistyped the address. Here's where to go instead.",
    primary: "Back to home",
    secondary: "View my work",
  },
  pt: {
    headline: "Esta página não existe.",
    subtext:
      "Pode ter seguido um link antigo ou introduzido o endereço errado. Volta ao início ou explora o meu trabalho.",
    primary: "Voltar ao início",
    secondary: "Ver o meu trabalho",
  },
} as const;

export default async function NotFound() {
  const headersList = await headers();
  const lang = headersList.get("x-language") === "en" ? "en" : "pt";
  const t = copy[lang];

  return (
    <main className="flex min-h-[60vh] items-center px-4 py-24 md:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="relative">
          {/* Ghost 404 — decorative, sits behind headline */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-1 -top-3 z-0 select-none font-heading text-[9rem] font-extrabold leading-none tracking-tighter text-[var(--color-brand-light)] opacity-[0.55] md:text-[11rem]"
          >
            404
          </span>
          {/* Content overlaps ghost number via z-index */}
          <div className="relative z-10 pt-14 md:pt-16">
            <h1 className="mb-4 font-heading text-3xl font-semibold leading-snug text-[var(--color-text)] md:text-4xl">
              {t.headline}
            </h1>
            <p className="mb-8 max-w-[480px] text-base leading-relaxed text-[var(--color-text-muted)]">
              {t.subtext}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/${lang}`}
                className="inline-flex items-center gap-2 rounded-md bg-[var(--color-brand)] px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-[var(--color-brand-dark)] hover:-translate-y-px dark:text-[var(--color-surface)]"
              >
                {t.primary}
              </Link>
              <Link
                href={`/${lang}/projects`}
                className="text-base text-[var(--color-text-muted)] underline underline-offset-4 transition-colors hover:text-[var(--color-text)]"
              >
                {t.secondary} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
