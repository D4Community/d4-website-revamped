import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { 
      name, 
      email, 
      phone, 
      role, 
      interest = [], 
      experience, 
      subject, 
      other, 
      message 
    } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error("Missing email configuration");
      return NextResponse.json(
        { error: "Email service is not configured. Please contact the administrator." },
        { status: 500, headers: corsHeaders }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      pool: true,
      maxConnections: 1,
    });

    const mailOptions = {
      from: `"D4 Community" <${process.env.GMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL || process.env.GMAIL_USER,
      replyTo: email,
      subject: subject 
        ? `D4 Community: ${subject}` 
        : `New D4 Community Application`,
      html: generateEmailTemplate({
        name,
        email,
        phone: phone || "Not provided",
        role: role || "Not provided",
        interest,
        experience: experience || "Not provided",
        subject: subject || "No subject provided",
        other: other || "Not provided",
        message,
        timestamp: new Date().toLocaleString("en-IN", { 
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short"
        }),
      }),
    };

    await transporter.sendMail(mailOptions);
    
    console.log("Email sent successfully");

    return NextResponse.json(
      { 
        success: true, 
        message: "Form submitted successfully! We'll contact you soon." 
      },
      { headers: corsHeaders }
    );

  } catch (error: any) {
    console.error("Email sending error:", error);
    
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
      { status: 500, headers: corsHeaders }
    );
  }
}

function generateEmailTemplate(data: any) {
  // LinkedIn banner URL
  const bannerImageUrl = "https://media.licdn.com/dms/image/v2/D4D3DAQEWfoiP69F5Mw/image-scale_191_1128/image-scale_191_1128/0/1736758649950/d4community_cover?e=1769936400&v=beta&t=O3EtggKJeZcnnVsVVDLIoe3lxAhr9GDnkbINB88fQM4";
  
  // Helper function to escape HTML and preserve line breaks
  const formatMessage = (text: string) => {
    if (!text) return '';
    
    // Escape HTML special characters
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    
    // Convert line breaks to <br> tags
    escaped = escaped.replace(/\n/g, '<br>');
    
    return escaped;
  };

  // Format all text fields
  const formattedMessage = formatMessage(data.message);
  const formattedName = data.name.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const formattedEmail = data.email.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const formattedPhone = data.phone.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const formattedRole = data.role.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const formattedExperience = data.experience.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const formattedSubject = data.subject.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const formattedOther = data.other.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
      <title>New D4 Community Application</title>
      <style>
        /* Reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #000000;
          padding: 0;
          margin: 0;
          -webkit-font-smoothing: antialiased;
        }
        
        /* Main Container */
        .email-wrapper {
          max-width: 600px;
          margin: 0 auto;
          background: #000000;
          width: 100%;
        }
        
        /* Banner Section */
        .banner-section {
          width: 100%;
          background: #000000;
        }
        
        .banner-img {
          display: block;
          width: 100%;
          max-width: 600px;
          height: auto;
          border: 0;
        }
        
        /* Content Container */
        .content-container {
          padding: 30px 20px;
          width: 100%;
        }
        
        /* Header */
        .email-header {
          margin-bottom: 25px;
          text-align: center;
          width: 100%;
        }
        
        .email-title {
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        
        .email-subtitle {
          font-size: 14px;
          color: #e5c377;
          line-height: 1.4;
        }
        
        /* Info Card */
        .info-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          border: 1px solid #e5e7eb;
          width: 100%;
        }
        
        .applicant-name {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
          line-height: 1.3;
        }
        
        .applicant-role {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 20px;
          line-height: 1.4;
        }
        
        /* Info Grid - SIMPLE TABLE LAYOUT */
        .info-grid {
          width: 100%;
          border-collapse: collapse;
        }
        
        .info-row {
          display: table-row;
          width: 100%;
        }
        
        .info-label {
          display: table-cell;
          padding: 10px 8px 10px 0;
          font-size: 13px;
          font-weight: 600;
          color: #4b5563;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          width: 35%;
          max-width: 120px;
          vertical-align: top;
          line-height: 1.4;
          white-space: nowrap;
        }
        
        .info-value {
          display: table-cell;
          padding: 10px 0;
          font-size: 15px;
          color: #111827;
          vertical-align: top;
          line-height: 1.5;
          word-break: break-word;
        }
        
        .info-value a {
          color: #3b82f6;
          text-decoration: none;
        }
        
        .info-value a:hover {
          text-decoration: underline;
        }
        
        /* Message Section */
        .message-section {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px;
          margin-top: 20px;
          border: 1px solid #e5e7eb;
          width: 100%;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
          line-height: 1.3;
        }
        
        .message-content {
          font-size: 15px;
          line-height: 1.6;
          color: #4b5563;
          background: #f9fafb;
          padding: 18px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: normal;
          width: 100%;
        }
        
        /* Interests */
        .interests-container {
          margin-top: 16px;
          width: 100%;
        }
        
        .interests {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }
        
        .interest-tag {
          background: #e0e7ff;
          color: #3730a3;
          padding: 5px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid #c7d2fe;
          line-height: 1.3;
        }
        
        /* Divider */
        .divider {
          height: 1px;
          background: #e5e7eb;
          margin: 25px 0;
          width: 100%;
        }
        
        /* Action Card */
        .action-card {
          background: #f0f9ff;
          border-radius: 12px;
          padding: 18px;
          border: 1px solid #bae6fd;
          margin-top: 20px;
          width: 100%;
        }
        
        .action-title {
          color: #0369a1;
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        
        .action-text {
          color: #0c4a6e;
          font-size: 14px;
          line-height: 1.5;
        }
        
        /* Footer */
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #374151;
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
          width: 100%;
        }
        
        .footer-logo {
          color: #ffffff;
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 4px;
          line-height: 1.3;
        }
        
        .footer-tagline {
          color: #e5c377;
          font-size: 13px;
          margin-bottom: 12px;
          line-height: 1.4;
        }
        
        .footer-email {
          margin: 8px 0;
        }
        
        .footer-email a {
          color: #60a5fa;
          text-decoration: none;
        }
        
        .footer-email a:hover {
          color: #3b82f6;
        }
        
        .timestamp {
          margin-top: 12px;
          font-size: 12px;
          color: #9ca3af;
          font-style: italic;
          line-height: 1.4;
        }
        
        /* Mobile-specific styles */
        @media only screen and (max-width: 640px) {
          .content-container {
            padding: 20px 15px;
          }
          
          .email-title {
            font-size: 20px;
          }
          
          .email-subtitle {
            font-size: 13px;
          }
          
          .info-card {
            padding: 16px;
          }
          
          .applicant-name {
            font-size: 17px;
          }
          
          .applicant-role {
            font-size: 13px;
            margin-bottom: 16px;
          }
          
          /* Switch to block layout on mobile */
          .info-grid {
            display: block;
          }
          
          .info-row {
            display: block;
            margin-bottom: 12px;
            width: 100%;
          }
          
          .info-label {
            display: block;
            width: 100%;
            padding: 0 0 4px 0;
            font-size: 12px;
            white-space: normal;
            max-width: 100%;
          }
          
          .info-value {
            display: block;
            width: 100%;
            padding: 0;
            font-size: 14px;
          }
          
          .message-section {
            padding: 16px;
          }
          
          .section-title {
            font-size: 15px;
            margin-bottom: 12px;
          }
          
          .message-content {
            padding: 16px;
            font-size: 14px;
          }
          
          .action-card {
            padding: 16px;
          }
          
          .action-title {
            font-size: 14px;
          }
          
          .action-text {
            font-size: 13px;
          }
          
          .footer {
            padding-top: 16px;
            font-size: 13px;
          }
          
          .footer-logo {
            font-size: 15px;
          }
          
          .footer-tagline {
            font-size: 12px;
          }
          
          .timestamp {
            font-size: 11px;
          }
        }
        
        @media only screen and (max-width: 480px) {
          .content-container {
            padding: 15px 12px;
          }
          
          .email-title {
            font-size: 18px;
          }
          
          .info-card {
            padding: 14px;
          }
          
          .message-section {
            padding: 14px;
          }
          
          .message-content {
            padding: 14px;
          }
          
          .interest-tag {
            font-size: 11px;
            padding: 4px 8px;
          }
        }
        
        /* Ensure images don't overflow */
        img {
          max-width: 100%;
          height: auto;
        }
        
        /* Prevent auto-zoom on iOS */
        input, textarea, select {
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <!-- Banner -->
        <div class="banner-section">
          <img src="${bannerImageUrl}" alt="D4 Community" class="banner-img" width="600" style="width: 100%; max-width: 600px; height: auto;">
        </div>
        
        <!-- Content -->
        <div class="content-container">
          <!-- Header -->
          <div class="email-header">
            <h1 class="email-title">New Community Application</h1>
            <p class="email-subtitle">Someone wants to join D4 Community</p>
          </div>
          
          <!-- Applicant Info Card -->
          <div class="info-card">
            <h2 class="applicant-name">${formattedName}</h2>
            <p class="applicant-role">${formattedRole}</p>
            
            <table class="info-grid">
              <tr class="info-row">
                <td class="info-label">Email:</td>
                <td class="info-value">
                  <a href="mailto:${formattedEmail}">${formattedEmail}</a>
                </td>
              </tr>
              
              ${formattedPhone !== "Not provided" ? `
              <tr class="info-row">
                <td class="info-label">Phone:</td>
                <td class="info-value">${formattedPhone}</td>
              </tr>
              ` : ''}
              
              ${formattedExperience !== "Not provided" ? `
              <tr class="info-row">
                <td class="info-label">Experience:</td>
                <td class="info-value">${formattedExperience}</td>
              </tr>
              ` : ''}
              
              ${formattedSubject !== "No subject provided" ? `
              <tr class="info-row">
                <td class="info-label">Subject:</td>
                <td class="info-value">${formattedSubject}</td>
              </tr>
              ` : ''}
              
              ${formattedOther !== "Not provided" ? `
              <tr class="info-row">
                <td class="info-label">Additional Info:</td>
                <td class="info-value">${formattedOther}</td>
              </tr>
              ` : ''}
            </table>
            
            ${data.interest && data.interest.length > 0 ? `
            <div class="interests-container">
              <div class="info-label" style="display: block; width: 100%; margin-bottom: 8px; padding: 0; font-size: 13px; font-weight: 600; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px;">Areas of Interest:</div>
              <div class="interests">
                ${data.interest.map((item: string) => {
                  const formattedItem = item.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                  return `<span class="interest-tag">${formattedItem}</span>`;
                }).join('')}
              </div>
            </div>
            ` : ''}
          </div>
          
          <!-- Message Section -->
          <div class="message-section">
            <h3 class="section-title">Message:</h3>
            <div class="message-content">
              ${formattedMessage}
            </div>
          </div>
          
          <!-- Divider -->
          <div class="divider"></div>
          
          <!-- Action Card -->
          <div class="action-card">
            <h4 class="action-title">
              Action Required
            </h4>
            <p class="action-text">
              This applicant is excited to join D4 Community! Please respond within 24 hours to welcome them and provide next steps.
            </p>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <div class="footer-logo">D4 Community</div>
            <div class="footer-tagline">Discite • Develop • Debug • Deploy</div>
            <div class="footer-email">
              <a href="mailto:help.d4community@gmail.com">help.d4community@gmail.com</a>
            </div>
            <div class="timestamp">
              Submitted on ${data.timestamp}
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}