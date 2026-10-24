import { NextResponse } from "next/server";
import { profile } from "@/data/profile";
import { contactFormSchema } from "@/lib/contact-schema";

// In-memory rate limiter (max 5 requests per 10 minutes per IP).
// Best-effort: Serverless instances do not share memory, so it reduces casual spam but is not a hard guarantee.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return false;
  }
  if (entry.count >= 5) {
    return true;
  }
  entry.count += 1;
  return false;
}

export async function POST(req: Request) {
  try {
    // Rate limit check
    const clientIp = (req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1").trim();
    if (checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    const data = await req.json();

    // Honeypot check: silently succeed without dispatching
    if (data?.hp && typeof data.hp === "string" && data.hp.trim().length > 0) {
      return NextResponse.json({
        success: true,
        message: "Message processed successfully.",
      });
    }

    // Strict Zod schema validation for all compulsory fields
    const parsed = contactFormSchema.safeParse(data);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || "Validation failed.";
      return NextResponse.json(
        { error: firstIssue, details: parsed.error.issues },
        { status: 400 }
      );
    }

    const {
      name: cleanName,
      email: cleanEmail,
      whatsapp: cleanWhatsapp,
      inquiryType: cleanInquiry,
      message: cleanMessage,
    } = parsed.data;

    const receiverEmail = process.env.SAMAR_RECEIVER_EMAIL || profile.email;
    const receiverWhatsApp = (process.env.SAMAR_WHATSAPP_NUMBER || profile.phone).replace(/[^0-9]/g, "");
    const resendApiKey = process.env.RESEND_API_KEY;
    const callMeBotKey = process.env.CALLMEBOT_API_KEY;
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuth = process.env.TWILIO_AUTH_TOKEN;

    // Format plain text content (never echoed back as HTML)
    const textContent = `
New Contact Inquiry from Portfolio:
------------------------------------
Name: ${cleanName}
Email: ${cleanEmail}
WhatsApp/Phone: ${cleanWhatsapp || "Not provided"}
Inquiry Type: ${cleanInquiry}
Date: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST

Message:
${cleanMessage}
------------------------------------
    `.trim();

    // 1. Send Email (via Resend API if configured)
    let emailSent = false;
    if (resendApiKey && resendApiKey.startsWith("re_")) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: [receiverEmail],
            reply_to: cleanEmail,
            subject: `[Portfolio] ${cleanInquiry} from ${cleanName}`,
            text: textContent,
          }),
        });
        emailSent = res.ok;
      } catch (err) {
        console.error("Resend API error:", err);
      }
    }

    // 2. Send WhatsApp Notification (via CallMeBot if configured)
    let whatsappSent = false;
    if (callMeBotKey && callMeBotKey.trim().length > 0 && receiverWhatsApp) {
      try {
        const cleanDigits = receiverWhatsApp.replace(/[^0-9]/g, "");
        const phoneParam = encodeURIComponent(`+${cleanDigits}`);
        const encodedMsg = encodeURIComponent(
          `*New Portfolio Message*\n*From:* ${cleanName}\n*Email:* ${cleanEmail}\n*Phone:* ${cleanWhatsapp || "N/A"}\n*Type:* ${cleanInquiry}\n*Msg:* ${cleanMessage}`
        );
        const url = `https://api.callmebot.com/whatsapp.php?phone=${phoneParam}&text=${encodedMsg}&apikey=${encodeURIComponent(callMeBotKey.trim())}`;
        const waRes = await fetch(url);
        whatsappSent = waRes.ok;
      } catch (err) {
        console.error("CallMeBot error:", err);
      }
    } else if (twilioSid && twilioAuth && receiverWhatsApp) {
      try {
        const fromNumber = process.env.TWILIO_WHATSAPP_FROM || "+14155238886";
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
        const bodyParams = new URLSearchParams();
        bodyParams.append("From", `whatsapp:${fromNumber}`);
        bodyParams.append("To", `whatsapp:+${receiverWhatsApp}`);
        bodyParams.append("Body", textContent);

        const twRes = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${twilioSid}:${twilioAuth}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: bodyParams.toString(),
        });
        whatsappSent = twRes.ok;
      } catch (err) {
        console.error("Twilio error:", err);
      }
    }

    // Direct WhatsApp Click-to-Chat URL backup
    const clientWaMsg = encodeURIComponent(
      `Hi Samar,\nMy name is ${cleanName} (${cleanEmail}).\nRegarding: ${cleanInquiry}\n\n${cleanMessage}`
    );
    const directWhatsAppUrl = `https://wa.me/${receiverWhatsApp}?text=${clientWaMsg}`;

    return NextResponse.json({
      success: true,
      emailSent,
      whatsappSent,
      directWhatsAppUrl,
      message: "Message processed successfully.",
    });
  } catch (error) {
    console.error("Contact API route error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while sending message." },
      { status: 500 }
    );
  }
}
