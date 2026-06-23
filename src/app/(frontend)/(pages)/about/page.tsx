import AboutPage from "@/features/about/page";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | D4 Community",
  description: "Discover North India's top developer community.", 
  alternates: {
    canonical: "https://www.d4community.com/about",
  },
  openGraph: {
    title: "About D4 Community",
    description: "Discover North India's top developer community.",
    url: "https://www.d4community.com/about",
    siteName: "D4 Community",
    type: "website",
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
      <AboutPage />
      
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