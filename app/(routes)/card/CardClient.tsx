"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Globe, Linkedin } from "lucide-react";
import { LogoIcon } from "@/components/layout/LogoIcon";
import type { CardPageType, LinkType } from "@/types/Sanity";
import { resolveLink } from "@/lib/utils";

interface Props {
  dataEn: CardPageType | null;
  dataPt: CardPageType | null;
  detectedLocale: "en" | "pt";
}

export default function CardClient({ dataEn, dataPt, detectedLocale }: Props) {
  const [locale, setLocale] = useState<"en" | "pt">(detectedLocale);

  // Fallback: if one language document is missing, fall back to the other
  const data = locale === "pt" ? (dataPt ?? dataEn) : (dataEn ?? dataPt);

  // Keep <html lang> in sync with the active locale for screen readers
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  if (!data) return null;

  const saveLabel =
    data.saveContactLabel ?? (locale === "pt" ? "Guardar contacto" : "Save Contact");
  const visitLabel =
    data.visitWebsiteLabel ?? (locale === "pt" ? "Visitar website" : "Visit Website");

  return (
    <main className="relative z-[1] min-h-screen bg-background flex flex-col items-center px-6 pt-8 pb-12 md:pt-[60px]">

      {/* Header: logo + language toggle */}
      <div className="w-full max-w-[360px] flex items-center justify-between mb-7">
        <Link href="/" aria-label="Joana Parente — Homepage">
          <LogoIcon className="h-7 w-auto" />
        </Link>

        {/* Filled-pill toggle — NOT .lang-btn (that's the underline style for site nav) */}
        <div className="flex gap-0.5" role="group" aria-label="Language">
          {(["en", "pt"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLocale(l)}
              aria-pressed={locale === l}
              className={
                locale === l
                  ? "bg-brand text-white text-[11px] font-semibold tracking-[0.5px] px-2 py-1 rounded cursor-default"
                  : "text-text-subtle text-[11px] font-semibold tracking-[0.5px] px-2 py-1 rounded hover:text-foreground transition-colors"
              }
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Card surface */}
      <div className="w-full max-w-[360px] bg-card border border-border rounded-[16px] px-6 pt-7 pb-6">

        {/* Identity */}
        <div className="text-center mb-5">
          <h1 className="font-heading font-medium text-[22px] tracking-[-0.2px] text-foreground">
            {data.name}
          </h1>
          <p className="font-semibold text-[11px] tracking-[0.6px] text-brand mt-1">
            {data.tagline}
          </p>
          {data.oneliner && (
            <p className="text-[12px] leading-[1.55] text-muted-foreground mt-2 px-2 transition-opacity duration-200">
              {data.oneliner}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border my-5" />

        {/* Contact links */}
        {data.links && data.links.length > 0 && (
          <ul className="mb-5" aria-label="Contact links">
            {data.links.map((link, i) => (
              <LinkRow key={i} link={link} />
            ))}
          </ul>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <a
            href="/api/vcard"
            download="joana-parente.vcf"
            className="block w-full py-[13px] bg-brand text-white text-[13px] font-semibold text-center rounded-[10px] hover:opacity-[0.88] transition-opacity"
          >
            {saveLabel}
          </a>
          <a
            href="https://joanaparente.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 border-[1.5px] border-brand text-brand text-[13px] font-medium text-center rounded-[10px] hover:bg-brand/[0.06] transition-colors"
          >
            {visitLabel}
          </a>
        </div>
      </div>
    </main>
  );
}

function LinkRow({ link }: { link: LinkType }) {
  const href = resolveLink(link);
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 py-2.5 border-b border-border last:border-0 text-[13px] text-foreground hover:text-brand transition-colors"
      >
        <LinkIcon href={href} />
        <span>{link.label}</span>
      </a>
    </li>
  );
}

function LinkIcon({ href }: { href: string }) {
  const cls = "size-4 shrink-0 text-brand";
  if (href.startsWith("mailto:")) return <Mail className={cls} />;
  if (href.includes("linkedin")) return <Linkedin className={cls} />;
  return <Globe className={cls} />;
}
