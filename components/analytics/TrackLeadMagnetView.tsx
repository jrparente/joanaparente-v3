"use client";

import { useEffect } from "react";
import { trackLeadMagnetView } from "@/lib/analytics";

type Props = {
  magnetId: string;
  pageLanguage: string;
};

export function TrackLeadMagnetView({ magnetId, pageLanguage }: Props) {
  useEffect(() => {
    trackLeadMagnetView(magnetId, pageLanguage);
  }, [magnetId, pageLanguage]);

  return null;
}
