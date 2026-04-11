import Link from "next/link";
import {
  MailIcon,
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
} from "lucide-react";
import { getFooter } from "@/lib/sanity/queries";
import { localizedPath } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { LogoIcon } from "./LogoIcon";
import { LogoWordmark } from "./LogoWordmark";

const iconMap: Record<string, React.ReactNode> = {
  GitHub: <GithubIcon className="h-4 w-4" />,
  LinkedIn: <LinkedinIcon className="h-4 w-4" />,
  Instagram: <InstagramIcon className="h-4 w-4" />,
};

type FooterProps = {
  language: string;
};

function resolveFooterPath(path: string, language: string): string {
  // Strip leading slash, translate segment, rebuild
  const segment = path.replace(/^\//, "");
  const translated = localizedPath(segment, language);
  return `/${language}/${translated}`;
}

export default async function Footer({ language }: FooterProps) {
  const footer = await getFooter();
  const currentYear = new Date().getFullYear();

  if (!footer) {
    return (
      <footer className="w-full border-t border-border py-8">
        <div className="max-w-screen-xl mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>&copy; {currentYear} Joana Parente</p>
        </div>
      </footer>
    );
  }

  const {
    showLogo = true,
    location,
    email,
    socialLinks,
    navLinks,
    legalLinks,
    copyrightText = "Joana Parente",
  } = footer;

  return (
    <footer className="w-full border-t border-border py-8 md:py-10 lg:py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* ── Top section: asymmetric on md+, centered stack on mobile ── */}
        <div className="flex flex-col items-center text-center md:flex-row md:items-start md:justify-between md:text-left">
          {/* Left column: brand identity */}
          <div className="flex flex-col items-center gap-1 md:items-start md:gap-1.5">
            {showLogo && (
              <div aria-hidden="true">
                <LogoIcon className="h-8 w-auto md:hidden" />
                <LogoWordmark className="h-8 w-auto hidden md:block" />
              </div>
            )}
            {location && (
              <p className="text-sm text-muted-foreground/70">{location}</p>
            )}
            {/* Email: visible on md+ in left column, on mobile after social links */}
            {email && (
              <Link
                href={`mailto:${email}`}
                aria-label={`Send email to ${email}`}
                className="hidden md:inline-block text-sm text-muted-foreground border-b border-border hover:text-foreground hover:border-muted-foreground transition-colors duration-200"
              >
                {email}
              </Link>
            )}
          </div>

          {/* Right column: utility */}
          <div className="flex flex-col items-center gap-4 mt-5 md:items-end md:gap-3 md:mt-0">
            {navLinks && navLinks.length > 0 && (
              <nav aria-label="Footer navigation">
                <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:justify-end md:gap-x-5 lg:gap-x-7">
                  {navLinks.map((link) => (
                    <li key={link.path}>
                      <Link
                        href={resolveFooterPath(link.path, language)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 min-h-[44px] inline-flex items-center md:min-h-0"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {socialLinks && socialLinks.length > 0 && (
              <div className="flex gap-4 md:gap-4 lg:gap-5">
                {socialLinks.map((link) => (
                  <Link
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.platform} (opens in new tab)`}
                    className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors duration-200 inline-flex items-center gap-1 min-h-[44px] md:min-h-0"
                  >
                    {iconMap[link.platform] ?? null}
                    <span>{link.platform}</span>
                    <span aria-hidden="true">&#8599;</span>
                  </Link>
                ))}
              </div>
            )}
            {/* Email on mobile only — appears after social links */}
            {email && (
              <Link
                href={`mailto:${email}`}
                aria-label={`Send email to ${email}`}
                className="md:hidden text-sm text-muted-foreground border-b border-border hover:text-foreground hover:border-muted-foreground transition-colors duration-200 min-h-[44px] inline-flex items-center"
              >
                {email}
              </Link>
            )}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-6 pt-4 md:mt-6 md:pt-4 lg:mt-8 lg:pt-5 border-t border-border flex flex-col items-center gap-2 md:flex-row md:justify-between md:gap-0">
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <p className="text-xs text-muted-foreground/70">
              &copy; {currentYear} {copyrightText}
            </p>
          </div>
          {legalLinks && legalLinks.length > 0 && (
            <div className="flex gap-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  href={resolveFooterPath(link.path, language)}
                  className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors duration-200 min-h-[44px] inline-flex items-center md:min-h-0"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
