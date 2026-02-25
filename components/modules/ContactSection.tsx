import Link from "next/link";
import { Mail, MapPin, LinkedinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFooter } from "@/lib/sanity/queries";
import { TrackEmailClick } from "@/components/analytics/TrackEmailClick";
import { ContactSectionBlock } from "@/types/Sanity";

type Props = {
  block: ContactSectionBlock;
  language?: string;
};

const ContactSection = async ({ block, language }: Props) => {
  const {
    eyebrow,
    heading,
    intro,
    emailLabel,
    linkedinLabel,
    location,
    microcopy,
    backLabel,
  } = block;

  const footer = await getFooter();
  const email = footer?.email || "hello@joanaparente.com";
  const linkedinUrl = footer?.socialLinks?.find(
    (l) => l.platform === "LinkedIn"
  )?.url;

  return (
    <section className="w-full py-8 md:py-12">
      <div className="max-w-2xl mx-auto px-4">
        {backLabel && (
          <Link
            href={`/${language || "pt"}`}
            className="text-sm font-sans font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block"
          >
            {backLabel}
          </Link>
        )}

        {eyebrow && (
          <span className="block text-sm font-sans font-semibold uppercase tracking-widest text-[var(--color-brand)] mb-3">
            {eyebrow}
          </span>
        )}

        {heading && (
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {heading}
          </h1>
        )}

        {intro && (
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            {intro}
          </p>
        )}

        <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
          <TrackEmailClick pageLanguage={language || "pt"}>
            <Button asChild size="lg">
              <a href={`mailto:${email}`}>
                <Mail className="mr-2 h-5 w-5" />
                {emailLabel || "Send email"}
              </a>
            </Button>
          </TrackEmailClick>

          {linkedinUrl && linkedinLabel && (
            <Button asChild variant="outline" size="lg">
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon className="mr-2 h-5 w-5" />
                {linkedinLabel}
              </a>
            </Button>
          )}
        </div>

        {microcopy && (
          <p className="mt-3 text-sm text-muted-foreground italic">
            {microcopy}
          </p>
        )}

        {location && (
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-[var(--color-brand)]" />
            <span>{location}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
