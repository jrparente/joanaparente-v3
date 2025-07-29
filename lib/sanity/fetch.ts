import "server-only";

import type { QueryParams } from "next-sanity";
import { draftMode } from "next/headers";
import { client } from "./client";
import dev from "../dev";

export const token = process.env.SANITY_API_READ_TOKEN;

const DEFAULT_PARAMS = {} as QueryParams;
const DEFAULT_TAGS = [] as string[];

export async function fetchSanity<QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}): Promise<QueryResponse> {
  const preview = dev || (await draftMode()).isEnabled;
  if (preview && !token) {
    throw new Error(
      "The `SANITY_API_READ_TOKEN` environment variable is required."
    );
  }

  return client.withConfig({ useCdn: true }).fetch<QueryResponse>(
    query,
    params,
    preview
      ? {
          stega: true,
          perspective: "drafts",
          useCdn: false,
          token,
          next: {
            revalidate: 0,
            tags,
          },
        }
      : {
          perspective: "published",
          useCdn: true,
          next: {
            revalidate: 60, // every hour
            tags,
          },
        }
  );
}
