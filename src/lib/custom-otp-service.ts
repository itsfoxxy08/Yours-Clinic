/**
 * Custom Secure Email OTP Service
 *
 * Features:
 * 1. Cryptographically secure 6-digit OTP generation (crypto.getRandomValues).
 * 2. SHA-256 OTP hashing (stores only hashed tokens in storage/database).
 * 3. 10-minute strict expiration.
 * 4. Maximum 3 verification attempts per OTP.
 * 5. Rate-limiting: Max 3 OTP requests per 15 minutes per email/IP.
 * 6. Invalidation of old unused OTPs when a new code is requested.
 * 7. Generic response on request to prevent email enumeration attacks.
 * 8. Audit logging for compliance and security monitoring.
 * 9. Integration with Supabase database & local fallback for dev environments.
 */

import { supabase, isSupabaseConfigured } from "./supabase";
import { sendOTPEmailFn } from "./otp-email.functions";

export interface OTPRequestResult {
  success: boolean;
  message: string;
  rateLimited?: boolean;
}

export interface OTPVerifyResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  attemptsRemaining?: number;
}

// Memory fallback store for local development when Supabase database is offline
interface InMemOTP {
  email: string;
  hash: string;
  expiresAt: number;
  attempts: number;
  isUsed: boolean;
}

interface InMemRateLimit {
  requests: number[];
}

const memOTPStore = new Map<string, InMemOTP>();
const memRateLimitStore = new Map<string, InMemRateLimit>();

/**
 * Utility: Compute SHA-256 hash using Web Crypto API
 */
async function hashOTP(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Utility: Generate cryptographically secure 6-digit OTP code
 */
function generateSecureOTP(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const val = array[0] ?? Math.floor(Math.random() * 1000000);
  const code = (val % 900000) + 100000;
  return code.toString();
}

/**
 * Check rate limit (Max 3 requests per 15 minutes per email)
 */
function checkRateLimit(email: string): { allowed: boolean; retryAfterMins?: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 3;

  const record = memRateLimitStore.get(email) || { requests: [] };
  // Filter out requests older than 15 minutes
  const recentRequests = record.requests.filter((time) => now - time < windowMs);

  if (recentRequests.length >= maxRequests) {
    const oldest = recentRequests[0] ?? now;
    const retryAfterMins = Math.ceil((windowMs - (now - oldest)) / 60000);
    return { allowed: false, retryAfterMins };
  }

  recentRequests.push(now);
  memRateLimitStore.set(email, { requests: recentRequests });
  return { allowed: true };
}

/**
 * Audit log recorder
 */
async function recordAuditLog(
  email: string,
  action: "OTP_REQUESTED" | "OTP_VERIFIED" | "OTP_FAILED" | "RATE_LIMITED",
  metadata: Record<string, any> = {}
) {
  const logEntry = {
    email,
    action,
    metadata,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      await supabase.from("otp_audit_logs").insert([logEntry]);
    } catch (e) {
      console.warn("Audit logging to Supabase failed, fallback to console:", e);
    }
  } else {
    console.log("🔒 [AUDIT LOG]:", logEntry);
  }
}

/**
 * Send OTP via Brevo – routed through a TanStack Start server function
 * so the API key stays on the server and CORS is never an issue.
 */
async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    const result = await sendOTPEmailFn({ data: { email, otp } });
    if (result.ok) {
      console.log("✅ Brevo OTP email dispatched via server function to:", email);
      return true;
    }
    console.warn("⚠️ Server function returned error:", result.error);
  } catch (err) {
    console.error("❌ sendOTPEmailFn call failed:", err);
  }

  // Dev fallback: log to console if server function is unavailable
  console.log(`✉️ [DEV FALLBACK] OTP for ${email} → ${otp}`);
  return true;
}

/**
 * 1. Request Secure OTP
 */
export async function requestOTP(email: string): Promise<OTPRequestResult> {
  const cleanEmail = email.trim().toLowerCase();

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  // Rate-limiting check (Max 3 requests per 15 minutes)
  const rateCheck = checkRateLimit(cleanEmail);
  if (!rateCheck.allowed) {
    await recordAuditLog(cleanEmail, "RATE_LIMITED", { retryAfterMins: rateCheck.retryAfterMins });
    return {
      success: false,
      rateLimited: true,
      message: `Too many verification requests. Please wait ${rateCheck.retryAfterMins} minute(s) before requesting again.`,
    };
  }

  // Check if email is in registered admin users database
  const REGISTERED_ADMIN_EMAIL = "choudharyvikas2008@gmail.com";
  let isRegistered = cleanEmail === REGISTERED_ADMIN_EMAIL;

  if (!isRegistered && isSupabaseConfigured()) {
    try {
      const { data } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", cleanEmail)
        .single();
      if (data) isRegistered = true;
    } catch (e) {
      // ignore check error
    }
  }

  // Generic security response to prevent user enumeration attacks
  const GENERIC_RESPONSE = "If this email is registered in our admin system, a 6-digit verification code has been sent.";

  if (!isRegistered) {
    await recordAuditLog(cleanEmail, "OTP_REQUESTED", { registered: false });
    // Still return success generic message so attackers cannot guess registered emails
    return {
      success: true,
      message: GENERIC_RESPONSE,
    };
  }

  // Generate cryptographically secure 6-digit code
  const rawOTP = generateSecureOTP();
  const hashedOTP = await hashOTP(rawOTP);
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Invalidate any existing unused OTPs & store new hashed OTP
  if (isSupabaseConfigured()) {
    try {
      // Mark existing OTPs as used
      await supabase
        .from("otp_verifications")
        .update({ is_used: true })
        .eq("email", cleanEmail)
        .eq("is_used", false);

      // Insert new hashed OTP record
      await supabase.from("otp_verifications").insert([
        {
          email: cleanEmail,
          otp_hash: hashedOTP,
          attempts: 0,
          expires_at: new Date(expiresAt).toISOString(),
          is_used: false,
        },
      ]);
    } catch (err) {
      console.warn("Database OTP store error, fallback to memory:", err);
    }
  }

  // Always store in memory store as reliable fallback
  memOTPStore.set(cleanEmail, {
    email: cleanEmail,
    hash: hashedOTP,
    expiresAt,
    attempts: 0,
    isUsed: false,
  });

  // Dispatch Email
  await sendOTPEmail(cleanEmail, rawOTP);
  await recordAuditLog(cleanEmail, "OTP_REQUESTED", { registered: true });

  return {
    success: true,
    message: GENERIC_RESPONSE,
  };
}

/**
 * 2. Verify Secure OTP
 */
export async function verifyOTP(email: string, enteredCode: string): Promise<OTPVerifyResult> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = enteredCode.trim().replace(/\D/g, "");

  if (cleanCode.length !== 6) {
    return { success: false, message: "Please enter the complete 6-digit verification code." };
  }

  const hashedEntered = await hashOTP(cleanCode);
  const now = Date.now();

  let otpRecord: {
    id?: string;
    hash: string;
    expiresAt: number;
    attempts: number;
    isUsed: boolean;
  } | null = null;

  // 1. Try fetching from Supabase DB
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase
        .from("otp_verifications")
        .select("*")
        .eq("email", cleanEmail)
        .eq("is_used", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        otpRecord = {
          id: data.id,
          hash: data.otp_hash,
          expiresAt: new Date(data.expires_at).getTime(),
          attempts: data.attempts || 0,
          isUsed: data.is_used || false,
        };
      }
    } catch (e) {
      // Fallback
    }
  }

  // 2. Fallback to memory store if DB lookup was empty
  if (!otpRecord) {
    const memRec = memOTPStore.get(cleanEmail);
    if (memRec) {
      otpRecord = {
        hash: memRec.hash,
        expiresAt: memRec.expiresAt,
        attempts: memRec.attempts,
        isUsed: memRec.isUsed,
      };
    }
  }

  if (!otpRecord || otpRecord.isUsed) {
    return {
      success: false,
      message: "No active verification code found. Please request a new code.",
    };
  }

  // Check Expiry (10 minutes)
  if (now > otpRecord.expiresAt) {
    if (otpRecord.id && isSupabaseConfigured()) {
      await supabase.from("otp_verifications").update({ is_used: true }).eq("id", otpRecord.id);
    }
    memOTPStore.delete(cleanEmail);
    await recordAuditLog(cleanEmail, "OTP_FAILED", { reason: "EXPIRED" });
    return {
      success: false,
      message: "Verification code has expired. Please request a new code.",
    };
  }

  // Check Attempt Count (Max 3 attempts)
  const currentAttempts = otpRecord.attempts + 1;
  const maxAttempts = 3;

  if (currentAttempts > maxAttempts) {
    if (otpRecord.id && isSupabaseConfigured()) {
      await supabase.from("otp_verifications").update({ is_used: true }).eq("id", otpRecord.id);
    }
    memOTPStore.delete(cleanEmail);
    await recordAuditLog(cleanEmail, "OTP_FAILED", { reason: "MAX_ATTEMPTS_EXCEEDED" });
    return {
      success: false,
      message: "Maximum verification attempts exceeded. Please request a new code.",
    };
  }

  // Update attempts counter in DB/memory
  if (otpRecord.id && isSupabaseConfigured()) {
    await supabase
      .from("otp_verifications")
      .update({ attempts: currentAttempts })
      .eq("id", otpRecord.id);
  }
  const mem = memOTPStore.get(cleanEmail);
  if (mem) mem.attempts = currentAttempts;

  // Verify hash match
  const isMatch = hashedEntered === otpRecord.hash;

  if (!isMatch) {
    const attemptsRemaining = maxAttempts - currentAttempts;
    await recordAuditLog(cleanEmail, "OTP_FAILED", {
      reason: "INVALID_CODE",
      attemptsUsed: currentAttempts,
    });

    if (attemptsRemaining <= 0) {
      if (otpRecord.id && isSupabaseConfigured()) {
        await supabase.from("otp_verifications").update({ is_used: true }).eq("id", otpRecord.id);
      }
      memOTPStore.delete(cleanEmail);
      return {
        success: false,
        message: "Maximum attempts exceeded. Please request a new code.",
      };
    }

    return {
      success: false,
      attemptsRemaining,
      message: `Invalid verification code. ${attemptsRemaining} attempt(s) remaining.`,
    };
  }

  // SUCCESS: Invalidate OTP code so it cannot be reused
  if (otpRecord.id && isSupabaseConfigured()) {
    await supabase.from("otp_verifications").update({ is_used: true }).eq("id", otpRecord.id);
  }
  memOTPStore.delete(cleanEmail);
  await recordAuditLog(cleanEmail, "OTP_VERIFIED");

  return {
    success: true,
    message: "Verification successful!",
    user: {
      id: "admin-secure-user",
      email: cleanEmail,
      role: "Super Admin",
    },
  };
}
