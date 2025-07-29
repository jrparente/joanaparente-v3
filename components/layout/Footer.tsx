import Link from "next/link";
import {
  MailIcon,
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
} from "lucide-react";
import { getFooter } from "@/lib/sanity/queries";

const iconMap: Record<string, React.ReactNode> = {
  GitHub: <GithubIcon className="h-5 w-5" />,
  LinkedIn: <LinkedinIcon className="h-5 w-5" />,
  Instagram: <InstagramIcon className="h-5 w-5" />,
};

export default async function Footer() {
  const footer = await getFooter();

  if (!footer) {
    return (
      <footer className="w-full border-t border-border bg-background py-8">
        <div className="max-w-screen-xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Joana Parente</p>
        </div>
      </footer>
    );
  }

  const { message, email, socialLinks } = footer;
  return (
    <footer className="w-full border-t border-border bg-background py-8">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} {message}
        </p>
        <div className="flex items-center gap-4">
          <Link
            href={`mailto:${email}`}
            className="hover:text-primary transition"
          >
            <MailIcon className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </Link>
          {socialLinks?.map((link) => (
            <Link
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition"
            >
              {iconMap[link.platform] ?? link.platform}
              <span className="sr-only">{link.platform}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
