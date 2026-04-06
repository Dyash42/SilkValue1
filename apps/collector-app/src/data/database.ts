// ─── Silk Value — WatermelonDB Database Initialization ───────────────────────
// Offline-first reactive database using ExpoSQLiteAdapter.
// This is the LOCAL source of truth. Supabase is the REMOTE source of truth.

import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { setGenerator } from "@nozbe/watermelondb/utils/common/randomId";
import * as Crypto from 'expo-crypto';

import schema from "./schema";
import {
  Profile,
  Reeler,
  Route,
  RouteStop,
  CollectionTicket,
} from "./models";

// ── Utilities ────────────────────────────────────────────────────────────────

// UUIDv4 generator using expo-crypto for Postgres compatibility. Fixes BUG-05.
setGenerator(() => Crypto.randomUUID());

// ── Adapter ──────────────────────────────────────────────────────────────────
const adapter = new SQLiteAdapter({
  schema,
  // Fallback to async bridge (jsi: false) because the native C++ JSI bindings
  // are missing (often happens in Expo Go or incomplete custom dev builds).
  jsi: false,
  onSetUpError: (error) => {
    // In production, report to Sentry/crash analytics
    console.error("WatermelonDB setup error:", error);
  },
});

// ── Database Instance ────────────────────────────────────────────────────────
const database = new Database({
  adapter,
  modelClasses: [
    Profile,
    Reeler,
    Route,
    RouteStop,
    CollectionTicket,
  ],
});

export default database;
