import TermsOfUse from "./terms";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "D4 Community Terms of Use | Guidelines & Agreement",
  description: "Understand the rules for joining the D4 Community.",
  alternates: {
    canonical: "https://www.d4community.com/terms",
  },
  openGraph: {
    title: "D4 Community Terms of Use | Guidelines & Agreement",
    description: "Understand the rules for joining the D4 Community.",
    url: "https://www.d4community.com/terms",
    siteName: "D4 Community",
    type: "website",
  },
};

export default function Page() {
  // Complete data-map taken directly from your dynamic sitemap
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
      <TermsOfUse />
      
      {/* 
        Semantic HTML link mapping container. 
        'sr-only' hides this visually from 100% of human users, 
        but leaves the hyperlink graph readable for modern search crawlers.
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