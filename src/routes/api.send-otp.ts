/**
 * API Route: POST /api/send-otp
 *
 * Runs entirely on the Nitro server — no CORS, no exposed API key.
 */

import { createAPIFileRoute } from "@tanstack/react-start/api";

export const Route = createAPIFileRoute("/api/send-otp")({
  POST: async ({ request }: { request: Request }) => {
    const BREVO_API_KEY =
      process.env["VITE_BREVO_API_KEY"] ?? "";
    const SENDER_EMAIL =
      process.env["VITE_ADMIN_SENDER_EMAIL"] ?? "yoursclinicnoreply@yahoo.com";

    try {
      const body = (await request.json()) as { email?: string; otp?: string };
      const { email, otp } = body;

      if (!email || !otp || !/^\d{6}$/.test(otp)) {
        return new Response(JSON.stringify({ ok: false, error: "Invalid input" }), {
          status: 400,
          headers: { "content-type": "application/json" },
        });
      }

      if (!BREVO_API_KEY) {
        console.error("[/api/send-otp] VITE_BREVO_API_KEY not set");
        return new Response(JSON.stringify({ ok: false, error: "Email service not configured" }), {
          status: 500,
          headers: { "content-type": "application/json" },
        });
      }

      const payload = {
        sender: { name: "Yours-Clinic Admin", email: SENDER_EMAIL },
        to: [{ email, name: "Admin User" }],
        subject: "Your Yours-Clinic Admin OTP Code",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 28px; background: #f8fafc; border-radius: 12px; max-width: 480px; margin: 0 auto; border: 1px solid #e2e8f0;">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Yours-Clinic Admin Login</h2>
            <p style="color: #334155; font-size: 15px; margin-bottom: 8px;">Your One-Time Password (OTP) for Admin Login is:</p>
            <div style="background: #1e293b; border-radius: 10px; padding: 18px 24px; text-align: center; margin: 20px 0;">
              <span style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #f59e0b; font-family: 'Courier New', monospace;">${otp}</span>
            </div>
            <p style="color: #475569; font-size: 13px;">This code expires in <strong>10 minutes</strong> and can only be used once.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">If you did not request this, ignore this email.</p>
          </div>
        `,
      };

      const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": BREVO_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (brevoRes.ok) {
        console.log(`[/api/send-otp] ✅ OTP sent to ${email}`);
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }

      const err = await brevoRes.json().catch(() => ({ message: "Unknown Brevo error" }));
      console.error("[/api/send-otp] ❌ Brevo error:", err);
      return new Response(
        JSON.stringify({ ok: false, error: (err as { message?: string }).message }),
        { status: 500, headers: { "content-type": "application/json" } },
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[/api/send-otp] ❌ Exception:", msg);
      return new Response(JSON.stringify({ ok: false, error: msg }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  },
});
