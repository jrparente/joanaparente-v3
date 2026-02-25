"use client";

import { trackContactCtaClick } from "@/lib/analytics";

export function TrackCtaClick({
  children,
  ctaLocation,
  pageLanguage,
  className,
}: {
  children: React.ReactNode;
  ctaLocation: string;
  pageLanguage: string;
  className?: string;
}) {
  return (
    <span
      className={className}
      onClick={() => trackContactCtaClick(ctaLocation, pageLanguage)}
    >
      {children}
    </span>
  );
}
