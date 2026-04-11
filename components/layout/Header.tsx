"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavigationType } from "@/types/Sanity";
import { resolveLink, cn } from "@/lib/utils";
import { LogoWordmark } from "./LogoWordmark";
import { LangToggle } from "./LangToggle";
import { MobileMenu } from "./MobileMenu";

type Props = {
  navigation: NavigationType;
  language: string;
};

export const Header = ({ navigation, language }: Props) => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Desktop nav: skip the home item (slug "index" resolves to the locale root)
  const desktopItems = (navigation?.items ?? []).filter((item) => {
    const slug = item.internal?.slug ?? "";
    return slug !== "index" && slug !== "";
  });

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background",
        "transition-[height,box-shadow,border-color] duration-200 ease-in",
        "flex items-center",
        scrolled
          ? "h-14 shadow-[0_2px_16px_oklch(0.18_0.02_55_/_0.10)] border-b border-border"
          : "h-16"
      )}
    >
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-[0.875rem] focus:font-semibold focus:text-primary-foreground focus:shadow-md focus:outline-none"
      >
        Skip to content
      </a>

      <div className="max-w-screen-xl mx-auto w-full flex items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link
          href={`/${language}`}
          aria-label="Joana Parente — Home"
          className="shrink-0 flex items-center focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 rounded-sm"
        >
          <LogoWordmark
            className={cn(
              "w-auto transition-[height] duration-200",
              scrolled ? "h-[34px]" : "h-[42px]"
            )}
          />
        </Link>

        {/* Desktop: nav links + lang toggle + CTA */}
        <div className="hidden md:flex items-center gap-6">
          <nav aria-label="Main navigation" className="flex items-center gap-6">
            {desktopItems.map((item) => {
              const href = resolveLink(item, language);
              const isActive =
                pathname === href ||
                (href !== `/${language}` && pathname.startsWith(`${href}/`));
              return (
                <Link
                  key={item.label}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "font-sans text-[0.82rem] font-medium",
                    "transition-colors duration-200",
                    "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 rounded-sm",
                    isActive
                      ? "text-foreground pb-[3px] border-b-[1.5px] border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <LangToggle language={language} />

          {navigation?.ctaLink && navigation?.ctaLabel && (
            <Link
              href={resolveLink(navigation.ctaLink, language)}
              className={cn(
                "bg-primary text-primary-foreground",
                "rounded-[6px] text-[0.78rem] font-semibold",
                "px-[1.1rem] py-[0.48rem]",
                "hover:bg-primary/80 transition-colors duration-200",
                "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4"
              )}
            >
              {navigation.ctaLabel}
            </Link>
          )}
        </div>

        {/* Mobile: hamburger only */}
        <div className="md:hidden">
          <MobileMenu items={navigation?.items || []} language={language} />
        </div>
      </div>
    </header>
  );
};
