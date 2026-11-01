import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import { hostEventSchema } from "./schema";
import { createEmailHtml, createEmailText } from "./email";

const TO = "help.d4community@gmail.com";
const CC = "management.d4community@gmail.com";
const SUBJECT = "New D4 Event Collaboration Application";
const MAX_BODY_BYTES = 32 * 1024;

type MailSendResult = {
  accepted?: Array<string | { address?: string }>;
};
type MailSender = (message: Mail.Options) => Promise<MailSendResult>;
type SenderFactory = (gmailUser: string, gmailPass: string) => MailSender;

class RequestTooLargeError extends Error {}

async function readRequestBody(request: Request): Promise<string> {
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("Empty request body");

  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new RequestTooLargeError();
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

function createSender(gmailUser: string, gmailPass: string): MailSender {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPass },
    pool: true,
    maxConnections: 1,
  });
  return (message) => transporter.sendMail(message);
}

function recipientAddress(recipient: string | { address?: string }): string {
  return (typeof recipient === "string" ? recipient : recipient.address ?? "").toLowerCase();
}

export function createHostEventPostHandler(senderFactory: SenderFactory = createSender) {
  return async function POST(request: Request) {
    const contentType = request.headers
      .get("content-type")
      ?.split(";")[0]
      .trim()
      .toLowerCase();
    if (contentType !== "application/json") {
      return Response.json({ error: "Send the application as JSON." }, { status: 415 });
    }

    const contentLengthHeader = request.headers.get("content-length");
    if (contentLengthHeader && /^\d+$/.test(contentLengthHeader) && Number(contentLengthHeader) > MAX_BODY_BYTES) {
      return Response.json(
        { error: "The application is too large. Shorten the text fields and try again." },
        { status: 413 },
      );
    }

    let bodyText: string;
    try {
      bodyText = await readRequestBody(request);
    } catch (error) {
      if (error instanceof RequestTooLargeError) {
        return Response.json(
          { error: "The application is too large. Shorten the text fields and try again." },
          { status: 413 },
        );
      }
      return Response.json({ error: "The request body is not valid JSON." }, { status: 400 });
    }

    let body: unknown;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return Response.json({ error: "The request body is not valid JSON." }, { status: 400 });
    }

    const parsed = hostEventSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0] ?? "form");
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      return Response.json(
        { error: "Check the application details and try again.", fieldErrors },
        { status: 400 },
      );
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;
    if (!gmailUser || !gmailPass) {
      return Response.json(
        { error: "The application email service is not configured. Please try again later." },
        { status: 503 },
      );
    }

    try {
      const sendMail = senderFactory(gmailUser, gmailPass);
      const result = await sendMail({
        from: `"D4 Community" <${gmailUser}>`,
        to: TO,
        cc: CC,
        replyTo: parsed.data.email,
        subject: SUBJECT,
        text: createEmailText(parsed.data),
        html: createEmailHtml(parsed.data),
      });

      const acceptedRecipients = new Set((result.accepted ?? []).map(recipientAddress));
      if (!acceptedRecipients.has(TO) || !acceptedRecipients.has(CC)) {
        return Response.json(
          { error: "The email provider did not accept delivery to all recipients. Please try again." },
          { status: 502 },
        );
      }

      return Response.json({
        success: true,
        message: "Your collaboration application was accepted for delivery. The D4 team will be in touch.",
      });
    } catch {
      // Do not log applicant data, SMTP details, or provider error messages.
      return Response.json(
        { error: "We could not send your application right now. Please try again later." },
        { status: 502 },
      );
    }
  };
}
