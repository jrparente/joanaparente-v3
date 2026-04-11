"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationType } from "@/types/Sanity";
import { resolveLink, cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { LogoWordmark } from "./LogoWordmark";
import { LangToggle } from "./LangToggle";

type Props = {
  navigation: NavigationType;
  language: string;
};

export const MobileMenu = ({ navigation, language }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        {/* Hamburger trigger */}
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
          aria-expanded={isOpen}
          className={cn(
            "inline-flex items-center justify-center size-11 text-foreground rounded-md",
            "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
            "transition-opacity duration-150",
            isOpen && "opacity-0 pointer-events-none"
          )}
        >
          <Menu className="h-[22px] w-[22px]" strokeWidth={1.5} />
        </button>

        <SheetContent
          side="right"
          showCloseButton={false}
          overlayClassName="bg-[rgba(30,23,19,0.35)]"
          className={cn(
            "w-[80vw] max-w-[260px] bg-background border-l border-border",
            "p-0 flex flex-col gap-0",
            "data-[state=open]:duration-200 data-[state=closed]:duration-200"
          )}
        >
          <VisuallyHidden>
            <SheetTitle>Navigation menu</SheetTitle>
          </VisuallyHidden>

          {/* Drawer header */}
          <div className="h-14 flex items-center justify-between px-5 border-b border-border shrink-0">
            <Link
              href={`/${language}`}
              onClick={() => setIsOpen(false)}
              aria-label="Joana Parente — Home"
              className="flex items-center focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 rounded-sm"
            >
              <LogoWordmark className="h-[38px] w-auto" />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className={cn(
                "inline-flex items-center justify-center size-11 rounded-md",
                "text-muted-foreground hover:text-foreground transition-colors duration-200",
                "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              )}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col px-5 pt-3 flex-1 overflow-y-auto"
          >
            {(navigation?.items ?? []).map((item) => {
              const href = resolveLink(item, language);
              const isActive = pathname === href;
              return (
                <Link
                  key={item.label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "font-heading font-light text-[1.75rem] tracking-[-0.01em]",
                    "py-[0.65rem] block",
                    "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 rounded-sm",
                    isActive
                      ? "text-foreground border-b-[1.5px] border-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Drawer footer */}
          <div className="px-5 pb-6 pt-4 flex flex-col gap-3 shrink-0">
            {navigation?.ctaLink && navigation?.ctaLabel && (
              <Link
                href={resolveLink(navigation.ctaLink, language)}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block w-full text-center",
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
            <div className="flex justify-center">
              <LangToggle language={language} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
