// ─── Silk Value — WatermelonDB Database Initialization ───────────────────────
// Offline-first reactive database using ExpoSQLiteAdapter.
// This is the LOCAL source of truth. Supabase is the REMOTE source of truth.

import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import { setGenerator } from "@nozbe/watermelondb/utils/common/randomId";

import schema from "./schema";
import {
  Profile,
  Reeler,
  Route,
  RouteStop,
  CollectionTicket,
} from "./models";

// ── Utilities ────────────────────────────────────────────────────────────────

// UUIDv4 generator for Postgres compatibility. Fixes BUG-05.
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
setGenerator(() => uuidv4());

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
