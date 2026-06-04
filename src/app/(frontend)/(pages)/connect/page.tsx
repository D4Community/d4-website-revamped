import D4ContactForm from "./connect";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | D4 Community",
  description: "Get in touch with the D4 Community team.", 
  alternates: {
    canonical: "https://www.d4community.com/contact",
  },
  openGraph: {
    title: "Contact D4 Community",
    description: "Get in touch with the D4 Community team.",
    url: "https://www.d4community.com/contact",
    siteName: "D4 Community",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Structural Schema Data */}
      <OrgSchema />
      
      {/* Visual Form Component */}
      <D4ContactForm />
    </>
  );
}