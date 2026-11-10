import { z } from "zod";

export const PHONE_CODES = ["+91", "+1", "+44", "+61", "+971", "+65", "+49", "+33", "+81"] as const;
export const ROLES = ["Student", "Campus Lead", "Faculty Member", "College Representative", "University Representative", "Organization Representative", "Company Representative", "Other"] as const;
export const INSTITUTION_TYPES = ["College", "University", "School", "Company / Office", "Developer Organization", "Community Organization", "Other"] as const;
export const EVENT_TYPES = ["Developer Meetup", "Technical Workshop", "Hackathon", "GenAI Event", "Tech Talk", "Developer Conference", "Community Meetup", "Other"] as const;
export const AUDIENCES = ["Undergraduate students", "Postgraduate students", "Faculty & staff", "Working professionals", "Open to public", "Other"] as const;
export const VENUE_SPACES = ["Auditorium", "Seminar Hall", "Classroom", "Conference Room", "Computer Lab", "Outdoor / Open area", "Other"] as const;
export const FACILITY_STATUSES = ["available", "partial", "unavailable", "unsure"] as const;
const optionalFacility = z.union([z.enum(FACILITY_STATUSES), z.literal("")]).transform(value => value || undefined).optional();
export const TIMELINES = ["Within 1 month", "1-3 months", "3-6 months", "6+ months", "Flexible"] as const;
export const INDIAN_STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Chandigarh", "Puducherry", "Andaman and Nicobar Islands", "Lakshadweep", "Dadra and Nagar Haveli and Daman and Diu"] as const;
export const COUNTRIES = ["India", "United States", "United Kingdom", "Australia", "United Arab Emirates", "Singapore", "Canada", "Germany", "France", "Japan", "Other"] as const;

export const clean = <T extends z.ZodType>(schema: T) => z.preprocess((value) => typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f-\u009f]/g, " ").replace(/\s+/g, " ").trim() : value, schema);
const optionalText = (max: number) => clean(z.string().max(max).or(z.literal("")).optional());
const requiredText = (min: number, max: number) => clean(z.string().min(min, { error: `Enter at least ${min} characters.` }).max(max, { error: `Use ${max} characters or fewer.` }));
const optionalInt = (min: number, max: number) => z.union([z.literal(""), z.coerce.number().int().min(min).max(max), z.number().int().min(min).max(max)]).optional().transform(v => v === "" ? undefined : v as number | undefined);
const dateSchema = z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]).optional().refine((date) => {
  if (!date) return true;
  const d = new Date(`${date}T00:00:00Z`), now = new Date();
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1));
  const max = new Date(Date.UTC(now.getUTCFullYear() + 2, now.getUTCMonth(), now.getUTCDate()));
  return d.toISOString().slice(0, 10) === date && d >= today && d <= max;
}, "Choose a date within the next 24 months.");

export const eventHostingRequestSchema = z.object({
  about: z.object({
    fullName: requiredText(2, 100), email: clean(z.string().email({ error: "Enter an email like name@college.edu." }).max(254, { error: "Email addresses must be 254 characters or fewer." })), phoneCountryCode: z.enum(PHONE_CODES).default("+91"), phoneNumber: z.string().transform(v => v.replace(/\D/g, "")),
    role: z.union([z.literal(""), z.enum(ROLES)]), roleOther: optionalText(80),
  }).strict(),
  institution: z.object({
    institutionType: z.union([z.literal(""), z.enum(INSTITUTION_TYPES)]), institutionTypeOther: optionalText(80), institutionName: requiredText(2, 150), city: requiredText(2, 80), state: requiredText(2, 80), country: requiredText(2, 80), website: optionalText(200).transform(v => v && !/^https?:\/\//i.test(v) ? `https://${v}` : v).refine(v => !v || /^https?:\/\/[\w.-]+(?:[/:?#][^\s]*)?$/i.test(v), "Enter a valid http(s) website."), department: optionalText(100),
  }).strict(),
  event: z.object({
    eventTypes: z.array(z.enum(EVENT_TYPES)).min(1, { error: "Choose at least one event type." }), eventTypeOther: optionalText(100), expectedAudience: z.array(z.enum(AUDIENCES)).min(1, { error: "Choose at least one audience." }), expectedCapacity: z.coerce.number({ error: "Enter an expected capacity." }).int().min(10, { error: "Capacity must be at least 10." }).max(10000, { error: "Capacity must be 10,000 or less." }), preferredDate: dateSchema, timeline: z.union([z.literal(""), z.enum(TIMELINES)]), eventTitle: optionalText(120), description: requiredText(50, 2000),
  }).strict(),
  venue: z.object({ venueNotFinalised: z.boolean().default(false), preferredVenue: optionalText(150), spaces: z.array(z.enum(VENUE_SPACES)).optional().default([]), seatingCapacity: optionalInt(1, 50000), facilities: z.object({ projector: optionalFacility, audio: optionalFacility, wifi: optionalFacility, power: optionalFacility }).strict().default({}), otherInfrastructure: optionalText(300), venueNotes: optionalText(1000), needsFromD4: optionalText(1000) }).strict(),
  experience: z.object({ hostedBefore: z.boolean().optional(), pastEventTypes: optionalText(300), pastAttendance: optionalInt(1, 100000), pastDetails: optionalText(1000), collaboratedBefore: z.boolean().optional(), collaboratedWith: optionalText(300) }).strict(),
  additional: z.object({ additionalRequirements: optionalText(1000), specialRequests: optionalText(1000), anythingElse: optionalText(1000) }).strict(),
  consent: z.literal(true), idempotencyKey: z.string().uuid(), startedAt: z.number(), honeypot: z.string(),
}).strict().superRefine((data, ctx) => {
  const issue = (path: (string | number)[], message: string) => ctx.addIssue({ code: "custom", path, message });
  const phoneDigits = `${data.about.phoneCountryCode}${data.about.phoneNumber}`.replace(/\D/g, "");
  if (phoneDigits.length < 8 || phoneDigits.length > 15 || !/^\d+$/.test(data.about.phoneNumber)) issue(["about", "phoneNumber"], "Enter a valid phone number (8–15 digits with country code).");
  if (!data.about.role) issue(["about", "role"], "Select your role.");
  if (!data.institution.institutionType) issue(["institution", "institutionType"], "Choose an institution type.");
  if (!data.event.timeline) issue(["event", "timeline"], "Choose an event timeline.");
  if (data.institution.country === "Other") issue(["institution", "country"], "Enter your country name.");
  if (data.institution.country === "India" && !INDIAN_STATES.includes(data.institution.state as typeof INDIAN_STATES[number])) issue(["institution", "state"], "Select an Indian state or union territory.");
  if (data.about.role !== "Other" && data.about.roleOther) issue(["about", "roleOther"], "Remove this detail unless you selected Other.");
  if (data.about.role === "Other" && (data.about.roleOther?.length ?? 0) < 2) issue(["about", "roleOther"], "Please specify your role.");
  if (data.institution.institutionType !== "Other" && data.institution.institutionTypeOther) issue(["institution", "institutionTypeOther"], "Remove this detail unless you selected Other.");
  if (data.institution.institutionType === "Other" && (data.institution.institutionTypeOther?.length ?? 0) < 2) issue(["institution", "institutionTypeOther"], "Please specify the institution type.");
  if (!data.event.eventTypes.includes("Other") && data.event.eventTypeOther) issue(["event", "eventTypeOther"], "Remove this detail unless you selected Other.");
  if (data.event.eventTypes.includes("Other") && (data.event.eventTypeOther?.length ?? 0) < 2) issue(["event", "eventTypeOther"], "Please specify the event type.");
  if (data.venue.venueNotFinalised && data.venue.preferredVenue) issue(["venue", "preferredVenue"], "Remove the preferred venue while it is not finalised.");
  const needsD4 = Object.values(data.venue.facilities).some((status) => status === "partial" || status === "unavailable");
  if (!needsD4 && data.venue.needsFromD4) issue(["venue", "needsFromD4"], "This field is only used when a facility is partial or unavailable.");
  if (data.experience.hostedBefore !== true && (data.experience.pastEventTypes || data.experience.pastAttendance !== undefined || data.experience.pastDetails)) issue(["experience", "pastDetails"], "Remove event history unless you have organised events before.");
  if (data.experience.collaboratedBefore !== true && data.experience.collaboratedWith) issue(["experience", "collaboratedWith"], "Remove collaboration details unless you have collaborated with communities before.");
});
export type EventHostingRequest = z.infer<typeof eventHostingRequestSchema>;
