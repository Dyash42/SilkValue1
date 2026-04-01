// ─── Silk Value — Supabase Client Factory ────────────────────────────────────
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@silk-value/shared-types";

export type TypedSupabaseClient = SupabaseClient<Database>;

/**
 * Creates a typed Supabase client for server-side use (service role).
 * NEVER expose the service role key to client-side code.
 */
export function createAdminClient(
  url: string,
  serviceRoleKey: string
): TypedSupabaseClient {
  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Creates a typed Supabase client for authenticated user context.
 * Uses the anon key + user JWT for RLS enforcement.
 */
export function createUserClient(
  url: string,
  anonKey: string,
  accessToken?: string
): TypedSupabaseClient {
  return createClient<Database>(url, anonKey, {
    global: {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
    },
  });
}

export type { Database };
