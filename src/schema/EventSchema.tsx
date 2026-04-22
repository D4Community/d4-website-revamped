interface EventSchemaProps {
  event: {
    title: string;
    description: string;
    date: string; 
    location?: string;
    imageUrl?: string;
    registrationLink?: string;
    mode?: string; 
  };
}

export default function EventSchema({ event }: EventSchemaProps) {
  const isVirtual = event.mode?.toLowerCase().includes("virtual") || false;
  
  // Create a Date object to check if it's in the past
  const eventDate = new Date(event.date);
  const isPast = !isNaN(eventDate.getTime()) && eventDate < new Date();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "startDate": event.date,
    "image": event.imageUrl || "https://d4community.com/og-image.png",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": isVirtual 
      ? "https://schema.org/OnlineEventAttendanceMode" 
      : "https://schema.org/OfflineEventAttendanceMode",
    "location": isVirtual ? {
      "@type": "VirtualLocation",
      "url": event.registrationLink || "https://d4community.com"
    } : {
      "@type": "Place",
      "name": event.location || "TBD",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": event.location || "Multiple Locations",
      }
    },
    "offers": {
      "@type": "Offer",
      "url": event.registrationLink || "https://d4community.com",
      "price": "0",
      "priceCurrency": "INR",
      "availability": isPast ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
    },
    "organizer": {
      "@type": "Organization",
      "name": "D4 Community",
      "url": "https://d4community.com"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}