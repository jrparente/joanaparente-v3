import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { LinkType, NavigationType } from "@/types/Sanity";
import { resolveLink } from "@/lib/utils";

type Props = {
  navigation: NavigationType;
  language: string;
};

export const Header = ({ navigation, language }: Props) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative max-w-screen-xl mx-auto flex items-center justify-between px-4 py-4 md:px-6">
        {/* Logo or Site Name */}
        <Link
          href={`/${language}`}
          className="text-2xl font-heading tracking-tighter hover:opacity-80 transition flex items-center uppercase"
          aria-label="Link to home page"
        >
          <span className="font-light">J</span>
          <span className="font-semibold">P</span>
        </Link>

        {/* Right-side actions */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-4 text-sm">
            {navigation?.items?.map((item) => {
              const href = resolveLink(item as LinkType, language);

              return (
                <Link
                  key={item.label}
                  href={href}
                  className="hover:text-muted-foreground font-medium font-sans py-2 pl-3 pr-4 uppercase text-sm tracking-wide"
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
