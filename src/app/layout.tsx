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



// app/layout.tsx

import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { SeoKeywords } from "@/components/SeoKeywords";
import OrgSchema from "@/schema/org-schema";

export const metadata: Metadata = {
  title: "D4 Community | India's Leading Developer Hub",
  description:
    "D4 Community (Discite-Develop-Debug-Deploy) is India's largest and most active developer community for students, developers, and creators — home of Hack-N-Win, the second largest in-person 24-hour hackathon in India.",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  // We keep all your high-value SEO keywords right here in the native HTML tags where Google expects them
  keywords: [
    "best developer community India", 
    "largest developer community India", 
    "biggest developer community India", 
    "best hackathon India", 
    "Hack-N-Win", 
    "D4 Community", 
    "biggest hackathon North India", 
    "second largest hackathon India", 
    "in-person hackathon India", 
    "student developer community India", 
    "Ayush Kumar Tiwari", 
    "D4 Community founder"
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* This component handles your structural data perfectly without duplicates */}
        <OrgSchema />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <SeoKeywords />
        {children}
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}