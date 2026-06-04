export interface EventSchemaData {
  name: string;
  description: string;
  startDate: string; 
  endDate?: string;
  locationName: string;
  locationAddress?: string;
  url: string;
  imageUrl?: string;
  eventType?: "online" | "offline";
}

// ─── Schema Components ────────────────────────────────────────────────────────
export { default as FAQSchema } from "./FAQSchema";

// ─── Registries & Types ───────────────────────────────────────────────────────
export { faqRegistry } from "./faq-registry";
export type { FAQPageType } from "./faq-registry";

// New Event exports
export { default as EventSchema } from "./EventSchema";