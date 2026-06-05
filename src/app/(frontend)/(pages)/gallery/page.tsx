import DetailedGalleryPage from "./gallery";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "D4 Community Gallery | Event Photos & Highlights", 
  description: "Explore our D4 Community photo gallery and events.",
  alternates: {
    canonical: "https://www.d4community.com/gallery",
  },
  openGraph: {
    title: "D4 Community Gallery | Event Photos & Highlights",
    description: "Explore our D4 Community photo gallery and events.",
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