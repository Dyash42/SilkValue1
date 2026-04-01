// ─── Silk Value — WatermelonDB Database Initialization ───────────────────────
// Offline-first reactive database using ExpoSQLiteAdapter.
// This is the LOCAL source of truth. Supabase is the REMOTE source of truth.

import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema from "./schema";
import {
  Profile,
  Reeler,
  Route,
  RouteStop,
  CollectionTicket,
} from "./models";

// ── Adapter ──────────────────────────────────────────────────────────────────
const adapter = new SQLiteAdapter({
  schema,
  // Use JSI (JavaScript Interface) for faster native SQLite communication
  // when running on Hermes engine
  jsi: true,
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
