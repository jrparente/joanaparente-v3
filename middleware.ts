import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["en", "pt"];
const defaultLocale = "en";

function getLocale(request: NextRequest) {
  const acceptedLanguage = request.headers.get("accept-language") ?? undefined;
  const headers = { "accept-language": acceptedLanguage };
  const languages = new Negotiator({ headers }).languages();

  return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ✅ BAIL EARLY: Allow non-localized page /bio
  if (pathname === "/bio") {
    return NextResponse.next();
  }

  // ✅ BAIL EARLY: If it's a static asset (e.g. ends in .svg, .png, etc.), skip
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

    // This was the case where if the locale was de default, then we could show the page without the locale
    // if (locale === defaultLocale) {
    //   return NextResponse.rewrite(
    //     new URL(`/${locale}${pathname}`, request.url)
    //   );
    // }

    // Always redirect to the URL with the locale included
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  // If the locale is already in the pathname, proceed as normal
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|.*\\..*|admin|sitemap.xml|webhook|sentry-example-page|bio).*)",
  ],
};
