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
 * Send OTP to email address via Supabase Auth
 * Uses options.shouldCreateUser = false so unregistered emails never receive OTP or accounts.
 */
export async function sendEmailOTP(email: string) {
  const cleanEmail = email.trim().toLowerCase();

  if (cleanEmail !== "choudharyvikas2008@gmail.com") {
    return {
      success: false,
      message: "Only the registered admin email can access this portal.",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: "Supabase credentials not configured in environment variables.",
    };
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email: cleanEmail,
    options: {
      shouldCreateUser: false,
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message || "Failed to send verification code.",
    };
  }

  return {
    success: true,
    message: "Verification code sent to your email address.",
    data,
  };
}

/**
 * Verify OTP for email address via Supabase Auth verifyOtp
 */
export async function verifyEmailOTP(email: string, otp: string) {
  const cleanEmail = email.trim().toLowerCase();
  const token = otp.trim();

  if (cleanEmail !== "choudharyvikas2008@gmail.com") {
    return {
      success: false,
      message: "Only the registered admin email can access this portal.",
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: "Supabase credentials not configured.",
    };
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email: cleanEmail,
    token,
    type: "email",
  });

  if (error || !data?.user) {
    return {
      success: false,
      message: error?.message || "Invalid or expired verification code.",
    };
  }

  return {
    success: true,
    message: "Email OTP verified successfully!",
    user: data.user,
  };
}

