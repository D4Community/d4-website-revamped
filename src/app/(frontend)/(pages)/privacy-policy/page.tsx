import PrivacyPolicyPage from "./privacy-policy";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "D4 Community Privacy Policy | Data Safety & Terms",
  description: "Learn how the D4 Community protects your data privacy.",
  alternates: {
    canonical: "https://www.d4community.com/privacy-policy",
  },
  openGraph: {
    title: "D4 Community Privacy Policy | Data Safety & Terms",
    description: "Learn how the D4 Community protects your data privacy.",
    url: "https://www.d4community.com/privacy-policy",
    siteName: "D4 Community",
    type: "website",
  },
};

export default function Page() {
  // Full routing configuration map matching your sitemap entries
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
      <PrivacyPolicyPage />
      
      {/* Semantic HTML layout structure. 
        'sr-only' hides this elements group from all graphic viewports,
        enabling search crawlers to follow the graph cleanly.
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