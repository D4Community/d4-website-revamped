import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export type PartnerLogo = {
  id: string;
  name: string;
  logo: string;
};

type SanityPartner = {
  _id: string;
  name?: string | null;
  logo?: {
    alt?: string | null;
    hotspot?: Record<string, unknown> | null;
    crop?: Record<string, unknown> | null;
    asset?: { _id?: string } | null;
  } | null;
};

const PARTNER_QUERY = `*[_type == $type && defined(logo.asset)] | order(name asc) {
  _id,
  name,
  logo{
    alt,
    hotspot,
    crop,
    asset->{ _id }
  }
}`;

function mapPartner(item: SanityPartner): PartnerLogo | null {
  const assetId = item.logo?.asset?._id;
  const name = item.name?.trim();
  if (!item.logo || !assetId || !name) return null;

  return {
    id: item._id,
    name,
    logo: urlFor({
      ...item.logo,
      _type: "image",
      asset: { _type: "reference", _ref: assetId },
    } as SanityImageSource)
      .width(240)
      .auto("format")
      .url(),
  };
}

async function getLogos(type: "partner" | "communityPartner"): Promise<PartnerLogo[]> {
  try {
    const items = await client.fetch<SanityPartner[]>(
      PARTNER_QUERY,
      { type },
      { next: { revalidate: 3600 } },
    );
    return items.flatMap((item) => {
      const partner = mapPartner(item);
      return partner ? [partner] : [];
    });
  } catch (error) {
    console.error(`Failed to fetch ${type} logos`, error);
    return [];
  }
}

export function getPartners() {
  return getLogos("partner");
}

export function getCommunityPartners() {
  return getLogos("communityPartner");
}
