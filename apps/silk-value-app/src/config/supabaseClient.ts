// ─── Silk Value App — Supabase Client Instance ───────────────────────────────
// Creates a dedicated auth client with session persistence enabled.
// Uses the anon key — RLS policies are enforced server-side.

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_CONFIG } from "./supabase";

export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});
