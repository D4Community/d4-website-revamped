import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generateAdminEmail, generateWelcomeEmail, generateCertificateEmail } from "@/lib/email-templates";
import { addToGoogleSheets, findMemberByEmail } from "@/lib/google-sheets";
import { generateCertificatePDF } from "@/lib/certificate-generator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role, interest, experience, whyJoin } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });

    // 1. Check if user already exists
    const existingMember = await findMemberByEmail(email);

    if (existingMember) {
      console.log(`♻️ Returning user: ${existingMember.memberId}`);
      const certBuffer = await generateCertificatePDF(existingMember.name, new Date(), existingMember.memberId);

      // Single email for existing users
      await transporter.sendMail({
        from: `"D4 Community" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Welcome Back, ${existingMember.name}!`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Hello again, ${existingMember.name}!</h2>
            <p>You are already a valued member of the D4 Community.</p>
            <p>Your existing Member ID is: <strong>${existingMember.memberId}</strong></p>
            <p>We've attached your membership certificate to this email for your records.</p>
            <br/>
            <p>Best regards,<br/>D4 Community Team</p>
          </div>
        `,
        attachments: [{
          filename: `D4-Certificate-${existingMember.name.replace(/\s/g, "-")}.pdf`,
          content: certBuffer,
          contentType: "application/pdf",
        }],
      });

      return NextResponse.json({ success: true, message: "Welcome back! Certificate resent.", memberId: existingMember.memberId });
    }

    // 2. Logic for NEW Users (Kept as 2 separate emails)
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
    const memberId = `D4-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // A. Send Admin Alert
    await transporter.sendMail({
      from: `"D4 Community" <${process.env.GMAIL_USER}>`,
      to: "help.d4community@gmail.com",
      subject: `New Member Application: ${name}`,
      html: generateAdminEmail({ name, email, role, interest, experience, whyJoin, timestamp, memberId }),
    });

    // B. Send Welcome Email (Email 1)
    await transporter.sendMail({
      from: `"D4 Community" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Welcome to D4 Community, ${name}!`,
      html: generateWelcomeEmail(name),
    });

    // C. Send Certificate Email (Email 2)
    const certificateBuffer = await generateCertificatePDF(name, new Date(), memberId);
    await transporter.sendMail({
      from: `"D4 Community" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Your D4 Community Membership Certificate, ${name}!`,
      html: generateCertificateEmail(name, memberId),
      attachments: [{
        filename: `D4-Certificate-${name.replace(/\s/g, "-")}.pdf`,
        content: certificateBuffer,
        contentType: "application/pdf",
      }],
    });

    // D. Store in Google Sheets
    await addToGoogleSheets({ name, email, role, experience, interest, whyJoin, timestamp, memberId });

    return NextResponse.json({ success: true, memberId });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}