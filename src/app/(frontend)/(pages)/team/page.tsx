import TeamPage from "@/features/team/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meet the Team | D4 Community",
  description: "Meet the creators, moderators, and contributors behind the D4 Community. Discover the passionate team dedicated to building the best hub for Sanctuary adventurers.",
  alternates: {
    canonical: "https://d4community.com/team",
  },
  openGraph: {
    title: "The D4 Community Team",
    description: "Get to know the experts and enthusiasts who keep the D4 Community running.",
    url: "https://d4community.com/team",
    siteName: "D4 Community",
    type: "website",
  },
};

export default TeamPage;