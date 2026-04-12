"use client";

import * as CookieConsent from "vanilla-cookieconsent";

interface CookieSettingsLinkProps {
  children: React.ReactNode;
  className?: string;
}

export default function CookieSettingsLink({
  children,
  className,
}: CookieSettingsLinkProps) {
  return (
    <button
      type="button"
      onClick={() => CookieConsent.show(true)}
      className={className}
    >
      {children}
    </button>
  );
}
