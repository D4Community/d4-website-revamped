import { NextResponse } from "next/server";
import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { eventHostingRequestSchema } from "@/lib/validations/event-hosting-request";
import { createEventHostingAcknowledgement, createEventHostingEmail } from "@/lib/email/event-hosting-templates";

export const runtime = "nodejs";
const hits = new Map<string, number[]>();
const idempotency = new Map<string, { at: number; referenceId: string }>();
const fingerprints = new Map<string, { at: number; referenceId: string }>();
const hour = 60 * 60 * 1000;

async function appendRequest(payload: unknown, referenceId: string, createdAt: Date) {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n").replace(/"/g, "").trim();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!clientEmail || !privateKey || !spreadsheetId) throw new Error("Google Sheets persistence is not configured");
  const auth = new google.auth.GoogleAuth({ credentials: { client_email: clientEmail, private_key: privateKey }, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  const sheets = google.sheets({ version: "v4", auth });
  const response = await sheets.spreadsheets.values.append({ spreadsheetId, range: "EventHostingRequests!A:E", valueInputOption: "RAW", insertDataOption: "INSERT_ROWS", requestBody: { values: [[referenceId, createdAt.toISOString(), "pending", JSON.stringify(payload), ""]] } });
  if (!response.data.updates?.updatedRows) throw new Error("Google Sheets did not confirm the appended request");
  return response.data.updates.updatedRange || "";
}

async function updateRequestStatus(range: string, status: string) {
  if (!range) return;
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n").replace(/"/g, "").trim();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!clientEmail || !privateKey || !spreadsheetId) return;
  const auth = new google.auth.GoogleAuth({ credentials: { client_email: clientEmail, private_key: privateKey }, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  const sheets = google.sheets({ version: "v4", auth });
  const row = range.match(/!(?:A)(\d+):E\d+$/)?.[1];
  if (!row) return;
  await sheets.spreadsheets.values.update({ spreadsheetId, range: `EventHostingRequests!C${row}`, valueInputOption: "RAW", requestBody: { values: [[status]] } });
}

export async function POST(request: Request) {
  let raw: unknown;
  try { raw = await request.json(); } catch { return NextResponse.json({ ok: false, code: "VALIDATION", fieldErrors: { root: ["Invalid request body."] } }, { status: 400 }); }
  const parsed = eventHostingRequestSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) { const key = issue.path.join(".") || "root"; (fieldErrors[key] ??= []).push(issue.message); }
    return NextResponse.json({ ok: false, code: "VALIDATION", fieldErrors }, { status: 400 });
  }
  const data = parsed.data;
  if (data.honeypot) return NextResponse.json({ ok: true });
  if (Date.now() - data.startedAt < 4000) return NextResponse.json({ ok: false, code: "TOO_FAST" }, { status: 429 });
  const forwarded = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  // Best effort only: this in-memory limiter resets on deploy and is not shared between serverless instances.
  const now = Date.now(), recent = (hits.get(forwarded) || []).filter(time => now - time < hour);
  if (recent.length >= 5) return NextResponse.json({ ok: false, code: "RATE_LIMIT" }, { status: 429 });
  recent.push(now); hits.set(forwarded, recent);
  for (const [key, record] of idempotency) if (now - record.at > 24 * hour) idempotency.delete(key);
  for (const [key, record] of fingerprints) if (now - record.at > 24 * hour) fingerprints.delete(key);
  const fingerprint = `${data.about.email.toLowerCase()}|${data.institution.institutionName.toLowerCase()}|${[...data.event.eventTypes].sort().join(",")}`;
  const duplicate = fingerprints.get(fingerprint);
  const priorIdempotency = idempotency.get(data.idempotencyKey);
  if (priorIdempotency || duplicate) return NextResponse.json({ ok: false, code: "DUPLICATE", referenceId: duplicate?.referenceId || priorIdempotency?.referenceId });
  const createdAt = new Date();
  const suffix = Math.random().toString(32).slice(2, 8).toUpperCase().padEnd(6, "0");
  const referenceId = `EHR-${createdAt.toISOString().slice(0,10).replace(/-/g,"")}-${suffix}`;
  const subject = `New Event Hosting Request – ${data.institution.institutionName}`.replace(/[\r\n]/g, " ").slice(0, 120);
  const user = process.env.GMAIL_USER, password = process.env.GMAIL_PASS;
  const recipient = process.env.RECEIVER_EMAIL || process.env.EVENT_HOSTING_RECIPIENT_EMAIL;
  let persisted = false, emailed = false, notificationStatus = "failed", sheetRange = "";
  try { sheetRange = await appendRequest(data, referenceId, createdAt); persisted = true; } catch (error) { console.error("Event hosting persistence failed", { referenceId, errorClass: error instanceof Error ? error.name : "UnknownError" }); }
  if (!user || !password || !recipient) {
    console.error("Event hosting mail configuration missing", { referenceId, errorClass: "ConfigurationError" });
  } else {
    try {
      const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass: password } });
      const template = createEventHostingEmail(data, referenceId, createdAt);
      await transporter.sendMail({ from: `"D4 Community" <${user}>`, to: recipient, replyTo: data.about.email, subject, html: template.html, text: template.text });
      emailed = true; notificationStatus = "sent";
      if (process.env.EVENT_HOSTING_ACK_ENABLED === "true") {
        try { const ack = createEventHostingAcknowledgement(data, referenceId); await transporter.sendMail({ from: `"D4 Community" <${user}>`, to: data.about.email, ...ack }); } catch (error) { console.error("Event hosting acknowledgement failed", { referenceId, errorClass: error instanceof Error ? error.name : "UnknownError" }); }
      }
    } catch (error) { console.error("Event hosting notification failed", { referenceId, errorClass: error instanceof Error ? error.name : "UnknownError" }); }
  }
  if (persisted) { try { await updateRequestStatus(sheetRange, notificationStatus); } catch (error) { console.error("Event hosting status update failed", { referenceId, errorClass: error instanceof Error ? error.name : "UnknownError" }); } }
  if (persisted && notificationStatus !== "sent") {
    // Keep the sheet's status record explicit even if the best-effort notification failed.
    console.error("Event hosting request recorded without notification", { referenceId, notificationStatus });
  }
  if (!persisted && !emailed) return NextResponse.json({ ok: false, code: "SERVER" }, { status: 500 });
  idempotency.set(data.idempotencyKey, { at: now, referenceId }); fingerprints.set(fingerprint, { at: now, referenceId });
  return NextResponse.json({ ok: true, referenceId });
}
