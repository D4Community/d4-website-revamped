import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { CursorClickEffect } from "@/components/ui/cursor-click-effect";
import { CTASection } from "@/components/layout/CTASection";

export const metadata: Metadata = {
  title: "D4 Community",
  description: "The official website for the D4 Community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          
        >
          <CursorClickEffect />
          <Header />
          <main className="relative z-10 bg-background">
            {children}
            <CTASection />
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
