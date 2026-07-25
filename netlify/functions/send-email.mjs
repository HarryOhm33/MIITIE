import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function getAdminDb() {
  if (!getApps().length) {
    const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
    if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
    }
  }
  return getApps().length ? getFirestore() : null;
}

// Initialize AWS SES Client
function getSesClient() {
  const rawRegion = process.env.SES_REGION || process.env.AWS_REGION;
  const region = (rawRegion && rawRegion !== "dev") ? rawRegion : "ap-south-1";

  const accessKeyId = process.env.SES_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.SES_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("SES_ACCESS_KEY_ID or SES_SECRET_ACCESS_KEY is missing in process.env. Please restart netlify dev so it reloads your .env file.");
  }

  return new SESClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
}

async function sendSESEmail({ to, subject, html }) {
  const sesClient = getSesClient();
  const fromEmail = process.env.SES_FROM_EMAIL || "noreply@miitie.org";
  const replyTo = process.env.REPLY_TO_EMAIL || "miitiedarbhanga0407@gmail.com";

  const command = new SendEmailCommand({
    Source: `MIITIE Incubation Center <${fromEmail}>`,
    Destination: {
      ToAddresses: Array.isArray(to) ? to : [to],
    },
    Message: {
      Subject: { Data: subject, Charset: "UTF-8" },
      Body: {
        Html: { Data: html, Charset: "UTF-8" },
      },
    },
    ReplyToAddresses: [replyTo],
  });

  return await sesClient.send(command);
}

// ---------------- HTML EMAIL TEMPLATES ----------------

function buildSubmitterTemplate({ type, name, formTitle, detailsHtml }) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
      .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
      .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
      .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
      .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1px; }
      .content { padding: 32px 24px; }
      .greeting { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
      .body-text { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
      .details-box { background: #fff7ed; border: 1px solid #ffedd5; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
      .details-title { font-size: 13px; font-weight: 700; color: #c2410c; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
      .detail-row { display: flex; margin-bottom: 8px; font-size: 14px; }
      .detail-label { font-weight: 600; color: #64748b; width: 130px; shrink: 0; }
      .detail-val { color: #0f172a; font-weight: 500; }
      .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-t: 1px solid #e2e8f0; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <h1>MIITIE</h1>
        <p>Innovation & Incubation Center</p>
      </div>
      <div class="content">
        <div class="greeting">Hello ${name || "Applicant"},</div>
        <div class="body-text">
          Thank you for reaching out to <strong>MIITIE</strong>! We have successfully received your <strong>${formTitle}</strong>.
          Our team is reviewing your details and will get back to you shortly.
        </div>
        <div class="details-box">
          <div class="details-title">Submission Summary</div>
          ${detailsHtml}
        </div>
        <div class="body-text" style="font-size: 13px; color: #64748b;">
          If you have any urgent queries, feel free to reply directly to this email or reach us at <a href="mailto:miitiedarbhanga0407@gmail.com" style="color: #f97316; font-weight: 600;">miitiedarbhanga0407@gmail.com</a>.
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} MIITIE - Darbhanga College of Engineering, Bihar. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}

function buildAdminTemplate({ formTitle, name, email, detailsHtml, targetUrl }) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
      .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
      .header { background: #0f172a; padding: 24px; text-align: center; color: #ffffff; border-bottom: 3px solid #f97316; }
      .header h1 { margin: 0; font-size: 20px; font-weight: 800; color: #f97316; }
      .header p { margin: 4px 0 0 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
      .content { padding: 28px 24px; }
      .alert-badge { display: inline-block; background: #ffedd5; color: #c2410c; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; margin-bottom: 12px; }
      .title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
      .details-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
      .detail-row { margin-bottom: 10px; font-size: 14px; }
      .detail-label { font-weight: 600; color: #64748b; margin-bottom: 2px; }
      .detail-val { color: #0f172a; font-weight: 500; word-break: break-word; }
      .btn { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px; text-align: center; }
      .footer { background: #f1f5f9; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <h1>MIITIE Admin Suite</h1>
        <p>New Form Submission Alert</p>
      </div>
      <div class="content">
        <span class="alert-badge">New Submission</span>
        <div class="title">New ${formTitle} Received</div>
        <div class="details-box">
          <div class="detail-row">
            <div class="detail-label">Applicant Name</div>
            <div class="detail-val">${name || "N/A"}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Email Address</div>
            <div class="detail-val">${email || "N/A"}</div>
          </div>
          ${detailsHtml}
        </div>
        <div style="text-align: center;">
          <a href="${targetUrl || 'https://miitie.org/admin'}" class="btn">View Details in Admin Portal</a>
        </div>
      </div>
      <div class="footer">
        You are receiving this notification because email alerts are enabled in your MIITIE Admin Settings.
      </div>
    </div>
  </body>
  </html>
  `;
}

// ---------------- MAIN HANDLER ----------------

export default async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { type, data } = await request.json();
    if (!type || !data) return json({ error: "Submission type and data are required" }, 400);

    let formTitle = "Form Submission";
    let submitterSubject = "We received your submission - MIITIE";
    let adminSubject = "New Submission Received - MIITIE Admin";
    let submitterDetailsHtml = "";
    let adminDetailsHtml = "";
    let adminTargetUrl = "https://miitie.org/admin";

    if (type === "mentor") {
      formTitle = "Mentor Application";
      submitterSubject = "Mentor Application Received - MIITIE";
      adminSubject = `New Mentor Application: ${data.name || "Applicant"}`;
      adminTargetUrl = "https://miitie.org/admin/mentor-applications";

      submitterDetailsHtml = `
        <div class="detail-row"><span class="detail-label">Profession:</span> <span class="detail-val">${data.profession || "N/A"}</span></div>
        <div class="detail-row"><span class="detail-label">Expertise:</span> <span class="detail-val">${data.expertise || "N/A"}</span></div>
        <div class="detail-row"><span class="detail-label">Experience:</span> <span class="detail-val">${data.experience || "N/A"}</span></div>
      `;
      adminDetailsHtml = `
        <div class="detail-row"><div class="detail-label">Profession</div><div class="detail-val">${data.profession || "N/A"}</div></div>
        <div class="detail-row"><div class="detail-label">Area of Expertise</div><div class="detail-val">${data.expertise || "N/A"}</div></div>
        <div class="detail-row"><div class="detail-label">Experience</div><div class="detail-val">${data.experience || "N/A"}</div></div>
        <div class="detail-row"><div class="detail-label">Motivation</div><div class="detail-val">${data.motivation || "N/A"}</div></div>
      `;
    } else if (type === "incubation") {
      formTitle = "Incubation Proposal";
      submitterSubject = "Incubation Application Received - MIITIE";
      adminSubject = `New Incubation Proposal: ${data.projectTitle || data.name || "Startup"}`;
      adminTargetUrl = "https://miitie.org/admin/incubation-applications";

      submitterDetailsHtml = `
        <div class="detail-row"><span class="detail-label">Project Title:</span> <span class="detail-val">${data.projectTitle || "N/A"}</span></div>
        <div class="detail-row"><span class="detail-label">Current Stage:</span> <span class="detail-val" style="text-transform: capitalize;">${data.stage || "Idea"}</span></div>
        <div class="detail-row"><span class="detail-label">Funding Needed:</span> <span class="detail-val">${data.fundingNeeded || "N/A"}</span></div>
      `;
      adminDetailsHtml = `
        <div class="detail-row"><div class="detail-label">Project Title</div><div class="detail-val">${data.projectTitle || "N/A"}</div></div>
        <div class="detail-row"><div class="detail-label">Startup Stage</div><div class="detail-val" style="text-transform: capitalize;">${data.stage || "N/A"}</div></div>
        <div class="detail-row"><div class="detail-label">Funding Requirement</div><div class="detail-val">${data.fundingNeeded || "N/A"}</div></div>
        <div class="detail-row"><div class="detail-label">Startup Idea</div><div class="detail-val">${data.startupIdea || "N/A"}</div></div>
      `;
    } else if (type === "contact") {
      formTitle = "Contact Message";
      submitterSubject = "Message Received - MIITIE";
      adminSubject = `New Contact Inquiry: ${data.subject || data.name || "Inquiry"}`;
      adminTargetUrl = "https://miitie.org/admin/contact-submissions";

      submitterDetailsHtml = `
        <div class="detail-row"><span class="detail-label">Subject:</span> <span class="detail-val">${data.subject || "N/A"}</span></div>
        <div class="detail-row"><span class="detail-label">Message:</span> <span class="detail-val">${data.message || "N/A"}</span></div>
      `;
      adminDetailsHtml = `
        <div class="detail-row"><div class="detail-label">Subject</div><div class="detail-val">${data.subject || "N/A"}</div></div>
        <div class="detail-row"><div class="detail-label">Message</div><div class="detail-val">${data.message || "N/A"}</div></div>
      `;
    }

    // 1. Send confirmation email to Submitter
    if (data.email) {
      try {
        const submitterHtml = buildSubmitterTemplate({
          type,
          name: data.name,
          formTitle,
          detailsHtml: submitterDetailsHtml,
        });
        await sendSESEmail({ to: data.email, subject: submitterSubject, html: submitterHtml });
      } catch (err) {
        console.error("Error sending submitter confirmation email:", err);
      }
    }

    // 2. Fetch subscribed admins from Firestore and send notification email
    const db = getAdminDb();
    if (db) {
      try {
        const usersSnap = await db.collection("users").get();
        const subscribedAdminEmails = [];

        usersSnap.forEach((docSnap) => {
          const userData = docSnap.data();
          if (
            (userData.isAdmin === true || userData.isSuperAdmin === true) &&
            userData.isMailNotif === true &&
            userData.email
          ) {
            subscribedAdminEmails.push(userData.email);
          }
        });

        if (subscribedAdminEmails.length > 0) {
          const adminHtml = buildAdminTemplate({
            formTitle,
            name: data.name,
            email: data.email,
            detailsHtml: adminDetailsHtml,
            targetUrl: adminTargetUrl,
          });

          await sendSESEmail({
            to: subscribedAdminEmails,
            subject: adminSubject,
            html: adminHtml,
          });
        }
      } catch (err) {
        console.error("Error querying subscribed admins / sending admin emails:", err);
      }
    }

    return json({ success: true });
  } catch (error) {
    console.error("send-email serverless function error:", error);
    return json({ error: error.message || "Failed to process email delivery" }, 500);
  }
};
