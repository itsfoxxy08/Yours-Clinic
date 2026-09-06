/**
 * otp-email.functions.ts
 *
 * TanStack Start server function — runs on the server, never the browser.
 *
 * IMPORTANT: import.meta.env vars must be read at MODULE LEVEL,
 * not inside the handler — Vite injects them during compilation.
 */

import { createServerFn } from "@tanstack/react-start";

// Read at module level — Vite replaces these at compile/dev time
const BREVO_KEY = import.meta.env["VITE_BREVO_API_KEY"] as string | undefined;
const SENDER = (import.meta.env["VITE_ADMIN_SENDER_EMAIL"] as string | undefined) ?? "yoursclinicnoreply@yahoo.com";

export const sendOTPEmail = createServerFn({ method: "POST" })
  .validator((raw: unknown) => {
    const d = raw as { email: string; otp: string };
    if (!d.email || !d.otp) throw new Error("email and otp required");
    return d;
  })
  .handler(async ({ data }) => {
    const { email, otp } = data;

    if (!BREVO_KEY) {
      console.error("[sendOTPEmail] ❌ VITE_BREVO_API_KEY not available");
      return { ok: false as const, error: "missing_key" };
    }

    console.log(`[sendOTPEmail] Sending OTP to ${email} via Brevo...`);

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": BREVO_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Yours-Clinic Admin", email: SENDER },
        to: [{ email, name: "Admin" }],
        subject: "Your Yours-Clinic Admin OTP Code",
        htmlContent: `
          <div style="font-family:Arial,sans-serif;padding:28px;background:#f8fafc;border-radius:12px;max-width:480px;margin:0 auto;border:1px solid #e2e8f0">
            <h2 style="color:#0f172a;margin-top:0">Yours-Clinic Admin Login</h2>
            <p style="color:#334155;font-size:15px">Your One-Time Password is:</p>
            <div style="background:#1e293b;border-radius:10px;padding:20px;text-align:center;margin:20px 0">
              <span style="font-size:40px;font-weight:900;letter-spacing:12px;color:#f59e0b;font-family:'Courier New',monospace">${otp}</span>
            </div>
            <p style="color:#475569;font-size:13px">Expires in <strong>10 minutes</strong>. One use only.</p>
            <p style="color:#94a3b8;font-size:12px;margin-bottom:0">If you did not request this, ignore this email.</p>
          </div>`,
      }),
    });

    if (res.ok) {
      console.log(`[sendOTPEmail] ✅ OTP sent to ${email}`);
      return { ok: true as const };
    }

    const err = await res.json().catch(() => ({ message: "unknown" }));
    console.error(`[sendOTPEmail] ❌ Brevo error:`, err);
    return { ok: false as const, error: (err as { message?: string }).message ?? "brevo_error" };
  });
