"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Hardcoded intentionally: error boundaries cannot fetch from the CMS.
// Framework chrome exception applies (see .claude/rules/cms-first.md).
const copy = {
  en: {
    headline: "Something went wrong.",
    subtext: "Try refreshing the page. It usually sorts itself.",
    primary: "Try again",
    secondary: "Back to home →",
  },
  pt: {
    headline: "Algo correu mal.",
    subtext: "Tenta recarregar a página. Normalmente resolve-se.",
    primary: "Tentar novamente",
    secondary: "Voltar ao início →",
  },
} as const;

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // digest correlates this client error to the matching server log entry
    console.error(error);
  }, [error]);
  const pathname = usePathname();
  const lang = pathname?.split("/")[1] === "en" ? "en" : "pt";
  const t = copy[lang];

  return (
    <main className="flex min-h-[60vh] items-center px-4 py-24 md:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <h1 className="mb-4 font-heading text-3xl font-semibold leading-snug text-[var(--color-text)] md:text-4xl">
          {t.headline}
        </h1>
        <p className="mb-8 max-w-[480px] text-base leading-relaxed text-[var(--color-text-muted)]">
          {t.subtext}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--color-brand)] px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-[var(--color-brand-dark)] hover:-translate-y-px dark:text-[var(--color-surface)]"
          >
            {t.primary}
          </button>
          <Link
            href={`/${lang}`}
            className="text-base text-[var(--color-text-muted)] underline underline-offset-4 transition-colors hover:text-[var(--color-text)]"
          >
            {t.secondary}
          </Link>
        </div>
      </div>
    </main>
  );
}
