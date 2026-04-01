// ─── Silk Value — Collector App Supabase Config ──────────────────────────────
// Hardcoded for now. In production, these should come from app.config.ts
// environment variables or expo-constants.
//
// IMPORTANT: Only the ANON key is used here. The service role key must
// NEVER be included in client-side mobile code.

export const SUPABASE_CONFIG = {
  url: "https://vjxuqkstltkbflhhwgoe.supabase.co",
  anonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqeHVxa3N0bHRrYmZsaGh3Z29lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NjM4ODAsImV4cCI6MjA5MDIzOTg4MH0.2pQh0G2XliS9j7l_oz6jnxv8MhR_v4mwxu1hAB8JnNk",
} as const;
