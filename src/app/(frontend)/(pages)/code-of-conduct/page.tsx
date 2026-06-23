import CodeOfConduct from "./coc";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code of Conduct | D4 Community",
  description: "The community rules and guidelines that keep our developer hub safe, inclusive, and open to all.",
  alternates: {
    canonical: "https://www.d4community.com/code-of-conduct",
  },
  openGraph: {
    title: "D4 Community Code of Conduct",
    description: "The community rules and guidelines that keep our developer hub safe, inclusive, and open to all.",
    url: "https://www.d4community.com/code-of-conduct",
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
      <CodeOfConduct />
      
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