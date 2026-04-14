import type { CardPageType, LinkType } from "@/types/Sanity";

type VcfData = Pick<CardPageType, "name" | "jobTitle" | "location" | "links">;

export function buildVcf(data: VcfData): string {
  // null means "no links at all" — undefined links → no URL line
  const links = data.links ?? null;

  const emailLink = links?.find(
    (l): l is LinkType & { external: string } =>
      l.type === "external" && (l.external?.startsWith("mailto:") ?? false)
  );
  const linkedinLink = links?.find(
    (l): l is LinkType & { external: string } =>
      l.type === "external" && (l.external?.includes("linkedin") ?? false)
  );
  const websiteLink = links?.find(
    (l): l is LinkType & { external: string } =>
      l.type === "external" &&
      !l.external?.startsWith("mailto:") &&
      !l.external?.includes("linkedin")
  );

  const email = emailLink?.external.replace("mailto:", "") ?? "";
  // Only emit URL when links array exists (even if falling back to default)
  const website =
    links !== null ? (websiteLink?.external ?? "https://joanaparente.com") : null;
  const linkedin = linkedinLink?.external ?? "";

  const nameParts = (data.name ?? "").split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") ?? "";

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${data.name ?? ""}`,
    `N:${lastName};${firstName};;;`,
    data.jobTitle ? `TITLE:${data.jobTitle}` : null,
    data.jobTitle ? `ORG:${data.name ?? ""}` : null,
    email ? `EMAIL;TYPE=INTERNET:${email}` : null,
    website ? `URL:${website}` : null,
    linkedin ? `X-SOCIALPROFILE;TYPE=linkedin:${linkedin}` : null,
    data.location ? `ADR:;;${data.location};;;;` : null,
    "END:VCARD",
  ].filter((line): line is string => line !== null);

  return lines.join("\r\n");
}
