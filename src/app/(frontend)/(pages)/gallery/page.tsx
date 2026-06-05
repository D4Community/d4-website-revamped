import DetailedGalleryPage from "./gallery";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | D4 Community",
  description: "Browse photos from our events, meetups, and hackathons.",
  alternates: {
    canonical: "https://www.d4community.com/gallery",
  },
  openGraph: {
    title: "D4 Community Gallery",
    description: "Browse photos from our events, meetups, and hackathons.",
    url: "https://www.d4community.com/gallery",
    siteName: "D4 Community",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <OrgSchema />
      <DetailedGalleryPage />
    </>
  );
}