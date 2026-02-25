import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "../../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getNavigation, getSiteSettings } from "@/lib/sanity/queries";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

const headingFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  axes: ["WONK"],
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const BASE_URL = "https://www.joanaparente.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string }>;
}): Promise<Metadata> {
  const { language } = await params;
  const siteSettings = await getSiteSettings(language);

  const fallback: Metadata = {
    title: "Joana Parente | Web Developer",
    description:
      "Portfolio website of Joana Parente, freelance full-stack web developer specialized in scalable, elegant websites using React and Next.js.",
    alternates: {
      canonical: `${BASE_URL}/${language}`,
      languages: {
        pt: `${BASE_URL}/pt`,
        en: `${BASE_URL}/en`,
        "x-default": `${BASE_URL}/pt`,
      },
    },
  };

  if (!siteSettings || !siteSettings.metadata) {
    return fallback;
  }

  const {
    title,
    metaDescription,
    keywords,
    defaultOgImage,
    defaultTwitterImage,
    noIndex,
  } = siteSettings.metadata;

  const resolvedTitle = title || "Joana Parente | Web Developer";
  const resolvedDescription =
    metaDescription ||
    "Freelance web developer and digital strategist specializing in modern, high-performance websites.";
  const ogImageUrl = defaultOgImage?.asset?.url;
  const twitterImageUrl = defaultTwitterImage?.asset?.url || ogImageUrl;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: keywords?.length ? keywords.join(", ") : undefined,
    alternates: {
      canonical: `${BASE_URL}/${language}`,
      languages: {
        pt: `${BASE_URL}/pt`,
        en: `${BASE_URL}/en`,
        "x-default": `${BASE_URL}/pt`,
      },
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: `${BASE_URL}/${language}`,
      siteName: "Joana Parente",
      locale: language === "pt" ? "pt_PT" : "en_US",
      alternateLocale: language === "pt" ? "en_US" : "pt_PT",
      type: "website",
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: twitterImageUrl ? [twitterImageUrl] : undefined,
    },
    robots: noIndex ? "noindex" : undefined,
  };
}

function getPersonJsonLd(language: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.joanaparente.com/#person",
    name: "Joana Parente",
    url: "https://www.joanaparente.com",
    jobTitle:
      language === "pt"
        ? "Desenvolvedora Web & Estrategista Digital"
        : "Web Developer & Digital Strategist",
    description:
      language === "pt"
        ? "Desenvolvedora web freelance especializada em websites modernos e de alto desempenho para turismo, hotelaria e negócios criativos."
        : "Freelance web developer specializing in modern, high-performance websites for tourism, hospitality, and creative businesses.",
    sameAs: [
      "https://www.linkedin.com/in/joanaparente",
      "https://github.com/jrparente",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Faro",
      addressRegion: "Algarve",
      addressCountry: "PT",
    },
    knowsLanguage: ["pt", "en"],
  };
}

function getProfessionalServiceJsonLd(language: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://www.joanaparente.com/#service",
    name: "Joana Parente — Web Development",
    url: `https://www.joanaparente.com/${language}`,
    provider: { "@id": "https://www.joanaparente.com/#person" },
    description:
      language === "pt"
        ? "Desenvolvimento web e estratégia digital para turismo, hotelaria e negócios criativos no Algarve e Portugal."
        : "Web development and digital strategy for tourism, hospitality, and creative businesses in the Algarve and Portugal.",
    areaServed: [
      { "@type": "Country", name: "Portugal" },
      { "@type": "Place", name: "European Union" },
    ],
    serviceType: [
      "Web Development",
      "Digital Strategy",
      "E-Commerce Development",
    ],
    priceRange: "€1200–€10000+",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Faro",
      addressRegion: "Algarve",
      addressCountry: "PT",
    },
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
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;

  return (
    <html
      lang={language}
      className={`${headingFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <body className="grid h-full min-h-[100dvh] auto-rows-[auto_1fr_auto]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getPersonJsonLd(language)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getProfessionalServiceJsonLd(language)),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header navigation={navigation} language={language} />
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
