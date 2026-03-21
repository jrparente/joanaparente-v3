"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LinkType } from "@/types/Sanity";
import { resolveLink } from "@/lib/utils";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

type Props = {
  items: LinkType[];
  language: string;
};

export const MobileMenu = ({ items, language }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sheet on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button
            className="inline-flex items-center justify-center size-11 text-foreground rounded-md"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-4/5 sm:max-w-sm">
          <VisuallyHidden>
            <SheetTitle>Navigation menu</SheetTitle>
          </VisuallyHidden>
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1 mt-8">
            {items?.map((item) => {
              const href = resolveLink(item, language);
              return (
                <Link
                  key={item.label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-muted font-medium font-sans py-3 px-3 uppercase text-sm tracking-wide rounded-md motion-safe:transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};
