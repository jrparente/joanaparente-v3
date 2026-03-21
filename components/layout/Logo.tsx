import Link from "next/link";
import { LogoIcon } from "./LogoIcon";
import { LogoWordmark } from "./LogoWordmark";

type Props = {
  language: string;
};

export const Logo = ({ language }: Props) => {
  return (
    <Link
      href={`/${language}`}
      aria-label="Joana Parente — Home"
      className="flex items-center hover:opacity-80 motion-safe:transition-opacity"
    >
      {/* Mobile: icon only */}
      <LogoIcon className="h-8 w-auto md:hidden" />

      {/* Desktop: full wordmark */}
      <LogoWordmark className="h-8 w-auto hidden md:block" />
    </Link>
  );
};
