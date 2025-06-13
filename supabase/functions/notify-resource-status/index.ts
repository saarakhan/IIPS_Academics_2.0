// supabase/functions/notify-resource-status/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"; 
import { Resend } from "npm:resend";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*", 
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS", 
};

// Configure your email details
const FROM_EMAIL_ADDRESS = "onboarding@resend.dev"; 
const ADMIN_EMAIL_FOR_REPLY = "iipsacademicspotal@gmail.com"; 

console.log("Edge Function 'notify-resource-status' initializing.");

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS preflight request.");
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    console.warn(`Invalid request method: ${req.method}. Expected POST.`);
    return new Response(JSON.stringify({ error: "Method not allowed. Please use POST." }), {
      status: 405, 
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
    console.log("Resend client initialized for notify-resource-status.");

    // Parse the payload from the database trigger (via pg_net)
    const payload = await req.json();
    const { user_email, resource_title, new_status, rejection_reason } = payload;

    console.log("Received payload:", payload);

    // Validate required fields
    if (!user_email || !resource_title || !new_status) {
      console.warn("Validation failed: Missing required fields in payload.", payload);
      return new Response(JSON.stringify({ error: "Missing required fields: user_email, resource_title, new_status." }), {
        status: 400, // Bad Request
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let emailSubject = "";
    let emailHtmlBody = "";

    const siteName = "IIPS Academics Portal"; // Or your actual site name

    if (new_status === 'APPROVED') {
      emailSubject = `Your Resource Submission Approved: "${resource_title}"`;
      emailHtmlBody = `
        <p>Hello,</p>
        <p>Great news! Your submitted resource, "<strong>${resource_title}</strong>", has been approved and is now available on the ${siteName}.</p>
        <p>Thank you for your contribution!</p>
        <p>Best regards,<br>The ${siteName} Team</p>
      `;
    } else if (new_status === 'REJECTED') {
      emailSubject = `Update on Your Resource Submission: "${resource_title}"`;
      emailHtmlBody = `
        <p>Hello,</p>
        <p>We've reviewed your submitted resource, "<strong>${resource_title}</strong>".</p>
        <p>Unfortunately, it was not approved at this time.</p>
        ${rejection_reason ? `<p><strong>Reason provided by admin:</strong> ${rejection_reason}</p>` : '<p>No specific reason was provided by the admin.</p>'}
        <p>Please review our contribution guidelines. If you have questions, you can reply to this email or contact our support.</p>
        <p>Best regards,<br>The ${siteName} Team</p>
      `;
    } else {
      // This case should ideally not be reached if the DB trigger only sends for APPROVED/REJECTED
      console.log(`Notification not configured for status: ${new_status}. Payload:`, payload);
      return new Response(JSON.stringify({ message: "Notification not applicable for this status." }), {
        status: 200, // Or 400 if this is considered an invalid input
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Attempting to send status notification to ${user_email} for resource "${resource_title}" (Status: ${new_status})`);

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: `${siteName} Updates <${FROM_EMAIL_ADDRESS}>`,
      to: [user_email], 
      reply_to: ADMIN_EMAIL_FOR_REPLY, // User replies will go to this address
      subject: emailSubject,
      html: emailHtmlBody,
    });

    if (emailError) {
      console.error("Resend API Error (notify-resource-status):", JSON.stringify(emailError, null, 2));
      // Log the specific error from Resend
      return new Response(JSON.stringify({ error: "Failed to send status notification email.", details: emailError.message || 'Unknown Resend error' }), {
        status: 502, 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Status notification email sent successfully to ${user_email} for resource "${resource_title}". Email ID: ${emailData?.id}`);
    return new Response(JSON.stringify({ message: "Status notification email sent successfully." }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("Unhandled exception in notify-resource-status Edge Function:", e.message, e.stack);
    return new Response(JSON.stringify({ error: "An unexpected server error occurred in notification function.", details: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
