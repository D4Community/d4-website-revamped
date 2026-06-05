import PrivacyPolicyPage from "./privacy-policy";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "D4 Community Privacy Policy | Data Safety & Terms",
  description: "Learn how the D4 Community protects your data privacy.",
  alternates: {
    canonical: "https://www.d4community.com/privacy-policy",
  },
  openGraph: {
    title: "D4 Community Privacy Policy | Data Safety & Terms",
    description: "Learn how the D4 Community protects your data privacy.",
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