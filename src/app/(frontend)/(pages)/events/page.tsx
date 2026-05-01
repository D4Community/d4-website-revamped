import EventsPage from "@/features/events/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Events | D4 Community",
  description: "Stay up to date with the latest D4 Community events, tournaments, and world boss rallies. Join our scheduled sessions and compete with the best.",
  alternates: {
    canonical: "https://d4community.com/events",
  },
  openGraph: {
    title: "D4 Community Events & Tournaments",
    description: "Join the next D4 Community event! From world boss hunts to competitive tournaments, find your next challenge here.",
    url: "https://d4community.com/events",
    siteName: "D4 Community",
    type: "website",
  },
};

export default EventsPage;