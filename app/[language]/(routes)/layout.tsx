import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getNavigation, getSiteSettings } from "@/lib/sanity/queries";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string }>;
}): Promise<Metadata> {
  const { language } = await params;
  const siteSettings = await getSiteSettings(language);

  if (!siteSettings || !siteSettings.metadata) {
    return {
      title: "Joana Parente | Web Developer",
      description:
        "Portfolio website of Joana Parente, freelance full-stack web developer specialized in scalable, elegant websites using React and Next.js.",
    };
  }

  const { title, metaDescription, keywords, defaultOgImage, noIndex } =
    siteSettings.metadata;

  return {
    title: title || "Joana Parente | Web Developer",
    description:
      metaDescription ||
      "Freelance web developer and digital strategist specializing in modern, high-performance websites.",
    keywords: keywords?.length ? keywords.join(", ") : undefined,
    openGraph: {
      title: title,
      description: metaDescription,
      images: defaultOgImage?.asset?.url
        ? [{ url: defaultOgImage.asset.url }]
        : undefined,
    },
    robots: noIndex ? "noindex" : undefined,
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ language: string }>;
}>) {
  const { language } = await params;

  const navigation = await getNavigation(language);

  return (
    <html lang={language} suppressHydrationWarning>
      <body
        className={`grid h-full min-h-[100dvh] auto-rows-[auto_1fr_auto] ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header navigation={navigation} language={language} />
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
