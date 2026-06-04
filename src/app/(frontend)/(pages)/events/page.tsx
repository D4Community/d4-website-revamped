import EventsPage from "@/features/events/page";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Events | D4 Community",
  description: "Explore upcoming tech hackathons and developer events.", 
  alternates: {
    canonical: "https://www.d4community.com/events",
  },
  openGraph: {
    title: "D4 Community Events & Hackathons",
    description: "Explore upcoming tech hackathons and developer events.",
    url: "https://www.d4community.com/events",
    siteName: "D4 Community",
    type: "website",
  },
};

export default function Page() {
  return (
    <>
      <OrgSchema />
      <EventsPage />
    </>
  );
}