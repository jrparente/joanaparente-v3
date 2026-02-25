"use client";

import { useEffect } from "react";
import { trackProjectView } from "@/lib/analytics";

export function TrackProjectView({
  projectSlug,
  pageLanguage,
}: {
  projectSlug: string;
  pageLanguage: string;
}) {
  useEffect(() => {
    trackProjectView(projectSlug, pageLanguage);
  }, [projectSlug, pageLanguage]);

  return null;
}
