import EventsPage from "@/features/events/page";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "D4 Community Events | Hackathons & Tech Meetups", 
  description: "Join our tech hackathons, developer meetups, and more.", 
  alternates: {
    canonical: "https://www.d4community.com/events",
  },
  openGraph: {
    title: "D4 Community Events | Hackathons & Tech Meetups",
    description: "Join our tech hackathons, developer meetups, and more.",
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