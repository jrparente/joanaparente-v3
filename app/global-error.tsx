"use client";

import { useEffect } from "react";

// Hardcoded intentionally: global-error replaces the root layout —
// CSS variables, Tailwind, and next/font are unavailable here.
// Framework chrome exception applies (see .claude/rules/cms-first.md).

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F9F6F2",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: "560px", padding: "2rem" }}>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.75rem",
              fontWeight: 600,
              color: "#2C2419",
              marginBottom: "1rem",
              lineHeight: 1.25,
            }}
          >
            Something went wrong.
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "#5C4F3D",
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}
          >
            An unexpected error occurred. Try again or reload the page.
          </p>
          <button
            type="button"
            onClick={unstable_retry}
            style={{
              background: "#C4603A",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "0.875rem 1.75rem",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
