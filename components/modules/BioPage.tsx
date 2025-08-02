"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Github,
  Linkedin,
  Globe,
  Mail,
  Instagram,
  Link as LinkIcon,
} from "lucide-react";
import { BioPageProps } from "@/types/Sanity";
import { urlFor } from "@/lib/sanity/image";
import { Button } from "../ui/button";

const iconMap: Record<string, React.ReactNode> = {
  github: <Github size={18} />,
  linkedin: <Linkedin size={18} />,
  website: <Globe size={18} />,
  email: <Mail size={18} />,
  instagram: <Instagram size={18} />,
  link: <LinkIcon size={18} />,
};

export default function BioPage({ block }: { block: BioPageProps }) {
  const {
    profileImage,
    name,
    bio,
    links = [],
    backgroundColor = "#f0f0f0",
    textColor = "#333",
  } = block;
  return (
    <main className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-6 my-12 px-3">
      <div className="flex flex-col items-center justify-center gap-3">
        {profileImage && (
          <Image
            src={urlFor(profileImage).url()}
            alt={profileImage.alt || name}
            width={150}
            height={150}
            className="rounded-full mb-4"
          />
        )}

        <h1 className="uppercase text-2xl font-thin tracking-widest">{name}</h1>
        {bio && (
          <p className="text-sm font-mono text-center mt-2 max-w-sm">{bio}</p>
        )}
      </div>

      <ul className="mt-6 w-full max-w-xs space-y-3">
        {links.map((link) => (
          <li key={link.url}>
            <Button
              asChild
              className="w-full font-light tracking-widest py-5 px-4"
              variant="outline"
              size={"lg"}
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 "
              >
                {
                  iconMap[
                    link.icon?.toLowerCase() ||
                      (link.url.startsWith("mailto:") && "email") ||
                      (link.url.includes("linkedin.com") && "linkedin") ||
                      (link.url.includes("github.com") && "github") ||
                      (link.url.includes("instagram.com") && "instagram") ||
                      (link.url.includes("http") && "website") ||
                      "link"
                  ]
                }
                {link.label}
              </a>
            </Button>
          </li>
        ))}
      </ul>
    </main>
  );
}
