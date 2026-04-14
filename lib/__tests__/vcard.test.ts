import { buildVcf } from "../vcard";

const baseData = {
  name: "Joana Parente",
  jobTitle: "Web Designer & Strategist",
  location: "Faro, Portugal",
  links: [
    { type: "external" as const, label: "Email", external: "mailto:hello@joanaparente.com" },
    { type: "external" as const, label: "joanaparente.com", external: "https://joanaparente.com" },
    { type: "external" as const, label: "LinkedIn", external: "https://linkedin.com/in/joana-parente" },
  ],
};

describe("buildVcf", () => {
  it("includes required vCard headers", () => {
    const vcf = buildVcf(baseData);
    expect(vcf).toContain("BEGIN:VCARD");
    expect(vcf).toContain("VERSION:3.0");
    expect(vcf).toContain("END:VCARD");
  });

  it("uses CRLF line endings", () => {
    const vcf = buildVcf(baseData);
    expect(vcf).toContain("\r\n");
    // No bare LF without preceding CR
    expect(vcf.replace(/\r\n/g, "")).not.toContain("\n");
  });

  it("sets FN to full name", () => {
    const vcf = buildVcf(baseData);
    expect(vcf).toContain("FN:Joana Parente");
  });

  it("sets N field with correct first/last name order", () => {
    const vcf = buildVcf(baseData);
    expect(vcf).toContain("N:Parente;Joana;;;");
  });

  it("includes TITLE and ORG when jobTitle is provided", () => {
    const vcf = buildVcf(baseData);
    expect(vcf).toContain("TITLE:Web Designer & Strategist");
    expect(vcf).toContain("ORG:Joana Parente");
  });

  it("omits TITLE and ORG when jobTitle is missing", () => {
    const { jobTitle, ...rest } = baseData;
    const vcf = buildVcf(rest);
    expect(vcf).not.toContain("TITLE:");
    expect(vcf).not.toContain("ORG:");
  });

  it("extracts email from mailto: link", () => {
    const vcf = buildVcf(baseData);
    expect(vcf).toContain("EMAIL;TYPE=INTERNET:hello@joanaparente.com");
  });

  it("extracts website URL", () => {
    const vcf = buildVcf(baseData);
    expect(vcf).toContain("URL:https://joanaparente.com");
  });

  it("extracts LinkedIn URL as X-SOCIALPROFILE", () => {
    const vcf = buildVcf(baseData);
    expect(vcf).toContain("X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/in/joana-parente");
  });

  it("includes ADR when location is provided", () => {
    const vcf = buildVcf(baseData);
    expect(vcf).toContain("ADR:;;Faro, Portugal;;;;");
  });

  it("omits ADR when location is missing", () => {
    const { location, ...rest } = baseData;
    const vcf = buildVcf(rest);
    expect(vcf).not.toContain("ADR:");
  });

  it("handles missing links gracefully", () => {
    const { links, ...rest } = baseData;
    const vcf = buildVcf(rest);
    expect(vcf).toContain("BEGIN:VCARD");
    expect(vcf).toContain("END:VCARD");
    expect(vcf).not.toContain("EMAIL:");
    expect(vcf).not.toContain("URL:");
  });

  it("falls back to joanaparente.com when no website link found", () => {
    const data = {
      ...baseData,
      links: [
        { type: "external" as const, label: "Email", external: "mailto:hello@joanaparente.com" },
      ],
    };
    const vcf = buildVcf(data);
    expect(vcf).toContain("URL:https://joanaparente.com");
  });
});
