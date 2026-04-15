// import type { Metadata } from "next";
// import "./globals.css";
// import { SeoKeywords } from "@/components/SeoKeywords";

// export const metadata: Metadata = {
//   title: "D4 Community",
//   description: "D4 Community is a place where students, developers, and creators learn, build, grow, and connect together.",
//   // Verification property added here
//   verification: {
//     google: "Wu3T8_LbSp7nhwyj_x2DH2UuUteYBjTld-zudlNfv_8",
//   },
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className="antialiased" suppressHydrationWarning>
//         <SeoKeywords />
//         {children}
//       </body>
//     </html>
//   );
// }



import type { Metadata } from "next";
import "./globals.css";
import { SeoKeywords } from "@/components/SeoKeywords";

export const metadata: Metadata = {
  title: "D4 Community",
  description:
    "D4 Community is a place where students, developers, and creators learn, build, grow, and connect together.",
  verification: {
    google: "Wu3T8_LbSp7nhwyj_x2DH2UuUteYBjTld-zudlNfv_8",
  },
};

// JSON-LD structured data — tells Google exactly what D4 Community is,
// where it operates, and what events it runs. This powers Knowledge Panels
// and rich results directly in search.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://d4community.com/#organization",
      name: "D4 Community",
      alternateName: [
        "D4 Dev Community",
        "D4 Community India",
        "D4 Community North India",
      ],
      description:
        "D4 Community is India's largest and most active developer community for students, developers, and creators — home of Hack-N-Win, the second largest in-person 24-hour hackathon in India.",
      url: "https://d4community.com",
      sameAs: [
        "https://instagram.com/d4community",
        "https://twitter.com/d4community",
        "https://linkedin.com/company/d4community",
        "https://github.com/d4community",
      ],
      areaServed: [
        { "@type": "Country", name: "India" },
        { "@type": "State", name: "Punjab" },
        { "@type": "City", name: "Chandigarh" },
        { "@type": "City", name: "Ludhiana" },
        { "@type": "City", name: "Amritsar" },
      ],
      knowsAbout: [
        "Software Development",
        "Open Source",
        "Hackathons",
        "Web Development",
        "Student Developer Communities",
        "Tech Events India",
        "Developer Networking",
        "Tech Education",
        "Developer Growth",
        "Ayush Kumar Tiwari",
      ],
      keywords:
        "best developer community India, largest developer community India, biggest developer community India, best hackathon India, Hack-N-Win, D4 Community, biggest hackathon North India, second largest hackathon India, in-person hackathon India, student developer community India, biggest developer community Punjab, best developer community Chandigarh, best developer community Ludhiana, best developer community NCR, best developer community, largest developer community Punjab, largest developer community Chandigarh, largest developer community Ludhiana, largest developer community NCR, Ayush Kumar Tiwari, Ayush Tiwari, D4 Community founder, D4 Community organizer",
    },
    {
      "@type": "Event",
      "@id": "https://hacknwin.d4community.com/#event",
      name: "Hack-N-Win 3.0",
      description:
        "Hack-N-Win 3.0 is the second largest in-person 24-hour hackathon in India, organized by D4 Community. The biggest 24-hour hackathon under one roof in India, bringing together hundreds of student developers, designers, and innovators.",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      organizer: {
        "@type": "Organization",
        "@id": "https://d4community.com/#organization",
        name: "D4 Community",
      },
      location: {
        "@type": "Place",
        name: "North India",
        address: {
          "@type": "PostalAddress",
          addressRegion: "Punjab",
          addressCountry: "IN",
        },
      },
      url: "https://hacknwin.d4community.com",
      keywords:
        "hackathon India, 24 hour hackathon India, in-person hackathon India, second largest hackathon India, biggest hackathon North India, Hack-N-Win 3.0",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD structured data for Google Knowledge Panel + rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {/* SEO keyword layer — visually hidden, crawler-readable */}
        <SeoKeywords />
        {children}
      </body>
    </html>
  );
}