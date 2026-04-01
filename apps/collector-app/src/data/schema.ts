// ─── Silk Value — WatermelonDB Schema ────────────────────────────────────────
// Defines the local offline-first schema. Table and column names are snake_case
// to match the existing Supabase PostgreSQL schema exactly.
//
// Tables included: profiles, reelers, routes, route_stops, collection_tickets
// (the 5 tables that participate in offline sync for the Collector role)

import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const SCHEMA_VERSION = 1;

export default appSchema({
  version: SCHEMA_VERSION,
  tables: [
    // ── Profiles ─────────────────────────────────────────────────────────
    tableSchema({
      name: "profiles",
      columns: [
        { name: "user_id", type: "string" },
        { name: "role", type: "string" },
        { name: "full_name", type: "string" },
        { name: "phone", type: "string" },
        { name: "cluster_id", type: "string" },
        { name: "avatar_url", type: "string", isOptional: true },
        { name: "server_id", type: "string", isOptional: true },
        { name: "sync_status", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // ── Reelers ──────────────────────────────────────────────────────────
    tableSchema({
      name: "reelers",
      columns: [
        { name: "full_name", type: "string" },
        { name: "phone", type: "string" },
        { name: "cluster_id", type: "string" },
        { name: "village", type: "string" },
        { name: "taluk", type: "string" },
        { name: "district", type: "string" },
        { name: "bank_account_number", type: "string", isOptional: true },
        { name: "bank_ifsc", type: "string", isOptional: true },
        { name: "upi_id", type: "string", isOptional: true },
        { name: "qr_code_hash", type: "string" },
        { name: "kyc_status", type: "string" },
        { name: "server_id", type: "string", isOptional: true },
        { name: "sync_status", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // ── Routes ───────────────────────────────────────────────────────────
    tableSchema({
      name: "routes",
      columns: [
        { name: "name", type: "string" },
        { name: "cluster_id", type: "string" },
        { name: "collector_id", type: "string" },
        { name: "vehicle_id", type: "string" },
        { name: "date", type: "string" }, // ISO date YYYY-MM-DD
        { name: "status", type: "string" },
        { name: "server_id", type: "string", isOptional: true },
        { name: "sync_status", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // ── Route Stops ──────────────────────────────────────────────────────
    tableSchema({
      name: "route_stops",
      columns: [
        { name: "route_id", type: "string" },
        { name: "reeler_id", type: "string" },
        { name: "stop_order", type: "number" },
        { name: "status", type: "string" },
        { name: "arrived_at", type: "number", isOptional: true },
        { name: "departed_at", type: "number", isOptional: true },
        { name: "server_id", type: "string", isOptional: true },
        { name: "sync_status", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),

    // ── Collection Tickets ───────────────────────────────────────────────
    tableSchema({
      name: "collection_tickets",
      columns: [
        { name: "route_stop_id", type: "string" },
        { name: "route_id", type: "string" },
        { name: "reeler_id", type: "string" },
        { name: "collector_id", type: "string" },
        { name: "grade", type: "string" },
        { name: "gross_weight_kg", type: "number" },
        { name: "tare_weight_kg", type: "number" },
        { name: "net_weight_kg", type: "number" },
        { name: "moisture_pct", type: "number", isOptional: true },
        { name: "price_per_kg", type: "number" },
        { name: "total_amount", type: "number" },
        { name: "ticket_number", type: "string" },
        { name: "status", type: "string" },
        { name: "notes", type: "string", isOptional: true },
        { name: "server_id", type: "string", isOptional: true },
        { name: "sync_status", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
  ],
});
