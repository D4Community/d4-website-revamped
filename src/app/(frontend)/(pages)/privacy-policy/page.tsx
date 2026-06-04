import PrivacyPolicyPage from "./privacy-policy";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | D4 Community",
  description: "Read the official D4 Community privacy policy here.", 
  alternates: {
    canonical: "https://www.d4community.com/privacy-policy",
  },
  openGraph: {
    title: "D4 Community Privacy Policy",
    description: "Read the official D4 Community privacy policy here.",
    url: "https://www.d4community.com/privacy-policy",
    siteName: "D4 Community",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <OrgSchema />
      <PrivacyPolicyPage />
    </>
  );
}