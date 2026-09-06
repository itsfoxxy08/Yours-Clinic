/**
 * otp-email.functions.ts
 *
 * TanStack Start server function — runs on the server, never the browser.
 */

import { createServerFn } from "@tanstack/react-start";
import fs from "node:fs";
import path from "node:path";

function readEnvFallback(): Record<string, string> {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const res: Record<string, string> = {};
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          res[key] = val;
        }
      }
      return res;
    }
  } catch {}
  return {};
}

function getBrevoApiKey(): string {
  try {
    const k = process.env["VITE_BREVO_API_KEY"];
    if (k) return k;
  } catch {}
  try {
    const k = import.meta.env["VITE_BREVO_API_KEY"];
    if (k) return k;
  } catch {}
  try {
    const k = process.env["VITE_BREVO_SMTP_KEY"];
    if (k) return k;
  } catch {}
  try {
    const k = import.meta.env["VITE_BREVO_SMTP_KEY"];
    if (k) return k;
  } catch {}
  try {
    const k = process.env["BREVO_API_KEY"];
    if (k) return k;
  } catch {}
  
  // File system fallback for local Node dev server
  const fileEnv = readEnvFallback();
  return fileEnv["VITE_BREVO_API_KEY"] || fileEnv["VITE_BREVO_SMTP_KEY"] || "";
}

function getAdminSenderEmail(): string {
  try {
    const s = import.meta.env["VITE_ADMIN_SENDER_EMAIL"];
    if (s) return s;
  } catch {}
  try {
    const s = process.env["VITE_ADMIN_SENDER_EMAIL"];
    if (s) return s;
  } catch {}

  const fileEnv = readEnvFallback();
  return fileEnv["VITE_ADMIN_SENDER_EMAIL"] || "yoursclinicnoreply@yahoo.com";
}

export const sendOTPEmail = createServerFn({ method: "POST" })
  .validator((raw: unknown) => {
    const d = raw as { email: string; otp: string };
    if (!d.email || !d.otp) throw new Error("email and otp required");
    return d;
  })
  .handler(async ({ data }) => {
    const { email, otp } = data;
    const apiKey = getBrevoApiKey();
    const senderEmail = getAdminSenderEmail();

    if (!apiKey) {
      console.error("[sendOTPEmail] ❌ Brevo API key is missing from environment");
      return { ok: false as const, error: "missing_key" };
    }

    console.log(`[sendOTPEmail] Sending OTP to ${email} via Brevo...`);

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Yours-Clinic Admin", email: senderEmail },
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
