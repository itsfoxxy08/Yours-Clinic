import { createClient } from "@supabase/supabase-js";

// Read Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Create singleton Supabase client
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      !supabaseUrl.includes("placeholder") &&
      !supabaseAnonKey.includes("placeholder")
  );
}

export type AdminLoginMethod = "email" | "phone" | "username";

export interface AdminAuthResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email?: string;
    phone?: string;
    username?: string;
    role?: string;
  };
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
    // If Supabase keys are not set in .env yet, return a clear guidance message
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
            role: (data.user.user_metadata?.role as string) || "admin",
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
              username: dbAdmin.username,
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
            role: (data.user.user_metadata?.role as string) || "admin",
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
              username: dbAdmin.username,
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

    if (method === "username") {
      // Query Supabase Database 'admin_users' or 'profiles' table for matching username
      const { data: dbAdmin, error: dbError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("username", cleanId)
        .single();

      if (!dbError && dbAdmin) {
        if (dbAdmin.password === password || dbAdmin.password_hash === password) {
          return {
            success: true,
            message: `Welcome back, ${dbAdmin.username || "Admin"}!`,
            user: {
              id: String(dbAdmin.id),
              username: dbAdmin.username,
              email: dbAdmin.email,
              role: dbAdmin.role || "admin",
            },
          };
        }
        return { success: false, message: "Incorrect password for this username." };
      }

      // Attempt matching username against email or phone if admin_users query didn't find direct match
      if (cleanId.includes("@")) {
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
          email: cleanId,
          password: password,
        });

        if (!authErr && authData.user) {
          return {
            success: true,
            message: "Admin authenticated successfully!",
            user: { id: authData.user.id, email: authData.user.email, role: "admin" },
          };
        }
      }

      return {
        success: false,
        message: dbError?.message || "Admin username not found in database.",
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
