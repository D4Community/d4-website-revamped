export interface EventSchemaData {
  name: string;
  description: string;
  startDate: string; // ISO format
  endDate?: string;
  locationName: string;
  locationAddress?: string;
  url: string;
  imageUrl?: string;
  eventType?: "online" | "offline";
}