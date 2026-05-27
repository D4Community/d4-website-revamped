import React from 'react';
import { EventsHero } from "./EventsHero";
import { UpcomingEvents } from "../home/sections/UpcomingEvents";
import { EventCarousel } from "../home/sections/EventCarousel";

// Next.js Native Metadata Configuration
export const metadata = {
  title: "Upcoming Tech Events & Hackathons | D4 Community",
  description: "Explore upcoming and past tech events, coding hackathons, and developer workshops hosted by D4 Community. Join our ecosystem to learn, network, and build.",
  keywords: ["D4 Community events", "tech hackathons", "developer workshops", "coding bootcamps", "programming meetups", "upcoming tech events", "open source meetups"],
  alternates: {
    canonical: "https://d4community.com/events",
  },
  openGraph: {
    type: "website",
    title: "Upcoming Tech Events & Hackathons | D4 Community",
    description: "Discover interactive workshops, global hackathons, and local community meetups. Secure your spot at the next D4 Community event.",
    url: "https://d4community.com/events",
  },
  twitter: {
    card: "summary",
    title: "Upcoming Tech Events & Hackathons | D4 Community",
    description: "Join the next D4 Community event. Explore workshops, tech talks, and collaborative hackathons designed for developers.",
  }
};

const EventsPage = () => {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "D4 Community Tech Events & Hackathons",
    "description": "Browse upcoming and past developer events, coding hackathons, and technical workshops hosted by D4 Community.",
    "url": "https://d4community.com/events",
    "publisher": {
      "@type": "Organization",
      "name": "D4 Community",
      "url": "https://d4community.com"
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-slate-950 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <h1 className="sr-only">D4 Community Tech Events, Hackathons, and Workshops</h1>

      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none -z-10 -translate-x-1/2" />
      <div className="absolute bottom-1/3 right-0 w-[600px] h-[600px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none -z-10 translate-x-1/3" />

      <section className="sr-only">
        <p>
          Welcome to the official events hub of the D4 Community. Our platform aggregates upcoming developer meetups, engineering hackathons, open-source sprints, and live programming workshops aimed at accelerating technical skills and network building.
        </p>
      </section>

      <EventsHero />
      <div id="UpcomingEvents">
        <UpcomingEvents />
      </div>
      <EventCarousel />
    </div>
  );
};

export default EventsPage;