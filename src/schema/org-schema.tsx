// app/schema/org-schema.tsx

export default function OrgSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.d4community.com/#organization",
    "name": "D4 Community",
    "alternateName": [
      "Discite-Develop-Debug-Deploy",
      "D4",
      "D4 Dev Community",
      "D4 Community India",
      "D4 Community North India",
      "D4 Team",
      "Team D4",
      "Community D4",
      "Community"
    ],
    "url": "https://www.d4community.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.d4community.com/_next/image?url=%2Fd4logo.webp&w=256&q=75",
      "width": 256,
      "height": 256
    },
    // Merged your exact rich text description detailing Hack-N-Win
    "description": "D4 Community (Discite-Develop-Debug-Deploy) is India's largest and most active developer community for students, developers, and creators — home of Hack-N-Win, the second largest in-person 24-hour hackathon in India.",
    "foundingCountry": "IN",
    "founder": {
      "@type": "Person",
      "name": "Ayush Kumar Tiwari"
    },
    // All your requested tech target hubs + states + NCR explicitly declared
    "areaServed": [
      { "@type": "Country", "name": "India" },
      { "@type": "AdministrativeArea", "name": "National Capital Region (NCR)" },
      { "@type": "State", "name": "Punjab" },
      { "@type": "City", "name": "Delhi" },
      { "@type": "City", "name": "Gurgaon" },
      { "@type": "City", "name": "Noida" },
      { "@type": "City", "name": "Bengaluru" },
      { "@type": "City", "name": "Hyderabad" },
      { "@type": "City", "name": "Pune" },
      { "@type": "City", "name": "Mumbai" },
      { "@type": "City", "name": "Chennai" },
      { "@type": "City", "name": "Chandigarh" },
      { "@type": "City", "name": "Jalandhar" },
      { "@type": "City", "name": "Ludhiana" },
      { "@type": "City", "name": "Amritsar" }
    ],
    "knowsAbout": [
      "Software Development",
      "Open Source",
      "Hackathons",
      "Web Development",
      "Student Developer Communities",
      "Tech Events India",
      "Developer Networking",
      "Tech Education",
      "Developer Growth",
      "Computer Science",
      "Ayush Kumar Tiwari"
    ],
    "sameAs": [
      "https://www.instagram.com/d4community",
      "https://x.com/d4community",
      "https://www.linkedin.com/company/d4community",
      "https://github.com/d4community"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Community Support",
        "availableLanguage": ["English", "Hindi"],
        "areaServed": "IN"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    }
  };

  return (
    <script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}