"use client";

import { trackServiceTierClick } from "@/lib/analytics";

export function TrackServiceTierClick({
  children,
  tierName,
  pagePath,
  className,
}: {
  children: React.ReactNode;
  tierName: string;
  pagePath: string;
  className?: string;
}) {
  return (
    <span
      className={className}
      onClick={() => trackServiceTierClick(tierName, pagePath)}
    >
      {children}
    </span>
  );
}
