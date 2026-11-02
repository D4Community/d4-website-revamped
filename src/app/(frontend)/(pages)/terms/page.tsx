import Terms from "./terms";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "D4 Community Public Terms & Conditions",

  description:
    "Read the public Terms & Conditions governing use of the D4 Community website, participation in events and engagement with official community activities.",

  alternates: {
    canonical: "https://www.d4community.com/terms",
  },

  openGraph: {
    title: "D4 Community Public Terms & Conditions",
    description:
      "Read the public Terms & Conditions governing use of the D4 Community website, participation in events and engagement with official community activities.",
    url: "https://www.d4community.com/terms",
    siteName: "D4 Community",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "D4 Community Public Terms & Conditions",
    description:
      "Read the public Terms & Conditions governing use of the D4 Community website, participation in events and engagement with official community activities.",
  },

  keywords: [
    "D4 Community Public Terms & Conditions",
    "D4 Community Terms and Conditions",
    "D4 Community terms",
    "D4 Community agreement",
    "D4 Community rules",
    "D4 Community website terms",
    "D4 Community policies",
  ],
};

export default function Page() {
  return (
    <>
      <OrgSchema />
      <Terms />
    </>
  );
}
