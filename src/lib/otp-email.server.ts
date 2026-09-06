/**
 * otp-email.server.ts
 *
 * Runs ONLY on the server (TanStack Start SSR).
 * Calls Brevo API securely — no CORS, no exposed API keys in the browser.
 */

export async function sendBrevoOTPEmail(
  toEmail: string,
  otp: string,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env["VITE_BREVO_API_KEY"] ?? "";
  const senderEmail =
    process.env["VITE_ADMIN_SENDER_EMAIL"] ?? "yoursclinicnoreply@yahoo.com";

  if (!apiKey) {
    console.error("[OTP Server] VITE_BREVO_API_KEY is not set in environment.");
    return { ok: false, error: "Email service is not configured (missing API key)." };
  }

  const payload = {
    sender: { name: "Yours-Clinic Admin", email: senderEmail },
    to: [{ email: toEmail, name: "Admin User" }],
    subject: "Your Yours-Clinic Admin OTP Code",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; padding: 28px; background: #f8fafc; border-radius: 12px; max-width: 480px; margin: 0 auto; border: 1px solid #e2e8f0;">
        <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">Yours-Clinic Admin Login</h2>
        <p style="color: #334155; font-size: 15px; margin-bottom: 8px;">Your One-Time Password (OTP) for Admin Login is:</p>
        <div style="background: #1e293b; border-radius: 10px; padding: 18px 24px; text-align: center; margin: 20px 0; display: inline-block; width: 100%; box-sizing: border-box;">
          <span style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #f59e0b; font-family: 'Courier New', monospace;">${otp}</span>
        </div>
        <p style="color: #475569; font-size: 13px;">Enter this 6-digit code to proceed. It expires in <strong>10 minutes</strong> and can only be used once.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">If you did not request this code, you can safely ignore this email. No action is needed.</p>
      </div>
    `,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`[OTP Server] ✅ OTP email sent successfully to: ${toEmail}`);
      return { ok: true };
    }

    const errBody = await response.json().catch(() => ({ message: "Unknown error" }));
    console.error("[OTP Server] ❌ Brevo API error:", errBody);
    return {
      ok: false,
      error: (errBody as { message?: string }).message ?? `Brevo responded with ${response.status}`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[OTP Server] ❌ Network error calling Brevo:", message);
    return { ok: false, error: message };
  }
}
