export const generateAdminEmail = (data: any) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>New Member Application</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 40px 20px; }
      .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
      .header { background: #fd7d6e; padding: 32px; text-align: center; }
      .header h1 { color: #ffffff; font-size: 22px; font-weight: 600; margin-bottom: 4px; }
      .header p { color: rgba(255,255,255,0.85); font-size: 13px; }
      .member-id { display: inline-block; background: rgba(255,255,255,0.2); color: #fff; font-family: monospace; font-size: 12px; padding: 4px 12px; border-radius: 20px; margin-top: 12px; }
      .content { padding: 32px; }
      .field { margin-bottom: 20px; }
      .label { font-size: 11px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
      .value { font-size: 15px; color: #333; line-height: 1.5; }
      .value a { color: #fd7d6e; text-decoration: none; }
      .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
      .tag { background: #fef5f3; color: #fd7d6e; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
      .footer { background: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #eee; font-size: 12px; color: #999; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New Member Application</h1>
        <p>${data.name} wants to join D4 Community</p>
        <div class="member-id">${data.memberId}</div>
      </div>
      <div class="content">
        <div class="field">
          <div class="label">Full Name</div>
          <div class="value">${data.name}</div>
        </div>
        <div class="field">
          <div class="label">Email</div>
          <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
        </div>
        ${data.role ? `<div class="field"><div class="label">Role</div><div class="value">${data.role}</div></div>` : ''}
        ${data.experience ? `<div class="field"><div class="label">Experience</div><div class="value">${data.experience}</div></div>` : ''}
        ${data.interest && data.interest.length > 0 ? `
        <div class="field">
          <div class="label">Interests</div>
          <div class="tags">${data.interest.map((i: string) => `<span class="tag">${i}</span>`).join('')}</div>
        </div>` : ''}
        ${data.whyJoin ? `<div class="field"><div class="label">Why Join</div><div class="value">${data.whyJoin}</div></div>` : ''}
        <div class="field">
          <div class="label">Submitted</div>
          <div class="value">${data.timestamp}</div>
        </div>
      </div>
      <div class="footer">
        <p>D4 Community - help.d4community@gmail.com</p>
      </div>
    </div>
  </body>
  </html>
`;

export const generateWelcomeEmail = (name: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Welcome to D4 Community</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; padding: 40px 20px; }
      .container { max-width: 560px; margin: 0 auto; background: #111; border-radius: 12px; overflow: hidden; border: 1px solid #222; }
      .header { background: linear-gradient(135deg, #fd7d6e, #ff9a8b); padding: 48px 32px; text-align: center; }
      .header h1 { color: #fff; font-size: 28px; font-weight: 600; margin-bottom: 8px; }
      .header p { color: rgba(255,255,255,0.85); font-size: 14px; }
      .content { padding: 40px 32px; }
      .greeting { font-size: 16px; color: #e0e0e0; margin-bottom: 20px; line-height: 1.6; }
      .greeting strong { color: #fd7d6e; }
      .message { color: #999; font-size: 14px; line-height: 1.7; margin-bottom: 28px; }
      .links { margin-bottom: 28px; }
      .link-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #222; }
      .link-item a { color: #fd7d6e; text-decoration: none; font-size: 13px; }
      .link-item a:hover { text-decoration: underline; }
      .cert-note { background: rgba(253,125,110,0.08); border-left: 3px solid #fd7d6e; padding: 16px; margin-bottom: 28px; border-radius: 8px; }
      .cert-note p { color: #999; font-size: 13px; line-height: 1.6; }
      .cert-note strong { color: #fd7d6e; }
      .footer { background: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #1a1a1a; font-size: 12px; color: #555; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to D4 Community</h1>
        <p>Your journey begins here</p>
      </div>
      <div class="content">
        <p class="greeting">Dear <strong>${name}</strong>,</p>
        <p class="message">Thank you for joining D4 Community! We're excited to have you as part of our community of developers, designers, and tech enthusiasts.</p>
        
        <div class="links">
          <div class="link-item">💬 <a href="https://chat.whatsapp.com/Khwy3LEyjdX4Kx8VJ1MXmW">Join WhatsApp Group</a></div>
          <div class="link-item">📢 <a href="https://whatsapp.com/channel/0029Va8QbTU8V0trPdleNl2I">WhatsApp Channel</a></div>
          <div class="link-item">💼 <a href="https://www.linkedin.com/company/d4community">LinkedIn</a></div>
          <div class="link-item">🐙 <a href="https://github.com/D4Community">GitHub</a></div>
          <div class="link-item">🎮 <a href="https://discord.com/invite/RPpYB8JpUQ">Discord</a></div>
        </div>
        
        <div class="cert-note">
          <p><strong>📜 Membership Certificate</strong><br>Your official membership certificate will arrive in a separate email within a minute.</p>
        </div>
        
        <p class="message" style="margin-bottom: 0;">
          Questions? <a href="mailto:help.d4community@gmail.com" style="color: #fd7d6e; text-decoration: none;">help.d4community@gmail.com</a>
        </p>
      </div>
      <div class="footer">
        <p>D4 Community - Discite • Develop • Debug • Deploy</p>
      </div>
    </div>
  </body>
  </html>
`;

export const generateCertificateEmail = (name: string, memberId: string) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Your D4 Community Certificate</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; padding: 40px 20px; }
      .container { max-width: 560px; margin: 0 auto; background: #111; border-radius: 12px; overflow: hidden; border: 1px solid #222; }
      .header { background: linear-gradient(135deg, #fd7d6e, #ff9a8b); padding: 48px 32px; text-align: center; }
      .header h1 { color: #fff; font-size: 26px; font-weight: 600; margin-bottom: 8px; }
      .header p { color: rgba(255,255,255,0.85); font-size: 13px; }
      .content { padding: 40px 32px; }
      .greeting { font-size: 16px; color: #e0e0e0; margin-bottom: 20px; line-height: 1.6; }
      .greeting strong { color: #fd7d6e; }
      .message { color: #999; font-size: 14px; line-height: 1.7; margin-bottom: 28px; }
      .cert-card { background: #0a0a0a; border: 1px solid #fd7d6e; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px; }
      .cert-card .member-name { color: #fd7d6e; font-size: 22px; font-weight: 700; letter-spacing: 1px; margin-bottom: 12px; }
      .cert-card .member-id { font-family: monospace; color: #666; font-size: 12px; margin-bottom: 16px; }
      .cert-card .divider { width: 40px; height: 2px; background: #fd7d6e; margin: 16px auto; }
      .cert-card .text { color: #777; font-size: 12px; line-height: 1.6; }
      .note { background: rgba(253,125,110,0.08); border-radius: 8px; padding: 16px; margin-bottom: 28px; text-align: center; }
      .note p { color: #888; font-size: 13px; }
      .note strong { color: #fd7d6e; }
      .footer { background: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #1a1a1a; font-size: 12px; color: #555; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Your Membership Certificate</h1>
        <p>Official D4 Community Member</p>
      </div>
      <div class="content">
        <p class="greeting">Dear <strong>${name}</strong>,</p>
        <p class="message">Congratulations! Your official D4 Community membership certificate is attached to this email.</p>
        
        <div class="cert-card">
          <div class="member-name">${name.toUpperCase()}</div>
          <div class="member-id">Member ID: ${memberId}</div>
          <div class="divider"></div>
          <div class="text">Official Member of D4 Community</div>
        </div>
        
        <div class="note">
          <p><strong>📎 PDF Attached</strong> — Your certificate is attached. Download, save, and share it proudly!</p>
        </div>
        
        <p class="message" style="margin-bottom: 0;">
          Welcome aboard!<br>
          <strong style="color: #fd7d6e;">The D4 Community Team</strong>
        </p>
      </div>
      <div class="footer">
        <p>D4 Community - help.d4community@gmail.com</p>
      </div>
    </div>
  </body>
  </html>
`;