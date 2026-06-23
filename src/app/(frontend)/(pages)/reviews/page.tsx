import ReviewsPage from "./reviews";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "D4 Community Reviews | What Our Members Say",
  description: "Read genuine reviews from the D4 Community members.",
  alternates: {
    canonical: "https://www.d4community.com/reviews",
  },
  openGraph: {
    title: "D4 Community Reviews | What Our Members Say",
    description: "Read genuine reviews from the D4 Community members.",
    url: "https://www.d4community.com/reviews",
    siteName: "D4 Community",
    type: "website",
  },
};

export default function Page() {
  // Complete list of internal routes pulled from your dynamic sitemap config
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
      <ReviewsPage />
      
      {/* Semantic HTML layout structure. 
        'sr-only' keeps these hyperlinks hidden on all screen sizes,
        ensuring search spider crawlers can index the full site graph silently.
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