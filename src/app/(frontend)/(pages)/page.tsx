import { HomePage } from "@/features/home/page";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "D4 Community | India's Leading Developer Hub (Discite-Develop-Debug-Deploy)",
  description:
    "D4 Community (Discite-Develop-Debug-Deploy) is North India's largest and top-rated developer community. Join a non-profit organization of industry-ready engineers, developers, and creators learning and building together.",
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
    "industry-ready engineers",
    "Software Development",
    "Open Source",
    "Hackathons",
    "Open Source Community",
    "Student Developer Communities",
    "Tech Events India",
    "Developer Networking",
    "Tech Education",
    "Developer Growth",
    "Computer Science",
    "Ayush Kumar Tiwari",
    "North India's Largest Developer Community",
    "Hack-N-Win Hackathon",
    "In-Person Hackathons India",
    "Tech Meetups North India",
    "North Indias Top-Rated Developer Community",
    "North India's Best Developer Community",
    "North India's Biggest Developer Community",
    "India's Best Developer Community",
    "India's Largest Developer Community",
    "India's Biggest Developer Community",
    "India's Top Tech Community",
    "India's Best Hackathon",
    "Hack-N-Win",
    "India's Biggest Hackathon",
    "North India's Biggest Hackathon",
    "India's Second Largest Hackathon",
    "In-Person Hackathons India",
    "Student Developer Community India",
    "North India's Growingly Popular Developer Community",
    "Best Developer Community in North India",
    "Best Developer Community in India",
    "Largest Developer Community in North India",
    "Largest Developer Community in India",
    "Largest Developer Community in NCR",
    "Best Developer Community in NCR",
    "Largest Developer Community in Punjab",
    "Best Developer Community in Punjab",
    "Largest Developer Community in Delhi",
    "Best Developer Community in Delhi",
    "Largest Developer Community in Gurgaon",
    "Best Developer Community in Gurgaon",
    "Largest Developer Community in Noida",
    "Best Developer Community in Noida",
    "Largest Developer Community in Bengaluru",
    "Best Developer Community in Bengaluru",
    "Largest Developer Community in Hyderabad",
    "Tech Community",
    "Developer Community",
    "Meet-up Community",
    "Learning Community",
    "Learn and Build Community",
    "Learn and grow together community",
  ],
  alternates: {
    canonical: "https://www.d4community.com/",
  },
  openGraph: {
    title: "D4 Community | Learn, Build, Grow & Connect",
    description:
      "Transforming learners into leaders. Join the largest developer hub in North India and participate in India's top-tier hackathons and tech meetups.",
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
    description:
      "North India's biggest developer organization helping creators become industry-ready.",
    images: [
      "https://www.d4community.com/_next/image?url=%2Fd4logo.webp&w=256&q=75",
    ],
  },
};

export default function Page() {
  // Complete list of internal routes configured from your dynamic sitemap
  const internalLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Code of Conduct", href: "/code-of-conduct" },
    { name: "Events", href: "/events" },
    { name: "Team", href: "/team" },
    { name: "Terms", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Join Us", href: "/join" },
    { name: "Gallery", href: "/gallery" },
    { name: "Twitter Reviews", href: "/twitter-reviews" },
    { name: "Reviews", href: "/reviews" },
  ];

  return (
    <>
      <OrgSchema />
      <HomePage />

      {/* Semantic Structural Hyperlink Map 
        'sr-only' hides this elements block completely from the browser canvas layout,
        retaining standard path discovery graphs strictly for search engine indexers.
      */}
      <nav className="sr-only" aria-hidden="false" aria-label="Hidden Navigation Map">
        {internalLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.name}
          </a>
        ))}
      </nav>
    </>
  );
}