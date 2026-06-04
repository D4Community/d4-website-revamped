import TwitterReviewsPage from "./twitter-reviews";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Twitter Reviews | D4 Community",
  description: "See what developers are saying about us on Twitter.",
  alternates: {
    canonical: "https://www.d4community.com/twitter-reviews",
  },
  openGraph: {
    title: "D4 Community Twitter Reviews",
    description: "See what developers are saying about us on Twitter.",
    url: "https://www.d4community.com/twitter-reviews",
    siteName: "D4 Community",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <OrgSchema />
      <TwitterReviewsPage />
    </>
  );
}