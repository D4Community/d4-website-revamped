import TermsOfUse from "./terms";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | D4 Community",
  description: "Read the official D4 Community terms and conditions.",
  alternates: {
    canonical: "https://www.d4community.com/terms",
  },
  openGraph: {
    title: "D4 Community Terms of Use",
    description: "Read the official D4 Community terms and conditions.",
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