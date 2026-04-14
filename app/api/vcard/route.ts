import { getCardPage } from "@/lib/sanity/queries";
import { buildVcf } from "@/lib/vcard";

export async function GET() {
  const data = await getCardPage("en");

  if (!data) {
    return new Response(null, { status: 404 });
  }

  const vcf = buildVcf(data);

  return new Response(vcf, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="joana-parente.vcf"',
      "Cache-Control": "no-store",
    },
  });
}
