import D4ContactForm from "./connect";
import OrgSchema from "@/schema/org-schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | D4 Community",
  description: "Get in touch with the D4 Community team.", 
  alternates: {
    canonical: "https://www.d4community.com/contact",
  },
  openGraph: {
    title: "Contact D4 Community",
    description: "Get in touch with the D4 Community team.",
    url: "https://www.d4community.com/contact",
    siteName: "D4 Community",
    type: "website",
  },
};

export default function ContactPage() {
  // Complete data-map layout array structured from your primary sitemap routing configuration
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
      {/* Structural Schema Data */}
      <OrgSchema />
      
      {/* Visual Form Component */}
      <D4ContactForm />

      {/* Semantic Structural Link Matrix Container.
        'sr-only' isolates this markup structure block completely from graphic rendering viewports,
        enabling programmatic search crawlers to scan cross-route links cleanly.
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