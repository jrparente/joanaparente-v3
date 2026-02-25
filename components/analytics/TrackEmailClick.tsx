"use client";

import { trackContactEmailClick } from "@/lib/analytics";

export function TrackEmailClick({
  children,
  pageLanguage,
}: {
  children: React.ReactNode;
  pageLanguage: string;
}) {
  return (
    <span onClick={() => trackContactEmailClick(pageLanguage)}>{children}</span>
  );
}
