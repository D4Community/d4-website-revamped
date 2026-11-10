import type { Metadata } from "next";
import { HostEventForm } from "@/features/host-event/HostEventForm";

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
  return <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <header className="mx-auto mb-9 max-w-3xl text-center">
      <p className="text-sm font-semibold text-primary">Host a D4 Event</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Bring D4 Community to your campus or organization</h1>
      <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Tell us about your idea. Our team will review your expression of interest and get in touch if there’s a fit.</p>
      <ul className="mt-5 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground"><li className="rounded-full border border-border px-3 py-2">About 5–8 minutes</li><li className="rounded-full border border-border px-3 py-2">Expression of interest, not a booking</li><li className="rounded-full border border-border px-3 py-2">We reply if there’s a fit</li></ul>
    </header>
    <div className="mx-auto max-w-3xl"><HostEventForm /></div>
  </main>;
}
