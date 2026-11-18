import TeamPage from "@/features/team/page";
import OrgSchema from "@/schema/org-schema";
import TeamSchema from "@/schema/TeamSchema";
import { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "D4 Community Team | Meet the People Behind D4",

  description:
    "Meet the people behind D4 Community - developers and community builders creating spaces to learn, build, share and connect.",

  alternates: {
    canonical: "https://www.d4community.com/team",
  },

  openGraph: {
    title: "D4 Community Team | Meet the People Behind D4",
    description:
      "Meet the people behind D4 Community - developers and community builders creating spaces to learn, build, share and connect.",
    url: "https://www.d4community.com/team",
    siteName: "D4 Community",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.d4community.com/d4logo.webp",
        width: 1200,
        height: 630,
        alt: "D4 Community Team",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "D4 Community Team | Meet the People Behind D4",
    description:
      "Meet the developers and community builders behind D4 Community.",
    images: ["https://www.d4community.com/d4logo.webp"],
  },

  keywords: [
    "D4 Community Team",
    "D4 Community",
    "D4 Community organizers",
    "D4 Community volunteers",
    "D4 Community leadership",
    "D4 Community developers",
    "developer community organizers",
    "developer community team India",
    "tech community organizers India",
    "D4 Community Chandigarh",
    "D4 Community Punjab",
    "D4 Community events",
    "Hack-N-Win organizers",
    "Hack-N-Win",
    "GenAI Conclave organizers",
    "GenAI Conclave",
    "GenAI Conclave Chandigarh",
    "Discite Develop Debug Deploy",
  ],
};

export default function Page() {
  return (
    <>
      <OrgSchema />
      <TeamSchema />
      <TeamPage />
    </>
  );
}