// ─── Factory Gate App — Supabase Config ──────────────────────────────────────
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@silk-value/shared-types";

const SUPABASE_URL = "https://vjxuqkstltkbflhhwgoe.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqeHVxa3N0bHRrYmZsaGh3Z29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NjM4ODAsImV4cCI6MjA5MDIzOTg4MH0.2pQh0G2XliS9j7l_oz6jnxv8MhR_v4mwxu1hAB8JnNk";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});
