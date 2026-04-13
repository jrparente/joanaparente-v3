import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";

export const alt = "Joana Parente — Web Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

export async function generateStaticParams() {
  return [{ language: "pt" }, { language: "en" }];
}

export default async function Image({
  params,
}: {
  params: Promise<{ language: string }>;
}) {
  const { language } = await params;

  // Use client.fetch directly — getSiteSettings/fetchSanity calls draftMode() which
  // throws in file-based metadata routes (opengraph-image.tsx)
  const result = await client.fetch<{ ogTagline?: string } | null>(
    groq`*[_type == "site" && language == $language][0] { ogTagline }`,
    { language }
  );
  const tagline = result?.ogTagline || "Strategist who codes.";

  // Split at last space so final word renders in terracotta accent colour
  const lastSpace = tagline.lastIndexOf(" ");
  const taglineStart = lastSpace >= 0 ? tagline.slice(0, lastSpace + 1) : "";
  const taglineAccent = lastSpace >= 0 ? tagline.slice(lastSpace + 1) : tagline;

  // Load fonts and icon from disk (Satori cannot use next/font/google)
  const [frauncesFont, jakartaFont, iconData] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Fraunces-Italic.ttf")),
    readFile(join(process.cwd(), "assets/fonts/PlusJakartaSans-Medium.ttf")),
    readFile(join(process.cwd(), "public/logo/logo-icon-dark.png")),
  ]);

  const iconBase64 = `data:image/png;base64,${iconData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundColor: "#F9F6F2",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          fontFamily: "PlusJakartaSans",
        }}
      >
        {/* Eyebrow — terracotta rule + name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 56,
              height: 2,
              backgroundColor: "#C4603A",
            }}
          />
          <span
            style={{
              fontFamily: "PlusJakartaSans",
              fontSize: 20,
              fontWeight: 500,
              color: "#C4603A",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Joana Parente
          </span>
        </div>

        {/* Headline — Fraunces italic, last word in terracotta */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            fontSize: 112,
            fontFamily: "Fraunces",
            fontStyle: "italic",
            lineHeight: 1.05,
            color: "#2C2419",
            marginBottom: 48,
          }}
        >
          <span>{taglineStart}</span>
          <span style={{ color: "#C4603A" }}>{taglineAccent}</span>
        </div>

        {/* Bottom row — icon + location + domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={iconBase64}
            width={36}
            height={36}
            alt=""
            style={{ opacity: 0.6 }}
          />
          <span
            style={{
              fontFamily: "PlusJakartaSans",
              fontSize: 18,
              color: "#9E8068",
            }}
          >
            Web Dev · Algarve · joanaparente.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Fraunces",
          data: frauncesFont,
          style: "italic",
          weight: 400,
        },
        {
          name: "PlusJakartaSans",
          data: jakartaFont,
          style: "normal",
          weight: 500,
        },
      ],
    }
  );
}
