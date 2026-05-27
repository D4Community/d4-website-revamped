interface EventSchemaProps {
  event: {
    title: string;
    description: string;
    date: string;       // Used for startDate (Expects ISO format: YYYY-MM-DD)
    endDate?: string;   // Optional: clear the endDate warning
    location?: string;
    imageUrl?: string;
    registrationLink?: string;
    mode?: string; 
    performerName?: string; // Optional: clear the performer warning
  };
}

export default function EventSchema({ event }: EventSchemaProps) {
  // 1. CRITICAL GUARD: If event data is missing or incomplete, do not render broken schema
  if (!event || !event.title || !event.date) {
    return null;
  }

  const isVirtual = event.mode?.toLowerCase().includes("virtual") || false;
  
  // Parse start date
  const eventDate = new Date(event.date);
  const isValidDate = !isNaN(eventDate.getTime());

  if (!isValidDate) {
    console.warn(`EventSchema: Invalid startDate format for "${event.title}"`);
    return null; // Prevents "Date/time not in ISO 8601 format" error
  }

  const isPast = eventDate < new Date();

  // 2. FIX 'endDate': If missing, automatically fallback to 2 hours after startDate
  let endDateISO = event.endDate;
  if (!endDateISO) {
    const calculatedEndDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000); // +2 hours
    endDateISO = calculatedEndDate.toISOString();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description || "Join us for this community event hosted by D4 Community.",
    "startDate": eventDate.toISOString(), // Ensures strict ISO 8601 formatting
    "endDate": endDateISO,
    
    // 3. FIX 'image': Ensure it never defaults to an empty string
    "image": event.imageUrl && event.imageUrl.trim() !== "" 
      ? event.imageUrl 
      : "https://d4community.com/og-image.png",
      
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

    // 4. FIX 'offers': Formatted explicitly to keep GSC happy
    "offers": {
      "@type": "Offer",
      "url": event.registrationLink || "https://d4community.com",
      "price": "0",
      "priceCurrency": "INR",
      "availability": isPast ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "validFrom": eventDate.toISOString() // Clears the potential validFrom warning
    },

    // 5. FIX 'performer': Added to clear the performer warning
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