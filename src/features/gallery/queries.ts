import type { SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  width: number;
  height: number;
};

type SanityGalleryItem = {
  _id: string;
  title?: string | null;
  description?: string | null;
  image?: {
    alt?: string | null;
    hotspot?: Record<string, unknown> | null;
    crop?: Record<string, unknown> | null;
    asset?: {
      _id?: string;
      metadata?: { dimensions?: { width?: number; height?: number } };
    } | null;
  } | null;
};

const GALLERY_QUERY = `*[_type == "gallery" && isPublishedOnSite == true && defined(image.asset)] | order(sortOrder asc) {
  _id,
  title,
  description,
  image{
    alt,
    hotspot,
    crop,
    asset->{
      _id,
      metadata{ dimensions{ width, height } }
    }
  }
}`;

function mapItem(item: SanityGalleryItem): GalleryImage | null {
  const assetId = item.image?.asset?._id;
  if (!item.image || !assetId) return null;

  const title = item.title?.trim() || "Untitled";
  const width = item.image.asset?.metadata?.dimensions?.width || 1200;
  const height = item.image.asset?.metadata?.dimensions?.height || 800;

  return {
    id: item._id,
    src: urlFor({
      ...item.image,
      _type: "image",
      asset: { _type: "reference", _ref: assetId },
    } as SanityImageSource)
      .width(1600)
      .auto("format")
      .url(),
    alt: item.image.alt?.trim() || title,
    title,
    description: item.description?.trim() || "",
    width,
    height,
  };
}

export async function getGalleryImages(limit?: number): Promise<GalleryImage[]> {
  try {
    const items = await client.fetch<SanityGalleryItem[]>(
      GALLERY_QUERY,
      {},
      { next: { revalidate: 3600 } },
    );
    const images = items.flatMap((item) => {
      const image = mapItem(item);
      return image ? [image] : [];
    });
    return typeof limit === "number" ? images.slice(0, limit) : images;
  } catch (error) {
    console.error("Failed to fetch gallery images", error);
    return [];
  }
}
