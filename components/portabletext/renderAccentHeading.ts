import type { ReactNode } from "react";
import { createElement } from "react";

/** Parse [[text]] syntax into italic accent <em> spans */
export function renderAccentHeading(text: string): ReactNode[] {
  const parts = text.split(/(\[\[.*?\]\])/g);
  return parts.map((part, i) => {
    if (part.startsWith("[[") && part.endsWith("]]")) {
      return createElement(
        "em",
        { key: i, className: "italic text-[var(--color-brand)]" },
        part.slice(2, -2)
      );
    }
    return part;
  });
}
