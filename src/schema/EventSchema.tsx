interface EventSchemaProps {
  event: {
    title: string;
    description: string;
    date: string;       // Used for startDate (Expects ISO format)
    endDate?: string;   // Optional ISO string
    location?: string;
    imageUrl?: string;
    registrationLink?: string;
    mode?: string; 
    performerName?: string;
  };
}

export default function EventSchema({ event }: EventSchemaProps) {
  // 1. CRITICAL GUARD: Stop immediately if essential metadata parameters are absent
  if (!event || !event.title || !event.date) {
    return null;
  }

  const isVirtual = event.mode?.toLowerCase().includes("virtual") || false;
  
  // Safe ISO Date extraction
  const eventDate = new Date(event.date);
  const isValidDate = !isNaN(eventDate.getTime());

  if (!isValidDate) {
    return null; // Suppresses "Date/time not in ISO 8601 format" issues cleanly
  }

  const isPast = eventDate < new Date();

  // 2. FIX 'endDate': Fallback cleanly to +2 hours later if parameter is blank
  let endDateISO = event.endDate;
  if (!endDateISO || isNaN(Date.parse(endDateISO))) {
    const calculatedEndDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);
    endDateISO = calculatedEndDate.toISOString();
  } else {
    endDateISO = new Date(endDateISO).toISOString();
  }

  // 3. FIX 'image': Absolute path fallbacks avoid missing warning issues
  const fallbackImg = "https://d4community.com/og-image.png"; 
  const schemaImage = event.imageUrl && event.imageUrl.trim() !== "" && !event.imageUrl.startsWith("data:")
    ? event.imageUrl
    : fallbackImg;

  const eventUrl = event.registrationLink || "https://d4community.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description || "Join us for this community event hosted by D4 Community.",
    "startDate": eventDate.toISOString(), 
    "endDate": endDateISO,
    "image": schemaImage,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": isVirtual 
      ? "https://schema.org/OnlineEventAttendanceMode" 
      : "https://schema.org/OfflineEventAttendanceMode",
    
    "location": isVirtual ? {
      "@type": "VirtualLocation",
      "url": eventUrl
    } : {
      "@type": "Place",
      "name": event.location || "TBD",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": event.location || "Multiple Locations",
      }
    },

    // 4. FIX 'offers' & 'validFrom': Fully established free pricing layout
    "offers": {
      "@type": "Offer",
      "url": eventUrl,
      "price": "0",
      "priceCurrency": "INR",
      "availability": isPast ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "validFrom": new Date(eventDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString() // Set to 30 days prior
    },

    // 5. FIX 'performer': Structured clearly to clear warnings completely
    "performer": {
      "@type": "Organization",
      "name": event.performerName || "D4 Community",
      "url": "https://d4community.com"
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