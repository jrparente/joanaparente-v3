import Link from "next/link";
import Image from "next/image";

type Props = {
  language: string;
};

export const Logo = ({ language }: Props) => {
  return (
    <Link
      href={`/${language}`}
      aria-label="Joana Parente — Home"
      className="flex items-center hover:opacity-80 transition-opacity"
    >
      {/* Mobile: icon only */}
      <span className="md:hidden">
        <Image
          src="/logo/logo-icon-dark.svg"
          alt=""
          width={468}
          height={419}
          className="h-8 w-auto dark:hidden"
          aria-hidden="true"
          priority
        />
        <Image
          src="/logo/logo-icon-light.svg"
          alt=""
          width={468}
          height={419}
          className="h-8 w-auto hidden dark:block"
          aria-hidden="true"
          priority
        />
      </span>

      {/* Desktop: full wordmark */}
      <span className="hidden md:block">
        <Image
          src="/logo/logo-wordmark-dark.svg"
          alt=""
          width={280}
          height={64}
          className="h-8 w-auto dark:hidden"
          aria-hidden="true"
          priority
        />
        <Image
          src="/logo/logo-wordmark-light.svg"
          alt=""
          width={280}
          height={64}
          className="h-8 w-auto hidden dark:block"
          aria-hidden="true"
          priority
        />
      </span>
    </Link>
  );
};
