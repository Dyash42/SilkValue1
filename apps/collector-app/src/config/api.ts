// API base URL — controlled by environment variable.
// EXPO_PUBLIC_API_URL is set in .env.development for local dev
// and in EAS Secrets for production builds.
//
// Fallback chain:
//   1. EXPO_PUBLIC_API_URL env var (set per environment)
//   2. 10.0.2.2:3000 for Android emulator (last resort dev only)

const ANDROID_EMULATOR_FALLBACK = "http://10.0.2.2:3000";

export const API_BASE_URL: string =
  process.env.EXPO_PUBLIC_API_URL ?? ANDROID_EMULATOR_FALLBACK;
