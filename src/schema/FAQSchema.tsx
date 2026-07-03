import { faqRegistry, FAQPageType } from "./faq-registry";

interface FAQSchemaProps {
  page: FAQPageType | FAQPageType[];
}

interface FAQItem {
  readonly question: string;
  readonly answer: string;
}

export default function FAQSchema({ page }: FAQSchemaProps) {
  const pageKeys = Array.isArray(page) ? page : [page];
  
  const combinedQuestions = pageKeys.flatMap(
    (key) => (faqRegistry[key] as readonly FAQItem[]) || []
  );

  if (combinedQuestions.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: combinedQuestions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      id={`faq-schema-${pageKeys.join("-")}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}