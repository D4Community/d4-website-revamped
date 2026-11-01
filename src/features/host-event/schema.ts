import { z } from "zod";

const noHeaderControls = (value: string) => !/[\r\n\0]/.test(value);
const optionalText = (max: number) => z.string().trim().max(max).default("");
const conditionalText = () => z.string().trim().default("");

const validDate = (value: string) => {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const dateField = z.string().refine(validDate, "Enter a valid date.");
const linkField = conditionalText();

const isValidLink = (value: string) => {
  if (!value) return true;
  try {
    const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(value)
      ? value
      : `https://${value}`;
    const url = new URL(candidate);
    return ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname);
  } catch {
    return false;
  }
};

export const ORGANIZATION_TYPES = [
  "college-university",
  "company-office",
  "developer-community",
  "student-club",
  "other",
] as const;

export const VENUE_TYPES = [
  "campus",
  "office-space",
  "community-venue",
  "coworking-space",
  "online",
  "other",
] as const;

export const VENUE_AVAILABILITY = ["yes", "no", "not-sure"] as const;
export const EVENT_FORMATS = ["offline", "online", "hybrid"] as const;
export const EVENT_DURATIONS = [
  "under-2-hours",
  "2-4-hours",
  "half-day",
  "full-day",
  "multi-day",
  "other",
] as const;

export const hostEventSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name.").max(100),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address.")
      .max(254)
      .refine(noHeaderControls, "Enter a valid email address."),
    phone: z
      .string()
      .trim()
      .min(1, "Enter your phone number.")
      .max(40)
      .refine((value) => {
        const digits = value.replace(/\D/g, "");
        return digits.length >= 7 && digits.length <= 15;
      }, "Enter a valid phone number (7 to 15 digits)."),
    role: z.enum([
      "student",
      "campus-representative",
      "college-organizer",
      "community-organizer",
      "faculty",
      "company-representative",
      "hr-people-operations",
      "event-organizer",
      "other",
    ]),

    organizationType: z.enum(ORGANIZATION_TYPES),
    organizationName: z.string().trim().min(2, "Enter your organization name.").max(180),
    organizationCity: z.string().trim().min(2, "Enter your city.").max(100),
    organizationState: z.string().trim().min(2, "Enter your state or region.").max(100),
    organizationCountry: z.string().trim().min(2, "Enter your country.").max(80),
    campusName: conditionalText(),
    institutionType: conditionalText(),
    officeName: conditionalText(),
    industry: conditionalText(),
    communityFocus: conditionalText(),
    communityWebsite: linkField,
    organizationTypeOther: conditionalText(),
    organizationWebsite: linkField,

    venueType: z.enum(VENUE_TYPES),
    venueName: optionalText(180),
    venueLocation: conditionalText(),
    venueCity: conditionalText(),
    venueState: conditionalText(),
    venueAvailability: z.enum(VENUE_AVAILABILITY),
    eventType: z.enum([
      "workshop",
      "tech-talk",
      "meetup",
      "hackathon",
      "panel",
      "other",
    ]),
    participants: z
      .number({ error: "Enter an expected participant count." })
      .int("Enter a whole number.")
      .min(1, "At least 1 participant is required.")
      .max(100000, "Enter a number below 100,000."),
    preferredDate: dateField,
    alternativeDate: dateField,
    eventDuration: z.enum(EVENT_DURATIONS),
    eventFormat: z.enum(EVENT_FORMATS),

    collaborationWhy: z
      .string()
      .trim()
      .min(20, "Please share at least 20 characters.")
      .max(1600, "Keep this answer under 1,600 characters."),
    eventPlan: z
      .string()
      .trim()
      .min(10, "Describe the event you are planning.")
      .max(1600, "Keep this answer under 1,600 characters."),
    targetAudience: optionalText(800),
    expectedSupport: optionalText(800),
    availableResources: optionalText(800),
    hasOrganizedEvents: z.enum(["yes", "no"]),
    previousEventDetails: conditionalText(),
    additionalRequirements: optionalText(1200),
  })
  .strict()
  .superRefine((values, context) => {
    const checkConditionalLength = (
      field: string,
      value: string,
      maxLength: number,
    ) => {
      if (value.length > maxLength) {
        context.addIssue({
          code: "custom",
          path: [field],
          message: `Keep this field under ${maxLength} characters.`,
        });
      }
    };
    const applicableLink =
      values.organizationType === "developer-community"
        ? ["communityWebsite", values.communityWebsite] as const
        : values.organizationType === "student-club" || values.organizationType === "other"
          ? ["organizationWebsite", values.organizationWebsite] as const
          : null;
    if (applicableLink) {
      checkConditionalLength(applicableLink[0], applicableLink[1], 300);
      if (!isValidLink(applicableLink[1])) {
        context.addIssue({
          code: "custom",
          path: [applicableLink[0]],
          message: "Enter a valid website or social link.",
        });
      }
    }

    switch (values.organizationType) {
      case "college-university":
        checkConditionalLength("campusName", values.campusName, 160);
        checkConditionalLength("institutionType", values.institutionType, 120);
        break;
      case "company-office":
        checkConditionalLength("officeName", values.officeName, 160);
        checkConditionalLength("industry", values.industry, 120);
        break;
      case "developer-community":
        checkConditionalLength("communityFocus", values.communityFocus, 200);
        break;
      case "student-club":
      case "other":
        checkConditionalLength("organizationTypeOther", values.organizationTypeOther, 120);
        break;
    }

    if (values.venueType !== "online") {
      if (!values.venueLocation) {
        context.addIssue({
          code: "custom",
          path: ["venueLocation"],
          message: "Enter the venue address or location.",
        });
      }
      if (!values.venueCity) {
        context.addIssue({
          code: "custom",
          path: ["venueCity"],
          message: "Enter the venue city.",
        });
      }
      if (!values.venueState) {
        context.addIssue({
          code: "custom",
          path: ["venueState"],
          message: "Enter the venue state or region.",
        });
      }
      checkConditionalLength("venueLocation", values.venueLocation, 500);
      checkConditionalLength("venueCity", values.venueCity, 100);
      checkConditionalLength("venueState", values.venueState, 100);
    }
    if (values.hasOrganizedEvents === "yes") {
      checkConditionalLength("previousEventDetails", values.previousEventDetails, 800);
    }
  });

export type HostEventValues = z.infer<typeof hostEventSchema>;
export type HostEventInputValues = z.input<typeof hostEventSchema>;

const ORGANIZATION_ONLY_FIELDS = [
  "campusName",
  "institutionType",
  "officeName",
  "industry",
  "communityFocus",
  "communityWebsite",
  "organizationTypeOther",
  "organizationWebsite",
] as const;

const ORGANIZATION_FIELDS_BY_TYPE: Record<
  HostEventValues["organizationType"],
  readonly (typeof ORGANIZATION_ONLY_FIELDS)[number][]
> = {
  "college-university": ["campusName", "institutionType"],
  "company-office": ["officeName", "industry"],
  "developer-community": ["communityFocus", "communityWebsite"],
  "student-club": ["organizationTypeOther", "organizationWebsite"],
  other: ["organizationTypeOther", "organizationWebsite"],
};

/** Keep inactive organization fields in the form state, but omit them from submission. */
export function createHostEventPayload(values: HostEventValues): HostEventValues {
  const applicableFields = new Set(ORGANIZATION_FIELDS_BY_TYPE[values.organizationType]);
  const payload = { ...values };

  for (const field of ORGANIZATION_ONLY_FIELDS) {
    if (!applicableFields.has(field)) payload[field] = "";
  }

  if (values.hasOrganizedEvents === "no") payload.previousEventDetails = "";

  return payload;
}

export const HOST_EVENT_ROLE_LABELS: Record<HostEventValues["role"], string> = {
  student: "Student",
  "campus-representative": "Campus representative",
  "college-organizer": "College organizer",
  "community-organizer": "Community organizer",
  faculty: "Faculty / Professor",
  "company-representative": "Company representative",
  "hr-people-operations": "HR / People Operations",
  "event-organizer": "Event organizer",
  other: "Other",
};

export const HOST_EVENT_ORGANIZATION_LABELS: Record<
  HostEventValues["organizationType"],
  string
> = {
  "college-university": "College / University",
  "company-office": "Company / Office Space",
  "developer-community": "Developer / Technology Community",
  "student-club": "Student Club / Organization",
  other: "Other",
};

export const HOST_EVENT_VENUE_LABELS: Record<HostEventValues["venueType"], string> = {
  campus: "Campus",
  "office-space": "Office space",
  "community-venue": "Community venue",
  "coworking-space": "Co-working space",
  online: "Online",
  other: "Other",
};

export const HOST_EVENT_AVAILABILITY_LABELS: Record<
  HostEventValues["venueAvailability"],
  string
> = {
  yes: "Yes",
  no: "No",
  "not-sure": "Not sure",
};

export const HOST_EVENT_DURATION_LABELS: Record<HostEventValues["eventDuration"], string> = {
  "under-2-hours": "Under 2 hours",
  "2-4-hours": "2–4 hours",
  "half-day": "Half day",
  "full-day": "Full day",
  "multi-day": "Multiple days",
  other: "Other",
};

export const HOST_EVENT_FORMAT_LABELS: Record<HostEventValues["eventFormat"], string> = {
  offline: "Offline",
  online: "Online",
  hybrid: "Hybrid",
};

export const HOST_EVENT_TYPE_LABELS: Record<HostEventValues["eventType"], string> = {
  workshop: "Workshop",
  "tech-talk": "Tech talk",
  meetup: "Community meetup",
  hackathon: "Hackathon",
  panel: "Panel or networking session",
  other: "Other",
};
