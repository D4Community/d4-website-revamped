import {
  HOST_EVENT_AVAILABILITY_LABELS,
  HOST_EVENT_DURATION_LABELS,
  HOST_EVENT_FORMAT_LABELS,
  HOST_EVENT_ORGANIZATION_LABELS,
  HOST_EVENT_ROLE_LABELS,
  HOST_EVENT_TYPE_LABELS,
  HOST_EVENT_VENUE_LABELS,
  type HostEventValues,
} from "./schema";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatHtmlText(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

function organizationRows(application: HostEventValues): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    ["Organization type", HOST_EVENT_ORGANIZATION_LABELS[application.organizationType]],
    ["Organization name", application.organizationName],
    [
      "Organization location",
      [application.organizationCity, application.organizationState, application.organizationCountry].join(", "),
    ],
  ];

  switch (application.organizationType) {
    case "college-university":
      rows.push(["Campus name", application.campusName || "Not provided"]);
      rows.push(["Department / institution type", application.institutionType || "Not provided"]);
      break;
    case "company-office":
      rows.push(["Office / workspace", application.officeName || "Not provided"]);
      rows.push(["Industry", application.industry || "Not provided"]);
      break;
    case "developer-community":
      rows.push(["Community focus / domain", application.communityFocus || "Not provided"]);
      rows.push(["Community website / social link", application.communityWebsite || "Not provided"]);
      break;
    case "student-club":
    case "other":
      rows.push(["Organization type details", application.organizationTypeOther || "Not provided"]);
      rows.push(["Organization website / social link", application.organizationWebsite || "Not provided"]);
      break;
  }

  return rows;
}

export function buildHostEventEmailSections(application: HostEventValues) {
  return [
    {
      title: "1. Applicant Details",
      rows: [
        ["Full name", application.fullName],
        ["Email address", application.email],
        ["Phone number", application.phone],
        ["Role / designation", HOST_EVENT_ROLE_LABELS[application.role]],
      ],
    },
    { title: "2. Organization Details", rows: organizationRows(application) },
    {
      title: "3. Venue & Event Details",
      rows: [
        ["Venue type", HOST_EVENT_VENUE_LABELS[application.venueType]],
        ["Venue name", application.venueName || "Not provided"],
        ["Venue address / location", application.venueLocation || "Not provided"],
        ["Venue city and state", [application.venueCity, application.venueState].filter(Boolean).join(", ") || "Not provided"],
        ["Venue available", HOST_EVENT_AVAILABILITY_LABELS[application.venueAvailability]],
        ["Expected event type", HOST_EVENT_TYPE_LABELS[application.eventType]],
        ["Expected participants", String(application.participants)],
        ["Preferred event date", application.preferredDate || "Not provided"],
        ["Alternative event date", application.alternativeDate || "Not provided"],
        ["Expected event duration", HOST_EVENT_DURATION_LABELS[application.eventDuration]],
        ["Event format", HOST_EVENT_FORMAT_LABELS[application.eventFormat]],
      ],
    },
    {
      title: "4. Collaboration Proposal",
      rows: [
        ["Why they want to collaborate", application.collaborationWhy],
        ["Planned event", application.eventPlan],
        ["Target audience", application.targetAudience || "Not provided"],
        ["Expected support from D4", application.expectedSupport || "Not provided"],
        ["Resources / arrangements offered", application.availableResources || "Not provided"],
        ["Organized events before", application.hasOrganizedEvents === "yes" ? "Yes" : "No"],
        ["Previous event details / portfolio", application.hasOrganizedEvents === "yes" ? application.previousEventDetails || "Not provided" : "Not applicable"],
      ],
    },
    {
      title: "5. Additional Information",
      rows: [["Additional requirements", application.additionalRequirements || "Not provided"]],
    },
  ] satisfies Array<{ title: string; rows: Array<[string, string]> }>;
}

export function createEmailHtml(application: HostEventValues): string {
  const sections = buildHostEventEmailSections(application)
    .map(({ title, rows }) => {
      const tableRows = rows
        .map(([label, value]) => `
          <tr>
            <th scope="row" style="padding:10px 12px;text-align:left;vertical-align:top;border-bottom:1px solid #e5e7eb;color:#4b5563;font-size:13px;width:220px;">${escapeHtml(label)}</th>
            <td style="padding:10px 12px;vertical-align:top;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;line-height:1.6;overflow-wrap:anywhere;">${formatHtmlText(value)}</td>
          </tr>`)
        .join("");
      return `<section style="margin:0 0 22px;"><h2 style="margin:0;padding:13px 14px;background:#f3f4f6;color:#111827;font-size:15px;">${escapeHtml(title)}</h2><table role="presentation" style="width:100%;border-collapse:collapse;table-layout:fixed;">${tableRows}</table></section>`;
    })
    .join("");

  return `<!doctype html>
    <html lang="en">
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;padding:24px;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#111827;">
        <main style="max-width:760px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;padding:24px;">
          <header style="padding:0 0 18px;border-bottom:2px solid #88CC8B;margin-bottom:22px;">
            <p style="margin:0 0 8px;color:#4b5563;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">D4 Community</p>
            <h1 style="margin:0;font-size:22px;line-height:1.3;">Event Collaboration Application</h1>
          </header>
          ${sections}
          <footer style="padding-top:8px;color:#6b7280;font-size:12px;">Reply to this email to contact the applicant.</footer>
        </main>
      </body>
    </html>`;
}

export function createEmailText(application: HostEventValues): string {
  return buildHostEventEmailSections(application)
    .flatMap(({ title, rows }) => [title, ...rows.map(([label, value]) => `${label}: ${value}`), ""])
    .join("\n");
}
