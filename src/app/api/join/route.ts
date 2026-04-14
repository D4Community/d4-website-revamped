import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generateAdminEmail, generateWelcomeEmail, generateCertificateEmail } from "@/lib/email-templates";
import { addToGoogleSheets } from "@/lib/google-sheets";
import { generateCertificatePDF } from "@/lib/certificate-generator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("=== New Submission Received ===");
    console.log("Full Data:", JSON.stringify(body, null, 2));
    
    const { name, email, role, interest, experience, whyJoin } = body;

    // Only name and email are required
    if (!name || !email) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check email configuration
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error("Missing email configuration");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Verify email connection
    await transporter.verify();
    console.log("✅ Email connection verified");

    const timestamp = new Date().toLocaleString("en-IN", { 
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short"
    });

    // Generate unique Member ID
    const memberId = `D4-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    console.log("📝 Member ID:", memberId);

    // 1. Send email to admin
    console.log("📧 Sending admin email...");
    await transporter.sendMail({
      from: `"D4 Community" <${process.env.GMAIL_USER}>`,
      to: "help.d4community@gmail.com",
      replyTo: email,
      subject: `🚀 New Member Application: ${name}`,
      html: generateAdminEmail({
        name,
        email,
        role: role || '',
        interest: interest || [],
        experience: experience || '',
        whyJoin: whyJoin || '',
        timestamp,
        memberId
      }),
    });
    console.log("✅ Admin email sent");

    // 2. Send welcome email
    console.log("📧 Sending welcome email...");
    await transporter.sendMail({
      from: `"D4 Community" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `🎊 Welcome to D4 Community, ${name}!`,
      html: generateWelcomeEmail(name),
    });
    console.log("✅ Welcome email sent");

    // 3. Generate and send certificate (with better error handling)
    console.log("📄 Generating certificate PDF...");
    let certificateSent = false;
    
    try {
      const certificateBuffer = await generateCertificatePDF(name, new Date(), memberId);
      
      if (certificateBuffer && certificateBuffer.length > 0) {
        console.log("✅ PDF generated, size:", certificateBuffer.length, "bytes");
        
        console.log("📧 Sending certificate email with PDF...");
        await transporter.sendMail({
          from: `"D4 Community" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: `📜 Your D4 Community Membership Certificate, ${name}!`,
          html: generateCertificateEmail(name, memberId),
          attachments: [
            {
              filename: `D4-Community-Certificate-${name.replace(/\s/g, "-")}.pdf`,
              content: certificateBuffer,
              contentType: "application/pdf",
            },
          ],
        });
        console.log("✅ Certificate email sent with PDF attachment");
        certificateSent = true;
      } else {
        throw new Error("PDF buffer is empty");
      }
    } catch (certError: any) {
      console.error("❌ Certificate generation failed:", certError.message);
      
      // Send certificate email without PDF as fallback
      try {
        await transporter.sendMail({
          from: `"D4 Community" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: `📜 Your D4 Community Membership Certificate, ${name}!`,
          html: generateCertificateEmail(name, memberId),
        });
        console.log("✅ Certificate email sent (HTML certificate - PDF generation failed)");
      } catch (fallbackError) {
        console.error("❌ Even fallback email failed:", fallbackError);
      }
    }

    // 4. Store in Google Sheets
    console.log("📊 Saving to Google Sheets...");
    let sheetSuccess = false;
    
    try {
      const sheetResult = await addToGoogleSheets({
        name,
        email,
        role: role || '',
        experience: experience || '',
        interest: interest || [],
        whyJoin: whyJoin || '',
        timestamp,
        memberId
      });
      
      if (sheetResult.success) {
        console.log("✅ Successfully saved to Google Sheets");
        sheetSuccess = true;
      } else {
        console.error("❌ Failed to save to Google Sheets:", sheetResult.error);
      }
    } catch (sheetError) {
      console.error("❌ Google Sheets error:", sheetError);
    }

    console.log(`=== ✅ Successfully processed ${name} (${email}) ===`);
    
    return NextResponse.json(
      { 
        success: true, 
        message: certificateSent 
          ? "Application submitted successfully! Check your email for your membership certificate PDF."
          : "Application submitted successfully! Your membership certificate has been sent as an HTML email (PDF generation encountered an issue).",
        memberId,
        certificateSent
      }
    );

  } catch (error: any) {
    console.error("=== ❌ API Error ===");
    console.error(error);
    
    let errorMessage = "Failed to send email. Please try again later.";
    
    if (error.code === "EAUTH") {
      errorMessage = "Email authentication failed. Please check email configuration.";
    } else if (error.code === "EENVELOPE") {
      errorMessage = "Invalid email address. Please check the email provided.";
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      },
      { status: 500 }
    );
  }
}