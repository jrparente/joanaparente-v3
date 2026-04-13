"use client";

import { trackExternalLinkClick } from "@/lib/analytics";

export function TrackExternalLink({
  children,
  destinationUrl,
  linkType,
  className,
}: {
  children: React.ReactNode;
  destinationUrl: string;
  linkType: string;
  className?: string;
}) {
  return (
    <span
      className={className}
      onClick={() => trackExternalLinkClick(destinationUrl, linkType)}
    >
      {children}
    </span>
  );
}
