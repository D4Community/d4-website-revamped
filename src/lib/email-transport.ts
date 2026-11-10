import nodemailer from "nodemailer";

type D4TransportOptions = {
  pool?: boolean;
  maxConnections?: number;
};

/** Create a server-side D4 mail transporter using credentials read at call time. */
export function createD4MailTransporter(options: D4TransportOptions = {}) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;
  if (!user || !pass) {
    throw new Error("Email service requires GMAIL_USER and GMAIL_PASS to be configured.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
    ...options,
  });
}
