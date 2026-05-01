import ContactPage from "@/features/contact/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | D4 Community",
  description: "Have questions or feedback? Get in touch with the D4 Community team. We're here to help with support, partnerships, and community inquiries.",
  alternates: {
    canonical: "https://d4community.com/contact",
  },
  openGraph: {
    title: "Contact D4 Community",
    description: "Reach out to the D4 Community team for support and inquiries.",
    url: "https://d4community.com/contact",
    siteName: "D4 Community",
    type: "website",
  },
};

export default ContactPage;