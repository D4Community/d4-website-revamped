import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { eventHostingRequestSchema } from "@/lib/validations/event-hosting-request";
import { createEventHostingAcknowledgement, createEventHostingEmail } from "@/lib/email/event-hosting-templates";
import { createD4MailTransporter } from "@/lib/email-transport";
import { addEventHostingRequestToGoogleSheets, updateEventHostingNotificationStatus } from "@/lib/google-sheets";

export const runtime = "nodejs";
const hits = new Map<string, number[]>();
const idempotency = new Map<string, { at: number; referenceId: string; fingerprint: string }>();
const fingerprints = new Map<string, { at: number; referenceId: string }>();
const hour = 60 * 60 * 1000;

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
  const content = structuredClone(data) as Record<string, unknown>;
  delete content.idempotencyKey; delete content.startedAt; delete content.honeypot; delete content.consent;
  const fingerprint = createHash("sha256").update(JSON.stringify(content)).digest("hex");
  const duplicate = fingerprints.get(fingerprint);
  const priorIdempotency = idempotency.get(data.idempotencyKey);
  if (duplicate || (priorIdempotency?.fingerprint === fingerprint)) return NextResponse.json({ ok: false, code: "DUPLICATE", referenceId: duplicate?.referenceId || priorIdempotency?.referenceId });
  const createdAt = new Date();
  const suffix = Math.random().toString(32).slice(2, 8).toUpperCase().padEnd(6, "0");
  const referenceId = `EHR-${createdAt.toISOString().slice(0,10).replace(/-/g,"")}-${suffix}`;
    const user = process.env.GMAIL_USER;
  const recipient = process.env.RECEIVER_EMAIL || process.env.EVENT_HOSTING_RECIPIENT_EMAIL;
  let persisted = false;
  let emailed = false;
  let notificationStatus: "failed" | "sent" = "failed";
  let sheetRange = "";
  try {
    sheetRange = await addEventHostingRequestToGoogleSheets({
      referenceId,
      createdAt: createdAt.toISOString(),
      notificationStatus: "pending",
      payload: data,
    });
    persisted = true;
  } catch (error) {
    console.error("Event hosting persistence failed", {
      referenceId,
      errorClass: error instanceof Error ? error.name : "UnknownError",
    });
  }
  if (!user || !recipient) {
    console.error("Event hosting mail configuration missing", {
      referenceId,
      errorClass: "ConfigurationError",
      missing: [!user && "GMAIL_USER", !process.env.GMAIL_PASS && "GMAIL_PASS", !recipient && "RECEIVER_EMAIL or EVENT_HOSTING_RECIPIENT_EMAIL"].filter(Boolean),
    });
  } else {
    try {
      const transporter = createD4MailTransporter();
      const template = createEventHostingEmail(data, referenceId, createdAt);
      await transporter.sendMail({ from: `"D4 Community" <${user}>`, to: recipient, replyTo: data.about.email, subject: template.subject, html: template.html, text: template.text });
      emailed = true; notificationStatus = "sent";
      if (process.env.EVENT_HOSTING_ACK_ENABLED === "true") {
        try { const ack = createEventHostingAcknowledgement(data, referenceId); await transporter.sendMail({ from: `"D4 Community" <${user}>`, to: data.about.email, ...ack }); } catch (error) { console.error("Event hosting acknowledgement failed", { referenceId, errorClass: error instanceof Error ? error.name : "UnknownError" }); }
      }
    } catch (error) { console.error("Event hosting notification failed", { referenceId, errorClass: error instanceof Error ? error.name : "UnknownError" }); }
  }
  if (persisted) { try { await updateEventHostingNotificationStatus(sheetRange, notificationStatus); } catch (error) { console.error("Event hosting status update failed", { referenceId, errorClass: error instanceof Error ? error.name : "UnknownError" }); } }
  if (persisted && notificationStatus !== "sent") {
    // Keep the sheet's status record explicit even if the best-effort notification failed.
    console.error("Event hosting request recorded without notification", { referenceId, notificationStatus });
  }
  if (!persisted && !emailed) return NextResponse.json({ ok: false, code: "SERVER" }, { status: 500 });
  idempotency.set(data.idempotencyKey, { at: now, referenceId, fingerprint }); fingerprints.set(fingerprint, { at: now, referenceId });
  return NextResponse.json({ ok: true, referenceId });
}
