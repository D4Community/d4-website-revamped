import AboutPage from "@/features/about/page";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | D4 Community",
  description: "Discover North India's top developer community.", 
  alternates: {
    canonical: "https://www.d4community.com/about",
  },
  openGraph: {
    title: "About D4 Community",
    description: "Discover North India's top developer community.",
    url: "https://www.d4community.com/about",
    siteName: "D4 Community",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <OrgSchema />
      <AboutPage />
    </>
  );
}