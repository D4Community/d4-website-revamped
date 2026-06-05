import ReviewsPage from "./reviews";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "D4 Community Reviews | What Our Members Say",
  description: "Read genuine reviews from the D4 Community members.",
  alternates: {
    canonical: "https://www.d4community.com/reviews",
  },
  openGraph: {
    title: "D4 Community Reviews | What Our Members Say",
    description: "Read genuine reviews from the D4 Community members.",
    url: "https://www.d4community.com/reviews",
    siteName: "D4 Community",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <OrgSchema />
      <ReviewsPage />
    </>
  );
}