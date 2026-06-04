import JoinCommunityPage from "./join";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Us | D4 Community",
  description: "Join North India's largest developer community today.",
  alternates: {
    canonical: "https://www.d4community.com/join",
  },
  openGraph: {
    title: "Join the D4 Community",
    description: "Join North India's largest developer community today.",
    url: "https://www.d4community.com/join",
    siteName: "D4 Community",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <OrgSchema />
      <JoinCommunityPage />
    </>
  );
}