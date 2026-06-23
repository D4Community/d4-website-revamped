import TwitterReviewsPage from "./twitter-reviews";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Twitter Reviews | D4 Community",
  description: "See what developers are saying about us on Twitter.",
  alternates: {
    canonical: "https://www.d4community.com/twitter-reviews",
  },
  openGraph: {
    title: "D4 Community Twitter Reviews",
    description: "See what developers are saying about us on Twitter.",
    url: "https://www.d4community.com/twitter-reviews",
    siteName: "D4 Community",
    type: "website",
  },
};

export default function Page() {
  // Complete data-map configuration pulled from your dynamic sitemap routing array
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
      <TwitterReviewsPage />
      
      {/* Semantic Link Map 
        'sr-only' hides this elements block completely from human viewport browsers,
        retaining standard navigation paths for search crawl indexing.
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