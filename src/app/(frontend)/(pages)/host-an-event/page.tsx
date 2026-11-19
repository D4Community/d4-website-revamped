import type { Metadata } from "next";
import { HostEventForm } from "@/features/host-event/HostEventForm";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { BoxedWord } from "@/components/ui/layout-text-flip";

const title = "Host a D4 Event | D4 Community";
const description = "Share your interest in hosting a D4 Community developer meetup, workshop, hackathon, or community event at your campus or organization.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://www.d4community.com/host-an-event" },
  openGraph: { title, description, url: "https://www.d4community.com/host-an-event", siteName: "D4 Community", type: "website", locale: "en_IN", images: [{ url: "https://www.d4community.com/d4logo.webp", width: 1200, height: 630, alt: "D4 Community" }] },
  twitter: { card: "summary_large_image", title, description, images: ["https://www.d4community.com/d4logo.webp"] },
};

export default function HostAnEventPage() {
  return <main className="relative isolate overflow-hidden">
    <BackgroundRippleEffect rows={90} cols={32} cellSize={48} interactive={false} borderColor="var(--border)" fillColor="var(--background)" borderStyle="dashed" cellOpacity={0.75} />
    <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <header className="mb-10 max-w-4xl">
        <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-tight">Bring D4 to your <BoxedWord className="border-2 border-foreground px-3 py-1 text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-tight shadow-[4px_4px_0_var(--border)]">campus</BoxedWord>.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Tell us what you&apos;d like to organise. We read every request and reply if it&apos;s a fit.</p>
        <ul className="mt-8 grid border-y border-dashed border-border sm:grid-cols-3">
          <li className="border-b border-dashed border-border py-3 text-sm sm:border-b-0 sm:border-r sm:pr-4">5–8 minutes to complete</li>
          <li className="border-b border-dashed border-border py-3 text-sm sm:border-b-0 sm:px-4 sm:border-r">An expression of interest, not a booking</li>
          <li className="py-3 text-sm sm:pl-4">We reply if there&apos;s a fit</li>
        </ul>
      </header>
      <HostEventForm />
    </div>
  </main>;
}
