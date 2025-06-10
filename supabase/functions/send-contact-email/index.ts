// supabase/functions/send-contact-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend";

const ALLOWED_ORIGINS = [
  "http://localhost:5173", // Adjust port if your local dev server uses a different one
  "https://iips-academics-2-0.vercel.app"
];

const TO_EMAIL_ADDRESS = "iipsacademicspotal@gmail.com";
// IMPORTANT: For production, verify a domain with Resend (e.g., yourproject.com)
// and use an email like "noreply@yourproject.com" for better deliverability.
const FROM_EMAIL_ADDRESS = "onboarding@resend.dev"; // Default Resend sending address for now

console.log("Edge Function 'send-contact-email' initializing.");

serve(async (req: Request) => {
  const requestOrigin = req.headers.get("Origin");
  let accessControlAllowOrigin = "";

  if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) {
    accessControlAllowOrigin = requestOrigin;
  } else if (!requestOrigin && req.method !== "OPTIONS") {
    console.log("Request received without an Origin header or from a non-explicitly-allowed origin.");
    
  }


  const corsHeaders = {
    "Access-Control-Allow-Origin": accessControlAllowOrigin || ALLOWED_ORIGINS[0], // Fallback to first allowed for safety, or be stricter
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle CORS preflight OPTIONS request
  if (req.method === "OPTIONS") {
    console.log(`Handling OPTIONS preflight request from origin: ${requestOrigin}`);
    return new Response("ok", { headers: corsHeaders });
  }

  // Ensure it's a POST request for submitting data
  if (req.method !== "POST") {
    console.warn(`Invalid request method: ${req.method}`);
    return new Response(JSON.stringify({ error: "Method not allowed. Please use POST." }), {
      status: 405, // Method Not Allowed
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("CRITICAL: RESEND_API_KEY secret not found in environment variables.");
      return new Response(JSON.stringify({ error: "Internal server configuration error: Email service API Key is missing." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const resend = new Resend(resendApiKey);
    console.log("Resend client initialized.");

    let name, senderEmail, userSubject, message;
    try {
      const body = await req.json();
      name = body.name;
      senderEmail = body.email; 
      userSubject = body.subject; 
      message = body.message;
      console.log("Request body parsed:", { name, senderEmail, userSubject: userSubject || "(not provided)", message: message ? "Present" : "Missing" });
    } catch (jsonError) {
      console.error("Error parsing JSON request body:", jsonError.message);
      return new Response(JSON.stringify({ error: "Invalid request body: Could not parse JSON." }), {
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    if (!name || !senderEmail || !message) {
      const missingFields = [];
      if (!name) missingFields.push("name");
      if (!senderEmail) missingFields.push("email");
      if (!message) missingFields.push("message");
      console.warn("Validation failed: Missing required fields:", missingFields.join(", "));
      return new Response(JSON.stringify({ error: `Missing required fields: ${missingFields.join(", ")}.` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!senderEmail.includes("@") || senderEmail.length < 5) {
        console.warn("Validation failed: Invalid sender email format:", senderEmail);
        return new Response(JSON.stringify({ error: "Invalid email format provided for your email address." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const emailSubjectContent = userSubject ? `Contact Form: ${userSubject}` : `Contact via IIPS Academics: ${name}`;
    const emailHtmlBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h3 style="color: #333;">New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email (Reply-To):</strong> <a href="mailto:${senderEmail}">${senderEmail}</a></p>
          <p><strong>Subject:</strong> ${userSubject || 'N/A'}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p><strong>Message:</strong></p>
          <div style="white-space: pre-wrap; padding: 10px; border: 1px solid #eee; background-color: #f9f9f9; border-radius: 4px;">${message}</div>
        </body>
      </html>
    `;

    console.log(`Attempting to send email via Resend. To: ${TO_EMAIL_ADDRESS}, From: ${FROM_EMAIL_ADDRESS}, Reply-To: ${senderEmail}`);

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: `IIPS Academics Contact <${FROM_EMAIL_ADDRESS}>`, 
      to: [TO_EMAIL_ADDRESS], 
      reply_to: senderEmail,
      subject: emailSubjectContent,
      html: emailHtmlBody,
    });

    if (emailError) {
      console.error("Resend API Error when sending email:", JSON.stringify(emailError, null, 2));
      return new Response(JSON.stringify({ error: "Failed to send email due to an issue with the email service.", details: emailError.message || 'Unknown Resend error' }), {
        status: 502, 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Email sent successfully via Resend. Email ID:", emailData?.id);
    return new Response(JSON.stringify({ message: "Your message has been sent successfully!", emailId: emailData?.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("Unhandled exception in Edge Function:", e.message, e.stack);
    return new Response(JSON.stringify({ error: "An unexpected server error occurred.", details: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
