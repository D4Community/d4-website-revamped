import DetailedGalleryPage from "./gallery";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";
import { getGalleryImages } from "@/features/gallery/queries";

export const metadata: Metadata = {
  title: "D4 Community Gallery | Event Photos & Highlights",
  description:
    "Explore photos and highlights from D4 Community events, hackathons, meetups and workshops featuring developers, speakers and the community.",

  alternates: {
    canonical: "https://www.d4community.com/gallery",
  },

  openGraph: {
    title: "D4 Community Gallery | Event Photos & Highlights",
    description:
      "Explore photos and highlights from D4 Community events, hackathons, meetups and workshops featuring developers, speakers and the community.",
    url: "https://www.d4community.com/gallery",
    siteName: "D4 Community",
    type: "website",
    images: [
      {
        url: "https://www.d4community.com/d4logo.webp",
        width: 1200,
        height: 630,
        alt: "D4 Community Event Gallery",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "D4 Community Gallery | Event Photos & Highlights",
    description:
      "See photos and highlights from D4 Community events, hackathons, meetups and workshops.",
    images: ["https://www.d4community.com/d4logo.webp"],
  },

  keywords: [
    "D4 Community Gallery",
    "D4 Community photos",
    "D4 Community events photos",
    "D4 Community event gallery",
    "developer community events photos",
    "developer meetup photos",
    "hackathon photos India",
    "developer events India",
    "tech events Chandigarh",
    "developer events Chandigarh",
    "D4 Community hackathons",
    "Hack-N-Win photos",
    "GenAI Conclave photos",
    "D4 Community events",
  ],
};

export default async function Page() {
  const images = await getGalleryImages();

  return (
    <>
      <OrgSchema />
      <DetailedGalleryPage images={images} />
    </>
  );
}