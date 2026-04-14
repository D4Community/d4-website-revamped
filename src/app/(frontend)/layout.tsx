import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
// import { CursorClickEffect } from "@/components/ui/cursor-click-effect";
import { CTASection } from "@/components/layout/CTASection";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {/* <CursorClickEffect /> */}
        <Header />
        <main className="relative z-10 bg-background">
          {children}
          <CTASection />
        </main>
        <Footer />
    </ThemeProvider>
  );
}
