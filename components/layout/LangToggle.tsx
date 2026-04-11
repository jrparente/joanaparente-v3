"use client";

import { usePathname, useRouter } from "next/navigation";
import { languages } from "@/i18n.config";
import { cn } from "@/lib/utils";

type Props = {
  language: string;
};

export const LangToggle = ({ language }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    if (newLocale === language) return;
    const localePrefix = `/${language}`;
    const pathnameWithoutLocale = pathname.startsWith(localePrefix)
      ? pathname.slice(localePrefix.length)
      : "";
    router.push(`/${newLocale}${pathnameWithoutLocale}`);
  };

  return (
    <div className="flex items-center gap-1" aria-label="Language toggle">
      {languages.map((lang, index) => (
        <span key={lang.id} className="flex items-center gap-1">
          {index > 0 && (
            <span
              className="text-border text-[0.7rem] select-none"
              aria-hidden="true"
            >
              ·
            </span>
          )}
          <button
            onClick={() => switchLocale(lang.id)}
            aria-label={`Switch to ${lang.title}`}
            aria-pressed={language === lang.id}
            className={cn(
              "border-none bg-transparent p-0 cursor-pointer",
              "font-sans text-[0.7rem] font-semibold tracking-[0.05em] uppercase",
              "transition-colors duration-200",
              "min-h-[44px] min-w-[44px] flex items-center justify-center",
              language === lang.id
                ? "text-primary pb-[2px] border-b-[1.5px] border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {lang.id.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
};
