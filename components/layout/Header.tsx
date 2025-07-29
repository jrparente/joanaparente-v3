import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { LinkType, NavigationType } from "@/types/Sanity";
import { resolveLink } from "@/lib/utils";
import { stegaClean } from "next-sanity";

type Props = {
  navigation: NavigationType;
  language: string;
};

export const Header = ({ navigation, language }: Props) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-4 md:px-6">
        {/* Logo or Site Name */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight hover:opacity-80 transition flex items-center uppercase"
          aria-label="Link to home page"
        >
          <span className="font-light">Joana</span>
          <span>Parente</span>
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
                  className="hover:text-muted-foreground font-medium font-mono py-2 pl-3 pr-4 uppercase text-lg"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
