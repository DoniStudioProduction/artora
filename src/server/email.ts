import dotenv from "dotenv";
dotenv.config();

// Custom beautiful HTML template generator using Artora luxury gold, ivory, and charcoal theme
function buildArtoraEmail(title: string, subtitle: string, bodyContent: string, buttonText?: string, buttonUrl?: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Playfair Display', 'Didot', 'Georgia', serif;
          background-color: #F8F8F6;
          color: #111111;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #111111;
          color: #F8F8F6;
          padding: 40px;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(201, 162, 39, 0.2);
        }
        .header {
          text-align: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 30px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 0.3em;
          color: #F8F8F6;
          text-decoration: none;
        }
        .logo-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          background-color: #C9A227;
          border-radius: 50%;
          margin-left: 4px;
        }
        .subtitle {
          font-family: 'Courier New', Courier, monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #C9A227;
          margin-top: 10px;
        }
        .content {
          line-height: 1.8;
          font-size: 14px;
          color: rgba(248, 248, 246, 0.85);
          font-family: 'Inter', system-ui, sans-serif;
        }
        .content h1 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #F8F8F6;
          margin-top: 0;
          font-weight: 300;
        }
        .button-wrapper {
          text-align: center;
          margin: 35px 0;
        }
        .btn {
          display: inline-block;
          background-color: #C9A227;
          color: #111111 !important;
          text-decoration: none;
          font-family: 'Courier New', Courier, monospace;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.2em;
          padding: 16px 36px;
          border-radius: 12px;
          transition: background-color 0.3s;
        }
        .footer {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
          font-family: 'Courier New', Courier, monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          color: rgba(248, 248, 246, 0.4);
        }
        .footer a {
          color: #C9A227;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">ARTORA<span class="logo-dot"></span></div>
          <div class="subtitle">${subtitle}</div>
        </div>
        <div class="content">
          <h1>${title}</h1>
          ${bodyContent}
        </div>
        ${buttonText && buttonUrl ? `
          <div class="button-wrapper">
            <a href="${buttonUrl}" class="btn" target="_blank">${buttonText}</a>
          </div>
        ` : ''}
        <div class="footer">
          This is an official transmission from the Artora Creative Guild.<br>
          Dedicated to preserving high-touch physical craft. v0.6.0<br>
          <a href="#">View Guild Charter</a> | <a href="#">Collector Support</a>
        </div>
      </div>
    </body>
    </html>
  `;
}

// SMTP mail dispatcher (lazily initialized or mocked)
export async function sendEmail(to: string, subject: string, htmlContent: string) {
  console.log(`✉️ Sending Email to [${to}] with Subject: "${subject}"`);
  
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      // Lazy import nodemailer to avoid startup dependency issues
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"Artora Guild" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: htmlContent,
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Email dispatched successfully via SMTP to ${to}`);
    } catch (err) {
      console.error("⚠️ SMTP transmission failed. Falling back to stdout log.", err);
    }
  } else {
    console.log("ℹ️ SMTP_USER or SMTP_PASS not set in environment. Raw Email output below:");
    console.log("-----------------------------------------");
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log("CONTENT TRUNCATED FOR LOGS (See built HTML templates in src/server/email.ts)");
    console.log("-----------------------------------------");
  }
}

// 1. Welcome Email
export function getWelcomeEmail(name: string): string {
  const body = `
    <p>Dear ${name},</p>
    <p>Welcome to <strong>Artora</strong>. You have crossed the threshold into a dedicated guild of sovereign creators and discerning collectors.</p>
    <p>Artora is built to support the slow, intentional, and physical crafts of our generation. By registering with us, you gain access to certified workshops, physical material verification certificates, and private studio journals from leading global artisans.</p>
    <p>We are thrilled to welcome you to our growing community.</p>
  `;
  return buildArtoraEmail(
    "Welcome to the Artora Guild",
    "MEMBER INITIATION",
    body,
    "Enter the Marketplace",
    process.env.APP_URL || "http://localhost:3000"
  );
}

// 2. Verify Email
export function getVerifyEmail(name: string, token: string): string {
  const verifyUrl = `${process.env.APP_URL || "http://localhost:3000"}/api/auth/verify?token=${token}`;
  const body = `
    <p>Dear ${name},</p>
    <p>To finalize your initiation into the guild and secure your Artora account, please verify your email address by clicking the link below.</p>
    <p>This verification link is active for 24 hours.</p>
  `;
  return buildArtoraEmail(
    "Verify Your Artora Account",
    "SIGNATURE VALIDATION",
    body,
    "Verify Email Address",
    verifyUrl
  );
}

// 3. Password Reset
export function getPasswordResetEmail(name: string, token: string): string {
  const resetUrl = `${process.env.APP_URL || "http://localhost:3000"}/api/auth/reset-password?token=${token}`;
  const body = `
    <p>Dear ${name},</p>
    <p>A request was submitted to reset your Artora account password. If you did not make this request, you can safely ignore this transmission.</p>
    <p>To proceed with setting a new credential, please use the button below.</p>
  `;
  return buildArtoraEmail(
    "Reset Your Credential Signature",
    "PASSCODE DESTRUCTION & REBUILD",
    body,
    "Reset Password",
    resetUrl
  );
}

// 4. Order Confirmation
export function getOrderConfirmationEmail(name: string, orderId: string, amount: number): string {
  const body = `
    <p>Dear ${name},</p>
    <p>This transmission confirms your luxury acquisition of Artora Guild pieces.</p>
    <p><strong>Order Identification:</strong> ${orderId}<br>
    <strong>Total Premium Amount:</strong> $${amount.toLocaleString()}</p>
    <p>The artisan has been notified and is preparing to wrap and secure your acquisition inside custom structural wooden crates designed for maximum physical protection.</p>
  `;
  return buildArtoraEmail(
    "Your Guild Acquisition is Confirmed",
    "TRANSACTION RECORDED",
    body,
    "View Order Status",
    process.env.APP_URL || "http://localhost:3000"
  );
}

// 5. Order Shipped
export function getOrderShippedEmail(name: string, orderId: string): string {
  const body = `
    <p>Dear ${name},</p>
    <p>Excellent news. Your physical order <strong>${orderId}</strong> has been secured inside a bespoke, padded crate and signed out of the studio vault.</p>
    <p>Our premium white-glove shipping courier has accepted the package and is executing safe transit directly to your verified address. It is fully covered under the Artora Gold Seal transit insurance.</p>
  `;
  return buildArtoraEmail(
    "Your Acquisition has Left the Vault",
    "CARRIER TRANSIT INITIATED",
    body,
    "Track Private Shipment",
    process.env.APP_URL || "http://localhost:3000"
  );
}

// 6. Order Delivered
export function getOrderDeliveredEmail(name: string, orderId: string): string {
  const body = `
    <p>Dear ${name},</p>
    <p>We have received verification that physical order <strong>${orderId}</strong> has been safely hand-delivered and unboxed at your address.</p>
    <p>Please inspect the material surfaces and place the included physical hand-signed authenticity certificate inside your private records.</p>
  `;
  return buildArtoraEmail(
    "Physical Acquisition Delivered",
    "TRANSIT COMPLETED & UNBOXED",
    body,
    "Confirm Satisfaction",
    process.env.APP_URL || "http://localhost:3000"
  );
}

// 7. New Message
export function getNewMessageEmail(name: string, senderName: string, messagePreview: string): string {
  const body = `
    <p>Dear ${name},</p>
    <p>The artisan <strong>${senderName}</strong> has sent you a secure direct message in the Artora Messenger.</p>
    <p style="padding: 16px; background: rgba(255,255,255,0.05); border-left: 3px solid #C9A227; font-style: italic; color: rgba(248, 248, 246, 0.75);">
      "${messagePreview}"
    </p>
    <p>Please log in to respond to the thread.</p>
  `;
  return buildArtoraEmail(
    "New Studio Transmission",
    "DIRECT CONVERSATION",
    body,
    "Reply in Artora Messenger",
    process.env.APP_URL || "http://localhost:3000"
  );
}

// 8. New Follower
export function getNewFollowerEmail(creatorName: string, followerName: string): string {
  const body = `
    <p>Warmest greetings ${creatorName},</p>
    <p>A new collector, <strong>${followerName}</strong>, has initiated following your studio and workshop journals.</p>
    <p>Keep your journal active with behind-the-scenes materials and work-in-progress pictures to engage them and convert attention into physical studio acquisition.</p>
  `;
  return buildArtoraEmail(
    "New Guild Follower Acquired",
    "COMMUNITY CONNECTED",
    body,
    "Open Your Studio Journal",
    process.env.APP_URL || "http://localhost:3000"
  );
}

// 9. Review Reminder
export function getReviewReminderEmail(name: string, productName: string): string {
  const body = `
    <p>Dear ${name},</p>
    <p>We trust that you are thoroughly enjoying your physical acquisition, <strong>${productName}</strong>.</p>
    <p>To support the artisan's studio standing and share your tactile experience with fellow collectors, please take a moment to leave a review and optionally upload a photograph of the piece in your space.</p>
  `;
  return buildArtoraEmail(
    "A Tactile Feedback Invitation",
    "ARTISAN REPUTATION HARVESTING",
    body,
    "Write Collector Review",
    process.env.APP_URL || "http://localhost:3000"
  );
}
