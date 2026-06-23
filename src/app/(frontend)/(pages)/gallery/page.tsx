import DetailedGalleryPage from "./gallery";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "D4 Community Gallery | Event Photos & Highlights", 
  description: "Explore our D4 Community photo gallery and events.",
  alternates: {
    canonical: "https://www.d4community.com/gallery",
  },
  openGraph: {
    title: "D4 Community Gallery | Event Photos & Highlights",
    description: "Explore our D4 Community photo gallery and events.",
    url: "https://www.d4community.com/gallery",
    siteName: "D4 Community",
    type: "website",
  },
};

export default function Page() {
  // Full routing configuration map derived from your dynamic sitemap
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
      <DetailedGalleryPage />
      
      {/* Semantic Crawling Hook. 
        Hides completely visually, preserving your pristine layouts 
        while maximizing link discovery for Google search bots.
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