import { createClient } from "@supabase/supabase-js";

// Read Supabase credentials from environment variables with fallback defaults
const supabaseUrl =
  (import.meta.env["VITE_SUPABASE_URL"] as string) ||
  "https://mfstodnfiwmduozgagay.supabase.co";

const supabaseAnonKey =
  (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mc3RvZG5maXdtZHVvemdhZ2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NzQ3MDksImV4cCI6MjEwNDE1MDcwOX0.eewW6vKozsF4BP8NZHqR_TXuF-hf9nJ_Rzzgiy88CW0";

// Create singleton Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      !supabaseUrl.includes("placeholder") &&
      !supabaseAnonKey.includes("placeholder")
  );
}

export type AdminLoginMethod = "email" | "phone";

export interface AdminAuthResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email?: string | undefined;
    phone?: string | undefined;
    role?: string | undefined;
  };
}

export interface RegisterAdminInput {
  username: string;
  email?: string;
  phone?: string;
  password: string;
  role?: string;
}

/**
 * Stores/Registers admin credentials into Supabase 'admin_users' database table and Supabase Auth.
 */
export async function registerAdminInSupabase(
  input: RegisterAdminInput
): Promise<AdminAuthResult> {
  const { username, email, phone, password, role = "admin" } = input;

  if (!username.trim() || !password) {
    return { success: false, message: "Username and password are required." };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message:
        "Supabase credentials (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) are missing in environment variables. Please add them to your .env file.",
    };
  }

  try {
    // 1. If email is provided, register in Supabase Native Auth
    if (email && email.includes("@")) {
      const { error: authErr } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: { username: username.trim(), role },
        },
      });
      if (authErr && !authErr.message.includes("User already registered")) {
        console.warn("Supabase Auth note:", authErr.message);
      }
    }

    // 2. Insert or update into Supabase 'admin_users' database table
    const { data, error } = await supabase
      .from("admin_users")
      .upsert(
        [
          {
            username: username.trim(),
            email: email?.trim() || null,
            phone: phone?.trim() || null,
            password: password,
            role: role,
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "username" }
      )
      .select();

    if (error) {
      return {
        success: false,
        message: `Database Error: ${error.message}. Ensure 'admin_users' table exists in Supabase.`,
      };
    }

    return {
      success: true,
      message: `Admin credentials for "${username}" successfully saved into Supabase database!`,
      user: {
        id: String(data?.[0]?.id || username),
        email: email?.trim(),
        phone: phone?.trim(),
        role,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to store admin credentials in Supabase.",
    };
  }
}

/**
 * Authenticates admin users via Supabase Native Auth or Supabase `admin_users` Database Table.
 */
export async function authenticateAdmin(
  method: AdminLoginMethod,
  identifier: string,
  password: string
): Promise<AdminAuthResult> {
  const cleanId = identifier.trim();

  if (!cleanId || !password) {
    return { success: false, message: "Please provide both identifier and password." };
  }

  // Check if Supabase keys are provided in environment
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message:
        "Supabase credentials (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) are missing in environment variables. Please add them to your .env file to enable live database authentication.",
    };
  }

  try {
    if (method === "email") {
      // 1. Try Native Supabase Auth with Email
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanId,
        password: password,
      });

      if (!error && data.user) {
        return {
          success: true,
          message: "Admin authenticated successfully via Supabase Auth!",
          user: {
            id: data.user.id,
            email: data.user.email,
            role: (data.user.user_metadata?.["role"] as string) || "admin",
          },
        };
      }

      // 2. Fallback to Supabase Database 'admin_users' Table Query
      const { data: dbAdmin, error: dbError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", cleanId)
        .single();

      if (!dbError && dbAdmin) {
        if (dbAdmin.password === password || dbAdmin.password_hash === password) {
          return {
            success: true,
            message: "Authenticated via Supabase admin_users table!",
            user: {
              id: String(dbAdmin.id),
              email: dbAdmin.email,
              role: dbAdmin.role || "admin",
            },
          };
        }
      }

      return {
        success: false,
        message: error?.message || "Invalid email or password.",
      };
    }

    if (method === "phone") {
      // 1. Try Native Supabase Auth with Phone
      const { data, error } = await supabase.auth.signInWithPassword({
        phone: cleanId,
        password: password,
      });

      if (!error && data.user) {
        return {
          success: true,
          message: "Admin authenticated via Supabase Phone Auth!",
          user: {
            id: data.user.id,
            phone: data.user.phone,
            role: (data.user.user_metadata?.["role"] as string) || "admin",
          },
        };
      }

      // 2. Fallback to Supabase Database 'admin_users' Table Query by Phone
      const { data: dbAdmin, error: dbError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("phone", cleanId)
        .single();

      if (!dbError && dbAdmin) {
        if (dbAdmin.password === password || dbAdmin.password_hash === password) {
          return {
            success: true,
            message: "Authenticated via Supabase admin_users database table!",
            user: {
              id: String(dbAdmin.id),
              phone: dbAdmin.phone,
              role: dbAdmin.role || "admin",
            },
          };
        }
      }

      return {
        success: false,
        message: error?.message || "Invalid phone number or password.",
      };
    }

    return { success: false, message: "Unsupported login method." };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to communicate with Supabase backend.",
    };
  }
}
