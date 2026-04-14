import type { Metadata } from "next";
import { headers } from "next/headers";
import { getCardPage } from "@/lib/sanity/queries";
import CardClient from "./CardClient";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCardPage("en");
  return {
    title: data?.name ?? "Joana Parente",
    description: data?.tagline ?? "Strategist who codes.",
    robots: { index: false, follow: false },
    alternates: { canonical: "https://www.joanaparente.com/card" },
  };
}

export default async function CardPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") ?? "";
  const detectedLocale = acceptLanguage.toLowerCase().includes("pt") ? "pt" : "en";

  const [dataEn, dataPt] = await Promise.all([
    getCardPage("en"),
    getCardPage("pt"),
  ]);

  if (!dataEn && !dataPt) return null;

  return (
    <CardClient
      dataEn={dataEn}
      dataPt={dataPt}
      detectedLocale={detectedLocale}
    />
  );
}
