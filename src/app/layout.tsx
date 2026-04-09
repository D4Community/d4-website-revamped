import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "D4 Community",
  description: "The official website for the D4 Community.",
  // Verification property added here
  verification: {
    google: "Wu3T8_LbSp7nhwyj_x2DH2UuUteYBjTld-zudlNfv_8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}