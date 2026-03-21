import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "./Logo";
import { NavigationType } from "@/types/Sanity";
import { resolveLink } from "@/lib/utils";

type Props = {
  navigation: NavigationType;
  language: string;
};

export const Header = ({ navigation, language }: Props) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md focus:ring-2 focus:ring-ring"
      >
        Skip to content
      </a>
      <div className="relative max-w-screen-xl mx-auto flex items-center justify-between px-4 py-4 md:px-6">
        {/* Logo */}
        <Logo language={language} />

        {/* Right-side actions */}
        <div className="flex items-center gap-4">
          <nav
            aria-label="Main navigation"
            className="hidden md:flex gap-4 text-sm"
          >
            {navigation?.items?.map((item) => {
              const href = resolveLink(item, language);

              return (
                <Link
                  key={item.label}
                  href={href}
                  className="hover:text-muted-foreground font-medium font-sans py-2 pl-3 pr-4 uppercase text-sm tracking-wide motion-safe:transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {/* Theme toggle */}
          <ThemeToggle />
          {/* Mobile menu */}
          <MobileMenu items={navigation?.items || []} language={language} />
        </div>
      </div>
    </header>
  );
};
