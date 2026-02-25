"use client";

import { useState } from "react";
import Link from "next/link";
import { LinkType } from "@/types/Sanity";
import { resolveLink } from "@/lib/utils";
import { Menu, X } from "lucide-react";

type Props = {
  items: LinkType[];
  language: string;
};

export const MobileMenu = ({ items, language }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-foreground"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <nav className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg z-50">
          <div className="flex flex-col px-4 py-4 gap-1">
            {items?.map((item) => {
              const href = resolveLink(item as LinkType, language);
              return (
                <Link
                  key={item.label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-muted font-medium font-sans py-3 px-3 uppercase text-sm tracking-wide rounded-md transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};
