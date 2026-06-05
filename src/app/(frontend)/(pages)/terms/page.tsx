import TermsOfUse from "./terms";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "D4 Community Terms of Use | Guidelines & Agreement",
  description: "Understand the rules for joining the D4 Community.",
  alternates: {
    canonical: "https://www.d4community.com/terms",
  },
  openGraph: {
    title: "D4 Community Terms of Use | Guidelines & Agreement",
    description: "Understand the rules for joining the D4 Community.",
    url: "https://www.d4community.com/terms",
    siteName: "D4 Community",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <OrgSchema />
      <TermsOfUse />
    </>
  );
}