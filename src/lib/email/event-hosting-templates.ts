import type { EventHostingRequest } from "@/lib/validations/event-hosting-request";

const escapeHtml = (value: unknown): string => String(value ?? "—").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const display = (value: unknown) => Array.isArray(value) ? value.join(", ") || "—" : value === undefined || value === null || value === "" ? "—" : String(value);
const cleanSubject = (value: string) => value.replace(/[\r\n]/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);

export function createEventHostingEmail(data: EventHostingRequest, referenceId: string, createdAt: Date) {
  const sections: [string, [string, unknown][]][] = [
    ["Applicant Information", [["Name", data.about.fullName], ["Email", data.about.email], ["Phone", `${data.about.phoneCountryCode} ${data.about.phoneNumber}`], ["Role", `${data.about.role}${data.about.roleOther ? `: ${data.about.roleOther}` : ""}`]] ],
    ["Institution Information", [["Type", data.institution.institutionType], ["Type details", data.institution.institutionTypeOther], ["Institution", data.institution.institutionName], ["Department / Branch", data.institution.department], ["City", data.institution.city], ["State", data.institution.state], ["Country", data.institution.country], ["Website", data.institution.website]]],
    ["Proposed Event", [["Event types", data.event.eventTypes], ["Other event type", data.event.eventTypeOther], ["Title", data.event.eventTitle], ["Audience", data.event.expectedAudience], ["Expected capacity", data.event.expectedCapacity], ["Preferred date", data.event.preferredDate], ["Timeline", data.event.timeline], ["Description", data.event.description]]],
    ["Venue & Infrastructure", [["Venue not finalised", data.venue.venueNotFinalised ? "Yes" : "No"], ["Preferred venue", data.venue.preferredVenue], ["Spaces", data.venue.spaces], ["Seating capacity", data.venue.seatingCapacity], ["Facilities", Object.entries(data.venue.facilities).map(([k,v]) => `${k}: ${v}`).join(", ")], ["Other infrastructure", data.venue.otherInfrastructure], ["Venue notes", data.venue.venueNotes], ["Support requested from D4", data.venue.needsFromD4]]],
    ["Previous Experience", [["Hosted before", data.experience.hostedBefore === undefined ? "—" : data.experience.hostedBefore ? "Yes" : "No"], ["Event types", data.experience.pastEventTypes], ["Past attendance", data.experience.pastAttendance], ["Details", data.experience.pastDetails], ["Collaborated before", data.experience.collaboratedBefore === undefined ? "—" : data.experience.collaboratedBefore ? "Yes" : "No"], ["Collaborated with", data.experience.collaboratedWith]]],
    ["Additional Information", [["Requirements", data.additional.additionalRequirements], ["Special requests", data.additional.specialRequests], ["Anything else", data.additional.anythingElse]]],
  ];
  const submittedAt = createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
  const subject = cleanSubject(`New Event Hosting Request – ${data.institution.institutionName}`);
  const rows = sections.map(([title, fields]) => `<tr><td colspan="2" style="padding:16px 10px 6px;font-weight:bold;font-size:16px;border-bottom:1px solid #ddd">${escapeHtml(title)}</td></tr>${fields.map(([label,value]) => `<tr><td style="padding:7px 10px;color:#555;vertical-align:top;width:32%">${escapeHtml(label)}</td><td style="padding:7px 10px;white-space:pre-wrap;word-break:break-word">${escapeHtml(display(value))}</td></tr>`).join("")}`).join("");
  const text = [`Reference: ${referenceId}`, `Submitted at (IST): ${submittedAt}`, ...sections.flatMap(([title, fields]) => ["", title, ...fields.map(([label,value]) => `${label}: ${display(value)}`)])].join("\n");
  return { subject, html: `<div style="font-family:Arial,sans-serif;color:#222;max-width:760px;margin:auto"><h1 style="font-size:22px">New Event Hosting Request</h1><p><b>Reference:</b> ${escapeHtml(referenceId)}<br><b>Submitted at (IST):</b> ${escapeHtml(submittedAt)}</p><table role="presentation" style="width:100%;border-collapse:collapse">${rows}</table></div>`, text };
}

export function createEventHostingAcknowledgement(data: EventHostingRequest, referenceId: string) {
  const name = escapeHtml(data.about.fullName), institution = escapeHtml(data.institution.institutionName);
  return { subject: `We received your D4 event hosting interest (${referenceId})`, text: `Hello ${data.about.fullName},\n\nWe received your expression of interest in hosting a D4 event at ${data.institution.institutionName}. The D4 team will review it and may be in touch. Submission does not mean the event is approved or confirmed.\n\nReference: ${referenceId}`, html: `<p>Hello ${name},</p><p>We received your expression of interest in hosting a D4 event at ${institution}. The D4 team will review it and may be in touch.</p><p>Submission does not mean the event is approved or confirmed.</p><p>Reference: <strong>${escapeHtml(referenceId)}</strong></p>` };
}
