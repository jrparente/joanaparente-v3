"use client";

import { trackCaseStudySpotlightClick } from "@/lib/analytics";

export function TrackCaseStudyClick({
  children,
  projectSlug,
  className,
}: {
  children: React.ReactNode;
  projectSlug: string;
  className?: string;
}) {
  return (
    <span
      className={className}
      onClick={() =>
        trackCaseStudySpotlightClick(projectSlug, window.location.pathname)
      }
    >
      {children}
    </span>
  );
}
