import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["en", "pt"];
const defaultLocale = "pt";

function getLocale(request: NextRequest) {
  const acceptedLanguage = request.headers.get("accept-language") ?? "pt";
  const headers = { "accept-language": acceptedLanguage };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ✅ BAIL EARLY: Allow non-localized pages /bio and /card
  if (pathname === "/bio" || pathname === "/card") {
    return NextResponse.next();
  }

  // ✅ BAIL EARLY: Static assets
  if (
    /\.(svg|png|jpg|jpeg|gif|ico|webp|css|js|map|json|txt|xml|woff2?|ttf)$/.test(
      pathname
    )
  ) {
    return NextResponse.next();
  }

  // Determine if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    // Redirect — no page is rendered here, header not needed
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  // Rewrite /pt/projetos(/*) → /pt/projects(/*) — locale is always "pt" here
  const projectsRewrite = pathname.match(/^\/(pt)\/projetos(\/.*)?$/);
  if (projectsRewrite) {
    const rest = projectsRewrite[2] || "";
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-language", "pt");
    return NextResponse.rewrite(
      new URL(`/pt/projects${rest}`, request.url),
      { request: { headers: requestHeaders } }
    );
  }

  // Locale is present in pathname — extract it and pass through
  const locale =
    locales.find(
      (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
    ) ?? defaultLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-language", locale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*|admin|sitemap.xml|webhook|sentry-example-page|bio|card).*)",
  ],
};
