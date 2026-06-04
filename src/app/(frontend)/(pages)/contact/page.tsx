import ContactPage from "@/features/contact/page";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | D4 Community",
  description: "Get in touch with the D4 Community team for support.",
  alternates: {
    canonical: "https://www.d4community.com/contact",
  },
  openGraph: {
    title: "Contact D4 Community",
    description: "Get in touch with the D4 Community team for support.",
    url: "https://www.d4community.com/contact",
    siteName: "D4 Community",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <OrgSchema />
      <ContactPage />
    </>
  );
}