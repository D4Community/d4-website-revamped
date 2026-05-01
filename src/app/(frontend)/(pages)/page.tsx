import { HomePage } from "@/features/home/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "D4 Community | India's Leading Developer Hub (Discite-Develop-Debug-Deploy)",
  description: "D4 Community (Discite-Develop-Debug-Deploy) is North India's largest and top-rated developer community. Join a non-profit organization of industry-ready engineers, developers, and creators learning and building together.",
  keywords: [
    "D4 Community", 
    "Discite Develop Debug Deploy", 
    "North India largest community", 
    "best developer community in India", 
    "top tech community North India", 
    "Ayush Kumar Tiwari", 
    "developer hackathons India", 
    "India second largest hackathon", 
    "D4 community meetups",
    "industry-ready engineers"
  ],
  alternates: {
    canonical: "https://www.d4community.com/",
  },
  openGraph: {
    title: "D4 Community | Learn, Build, Grow & Connect",
    description: "Transforming learners into leaders. Join the largest developer hub in North India and participate in India's top-tier hackathons and tech meetups.",
    url: "https://www.d4community.com/",
    siteName: "D4 Community",
    images: [
      {
        url: "https://www.d4community.com/_next/image?url=%2Fd4logo.webp&w=256&q=75",
        width: 256,
        height: 256,
        alt: "D4 Community Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "D4 Community | Discite-Develop-Debug-Deploy",
    description: "North India's biggest developer organization helping creators become industry-ready.",
    images: ["https://www.d4community.com/_next/image?url=%2Fd4logo.webp&w=256&q=75"],
  },
};

export default HomePage;