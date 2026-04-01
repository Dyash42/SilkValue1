// ─── Supabase Auth Service — Phone OTP ───────────────────────────────────────
// Handles Supabase phone-based OTP authentication for the Collector app.
// Uses the anon key client — RLS policies are enforced server-side.

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIG } from "../config/supabase";

// Create a dedicated auth client with session persistence enabled
// (unlike the admin client, this one needs to track the user session)
export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

interface AuthResult {
  success: boolean;
  error?: string;
}

interface VerifyResult {
  success: boolean;
  session?: {
    accessToken: string;
    refreshToken: string;
    userId: string;
  };
  error?: string;
}

export const SupabaseAuthService = {
  /**
   * Sends a phone OTP to the given number.
   * Phone must include country code, e.g. "+919876543210".
   */
  async signInWithPhone(phoneNumber: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        console.error("OTP send error:", error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error sending OTP";
      return { success: false, error: message };
    }
  },

  /**
   * Verifies the OTP token against the phone number.
   * On success, Supabase sets the session automatically.
   */
  async verifyOtp(
    phoneNumber: string,
    token: string
  ): Promise<VerifyResult> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token,
        type: "sms",
      });

      if (error) {
        console.error("OTP verify error:", error.message);
        return { success: false, error: error.message };
      }

      if (data.session) {
        return {
          success: true,
          session: {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
            userId: data.session.user.id,
          },
        };
      }

      return { success: false, error: "No session returned after verification" };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error verifying OTP";
      return { success: false, error: message };
    }
  },

  /**
   * Returns the current Supabase session, if one exists.
   */
  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  /**
   * Signs out the current user and clears the session.
   */
  async signOut(): Promise<AuthResult> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },
};
