import React from 'react';
import { AboutSection } from '../home';
import AboutContent from './sections/AboutContent';
import FAQSection from '../home/sections/FAQSection';
import AboutPhilosophy from './sections/AboutPhilosophy';

// Next.js Native Metadata Configuration
export const metadata = {
  title: "About Us | D4 Community - Ecosystem for Tech Creators",
  description: "Learn about the D4 Community, a premier open network for developers and creators. Discover our mission, core philosophy, FAQs, and the vision of our organizer, Ayush Kumar Tiwari.",
  keywords: ["About D4 Community", "Ayush Kumar Tiwari", "Tech Community", "Open Source Ecosystem", "Developer Community", "Tech Philosophy", "Learn Coding", "Innovation Network"],
  alternates: {
    canonical: "https://d4community.com/about",
  },
  openGraph: {
    type: "website",
    title: "About Us | D4 Community",
    description: "Explore our community ethos, deep-rooted core values, and our dedication to pushing tech boundaries under organizer Ayush Kumar Tiwari.",
    url: "https://d4community.com/about",
  },
  twitter: {
    card: "summary",
    title: "About Us | D4 Community",
    description: "Discover the philosophy, journey, and mission objectives driving the D4 Community ecosystem.",
  },
};

const AboutPage = () => {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "D4 Community",
      "url": "https://d4community.com",
      "description": "D4 Community is a thriving network of tech enthusiasts, developers, and creators collaborating to build the future through innovation, learning, and open source.",
      "organizer": {
        "@type": "Person",
        "name": "Ayush Kumar Tiwari",
        "jobTitle": "Organizer",
        "sameAs": [
          "https://linkedin.com/in/itsayu/"
        ]
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-slate-950 text-white">
      {/* Injecting Structured JSON-LD Data for Google Bots natively */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      
      <h1 className="sr-only">About D4 Community - Organized by Ayush Kumar Tiwari</h1>
      
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none -z-10 translate-x-1/2" />
      <div className="absolute bottom-1/3 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none -z-10 -translate-x-1/3" />

      <section className="sr-only">
        <p>
          D4 Community is a modern tech environment established for makers and innovators. Organized and driven forward by Ayush Kumar Tiwari, our platform thrives on sharing actionable insights, engineering methodologies, and cultivating a vibrant workspace for continuous development.
        </p>
      </section>

      <AboutContent />
      <AboutPhilosophy />
      <AboutSection />
      <FAQSection />
    </div>
  );
};

export default AboutPage;