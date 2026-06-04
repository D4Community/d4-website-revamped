import ReviewsPage from "./reviews";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews | D4 Community",
  description: "Read honest reviews and feedback about D4 Community.",
  alternates: {
    canonical: "https://www.d4community.com/reviews",
  },
  openGraph: {
    title: "D4 Community Reviews",
    description: "Read honest reviews and feedback about D4 Community.",
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