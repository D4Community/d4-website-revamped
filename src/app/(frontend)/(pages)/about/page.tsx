import AboutPage from "@/features/about/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | D4 Community",
  description: "Learn more about the D4 Community—a dedicated space for gamers and developers to collaborate, share builds, and master the world of Sanctuary.",
  alternates: {
    canonical: "https://d4community.com/about",
  },
  openGraph: {
    title: "About D4 Community",
    description: "Join the ultimate hub for D4 enthusiasts.",
    url: "https://d4community.com/about",
    siteName: "D4 Community",
    type: "website",
  },
};

export default AboutPage;