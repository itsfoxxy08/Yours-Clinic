/**
 * Seed admin credentials into Supabase.
 * Call seedAdmin() once from the browser console or a temporary button.
 */
import { supabase, isSupabaseConfigured } from "./supabase";

export async function seedAdmin() {
  if (!isSupabaseConfigured()) {
    console.error("Supabase is not configured. Check your .env file.");
    return;
  }

  const email = "choudharyvikas2008@gmail.com";
  const password = "Yours_Clinic@2018";
  const phone = "+919711919263";
  const username = "admin";
  const role = "admin";

  console.log("🔄 Seeding admin user...");

  // 1. Register in Supabase Auth with email
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, role, phone },
    },
  });

  if (authError) {
    if (authError.message.includes("User already registered")) {
      console.log("✅ Admin auth user already exists, skipping auth signup.");
    } else {
      console.error("❌ Auth signup error:", authError.message);
    }
  } else {
    console.log("✅ Admin registered in Supabase Auth:", authData.user?.id);
  }

  // 2. Insert into admin_users table
  const { data, error } = await supabase
    .from("admin_users")
    .upsert(
      [
        {
          username,
          email,
          phone,
          password,
          role,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: "username" }
    )
    .select();

  if (error) {
    console.error("❌ DB insert error:", error.message);
    console.log(
      "💡 Make sure the 'admin_users' table exists in your Supabase database."
    );
    console.log(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id BIGSERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT,
        phone TEXT,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
  } else {
    console.log("✅ Admin credentials saved to admin_users table:", data);
  }

  return { authData, data };
}

/**
 * Send OTP to phone number via Supabase Auth
 */
export async function sendPhoneOTP(phone: string) {
  if (!isSupabaseConfigured()) {
    return { success: false, message: "Supabase not configured." };
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    phone: phone.replace(/\s/g, ""),
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: "OTP sent successfully!",
    data,
  };
}

/**
 * Verify OTP for phone number
 */
export async function verifyPhoneOTP(phone: string, otp: string) {
  if (!isSupabaseConfigured()) {
    return { success: false, message: "Supabase not configured." };
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone: phone.replace(/\s/g, ""),
    token: otp,
    type: "sms",
  });

  if (error) {
    return { success: false, message: error.message };
  }

  // Check if the authenticated user is an admin
  const { data: adminData } = await supabase
    .from("admin_users")
    .select("*")
    .eq("phone", phone.replace(/\s/g, ""))
    .single();

  if (!adminData) {
    // Sign out non-admin users
    await supabase.auth.signOut();
    return {
      success: false,
      message: "This phone number is not registered as an admin.",
    };
  }

  return {
    success: true,
    message: "OTP verified! Admin authenticated.",
    user: {
      id: data.user?.id || String(adminData.id),
      phone: adminData.phone,
      email: adminData.email,
      role: adminData.role || "admin",
    },
  };
}

/**
 * Send 6-Digit OTP email with sender name "Yours-Clinic Admin Login"
 */
export async function sendEmailOTP(email: string, otpCode?: string) {
  const cleanEmail = email.trim();
  const code = otpCode || Math.floor(100000 + Math.random() * 900000).toString();

  // 1. FormSubmit.co API (Instant email delivery to recipient inbox)
  try {
    fetch(`https://formsubmit.co/ajax/${encodeURIComponent(cleanEmail)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: `🔐 Yours-Clinic Admin Login OTP Code: ${code}`,
        _captcha: "false",
        _template: "box",
        from_name: "Yours-Clinic Admin Login",
        otp_code: code,
        message: `Your 6-Digit Security Verification OTP for Yours-Clinic Admin Login is: ${code}. Please enter this 6-digit code on the website to verify your session.`,
      }),
    }).catch((e) => console.warn("FormSubmit notice:", e));
  } catch (err) {
    console.warn("FormSubmit dispatch error:", err);
  }

  // 2. Web3Forms API (Secondary live email delivery)
  try {
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: "0c9d77e4-2f5a-4b92-8061-f3b79a8385db",
        subject: `🔐 Yours-Clinic Admin Login OTP Code: ${code}`,
        from_name: "Yours-Clinic Admin Login",
        to_email: cleanEmail,
        email: cleanEmail,
        message: `Your 6-Digit Security Verification OTP for Yours-Clinic Admin Login is: ${code}`,
      }),
    }).catch((e) => console.warn("Web3Forms notice:", e));
  } catch (err) {
    console.warn("Web3Forms error:", err);
  }

  // 3. Supabase Auth trigger if configured
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signInWithOtp({
        email: cleanEmail,
      });
    } catch (e) {
      console.warn("Supabase signInWithOtp notice:", e);
    }
  }

  return {
    success: true,
    message: `6-Digit Security OTP code dispatched to ${cleanEmail} from Yours-Clinic Admin Login`,
    code,
  };
}

/**
 * Verify OTP for email address via Supabase Auth
 */
export async function verifyEmailOTP(email: string, otp: string) {
  if (!isSupabaseConfigured()) {
    return { success: false, message: "Supabase credentials not configured." };
  }

  const cleanEmail = email.trim();
  const token = otp.trim();

  const { data, error } = await supabase.auth.verifyOtp({
    email: cleanEmail,
    token,
    type: "email",
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: "Email OTP verified!",
    user: data.user,
  };
}

