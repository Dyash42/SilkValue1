// ─── Silk Value — WatermelonDB Sync Service ──────────────────────────────────
// This is the ONLY file in the collector-app where Supabase client calls are
// permitted (RULE 03). All other files must read data from WatermelonDB only.
//
// Data flow: Supabase (remote) → pullChanges → WatermelonDB (local SQLite)
// Push is stubbed for Phase 3.

import { synchronize } from "@nozbe/watermelondb/sync";
import database from "../data/database";
import { supabase } from "./auth";
import type {
  Profile as SupabaseProfile,
  Route as SupabaseRoute,
  RouteStop as SupabaseRouteStop,
  Reeler as SupabaseReeler,
} from "@silk-value/shared-types";

// ── Sync Service Status ──────────────────────────────────────────────────────
// SYNC DECISION: Using a module-level state pattern instead of React state
// so that sync status can be read from any part of the app without requiring
// a React context provider. When the app grows, this should be migrated to
// a proper state management solution (Zustand or React Context).

export type SyncServiceStatus = "idle" | "syncing" | "success" | "failed";

let currentSyncStatus: SyncServiceStatus = "idle";
let lastSyncedAt: Date | null = null;
let lastSyncError: string | null = null;

export function getSyncStatus(): SyncServiceStatus {
  return currentSyncStatus;
}

export function getLastSyncedAt(): Date | null {
  return lastSyncedAt;
}

export function getLastSyncError(): string | null {
  return lastSyncError;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

// SYNC DECISION: Converting ISO 8601 timestamp strings from Supabase
// (PostgreSQL timestamptz) to Unix milliseconds for WatermelonDB.
// The WatermelonDB schema defines created_at, updated_at, arrived_at,
// and departed_at as type 'number', and the @date decorator stores/retrieves
// these as ms timestamps internally.
function isoToUnixMs(iso: string | null): number {
  if (!iso) return 0;
  return new Date(iso).getTime();
}

// SYNC DECISION: On first sync (lastPulledAt === null), all records are
// categorized as 'created' because nothing exists locally yet.
// On incremental sync, records whose created_at is after lastPulledAt
// represent new server-side records ('created'); all others are 'updated'.
// This relies on created_at being immutable on the server side.
function isNewRecord(
  createdAt: string,
  lastPulledAt: number | null,
): boolean {
  if (lastPulledAt === null) return true;
  return new Date(createdAt).getTime() > lastPulledAt;
}

// ── Record Mappers ───────────────────────────────────────────────────────────
// SYNC DECISION: Each mapper converts a Supabase row (typed by shared-types)
// to a WatermelonDB raw record. Two extra fields are added to every record:
//   server_id = row.id  → preserves the Supabase UUID as a server reference
//   sync_status = 'synced' → marks the record as up-to-date with the server
// These columns exist in the WatermelonDB schema but NOT in all shared-type
// interfaces. They are local-only tracking fields for offline-first sync.

interface WMDBRawRecord {
  id: string;
  [key: string]: string | number | boolean | null;
}

function mapProfile(row: SupabaseProfile): WMDBRawRecord {
  return {
    id: row.id,
    user_id: row.user_id,
    role: row.role,
    full_name: row.full_name,
    phone: row.phone,
    cluster_id: row.cluster_id,
    avatar_url: row.avatar_url,
    server_id: row.id,
    sync_status: "synced",
    created_at: isoToUnixMs(row.created_at),
    updated_at: isoToUnixMs(row.updated_at),
  };
}

function mapRoute(row: SupabaseRoute): WMDBRawRecord {
  return {
    id: row.id,
    name: row.name,
    cluster_id: row.cluster_id,
    collector_id: row.collector_id,
    vehicle_id: row.vehicle_id,
    date: row.date,
    status: row.status,
    server_id: row.id,
    sync_status: "synced",
    created_at: isoToUnixMs(row.created_at),
    updated_at: isoToUnixMs(row.updated_at),
  };
}

function mapRouteStop(row: SupabaseRouteStop): WMDBRawRecord {
  return {
    id: row.id,
    route_id: row.route_id,
    reeler_id: row.reeler_id,
    stop_order: row.stop_order,
    status: row.status,
    arrived_at: isoToUnixMs(row.arrived_at),
    departed_at: isoToUnixMs(row.departed_at),
    server_id: row.id,
    sync_status: "synced",
    created_at: isoToUnixMs(row.created_at),
    updated_at: isoToUnixMs(row.updated_at),
  };
}

function mapReeler(row: SupabaseReeler): WMDBRawRecord {
  return {
    id: row.id,
    full_name: row.full_name,
    phone: row.phone,
    cluster_id: row.cluster_id,
    village: row.village,
    taluk: row.taluk,
    district: row.district,
    bank_account_number: row.bank_account_number,
    bank_ifsc: row.bank_ifsc,
    upi_id: row.upi_id,
    qr_code_hash: row.qr_code_hash,
    kyc_status: row.kyc_status,
    server_id: row.id,
    sync_status: "synced",
    created_at: isoToUnixMs(row.created_at),
    updated_at: isoToUnixMs(row.updated_at),
  };
}

// ── Change Set Builder ───────────────────────────────────────────────────────

interface TableChangeSet {
  created: WMDBRawRecord[];
  updated: WMDBRawRecord[];
  deleted: string[];
}

function buildChangeSet<
  T extends { id: string; created_at: string; updated_at: string },
>(
  rows: T[],
  mapper: (row: T) => WMDBRawRecord,
  lastPulledAt: number | null,
): TableChangeSet {
  const created: WMDBRawRecord[] = [];
  const updated: WMDBRawRecord[] = [];

  for (const row of rows) {
    const mapped = mapper(row);
    if (isNewRecord(row.created_at, lastPulledAt)) {
      created.push(mapped);
    } else {
      updated.push(mapped);
    }
  }

  return { created, updated, deleted: [] };
}

const emptyChangeSet: TableChangeSet = {
  created: [],
  updated: [],
  deleted: [],
};

// ── Main Sync Function ──────────────────────────────────────────────────────

export async function performSync(userId: string): Promise<void> {
  if (!userId) throw new Error("performSync called without userId");

  currentSyncStatus = "syncing";
  lastSyncError = null;

  try {
    await synchronize({
      database,

      pullChanges: async ({ lastPulledAt: rawLastPulledAt }) => {
        // SYNC DECISION: Using updated_at column for incremental sync.
        // This assumes the Supabase tables have an updated_at column
        // that is automatically updated by a trigger or application code.
        // If updated_at is not reliably updated on the server, this
        // incremental filter will miss changes. Verify triggers exist.

        // Normalise WatermelonDB's number|undefined to number|null
        // so all downstream helpers use a consistent nullable type.
        const lastPulledAt: number | null = rawLastPulledAt ?? null;

        const incrementalFilter = lastPulledAt
          ? new Date(lastPulledAt).toISOString()
          : null;

        // ── QUERY 1 — profiles ──────────────────────────────────────────
        // SYNC DECISION: Using user_id = userId instead of id = userId
        // because Profile.id is the table's own row UUID, while
        // Profile.user_id is the FK to Supabase Auth. Each collector
        // has exactly one profile record.
        let profileQuery = supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId);

        if (incrementalFilter) {
          profileQuery = profileQuery.gt("updated_at", incrementalFilter);
        }

        const { data: profileData, error: profileError } =
          await profileQuery;

        if (profileError) {
          throw new Error(
            `Sync failed on profiles query: ${profileError.message}`,
          );
        }

        const profileRows = (profileData ?? []) as SupabaseProfile[];

        // ── QUERY 2 — routes ────────────────────────────────────────────
        // SYNC DECISION: Fetching only today's route to minimise data
        // transferred over mobile networks. Historical routes will be
        // fetched on demand when the collector views past collections
        // in a future phase.
        // Ensure the date column in WatermelonDB schema uses the same
        // YYYY-MM-DD format or queries will return no results.
        const today = new Date().toISOString().split("T")[0]!;

        let routeQuery = supabase
          .from("routes")
          .select("*")
          .eq("collector_id", userId)
          .eq("date", today);

        if (incrementalFilter) {
          routeQuery = routeQuery.gt("updated_at", incrementalFilter);
        }

        const { data: routeData, error: routeError } = await routeQuery;

        if (routeError) {
          throw new Error(
            `Sync failed on routes query: ${routeError.message}`,
          );
        }

        const routeRows = (routeData ?? []) as SupabaseRoute[];

        // ── QUERY 3 — route_stops ───────────────────────────────────────
        const routeIds = routeRows.map((r) => r.id);
        let stopRows: SupabaseRouteStop[] = [];

        if (routeIds.length > 0) {
          let stopQuery = supabase
            .from("route_stops")
            .select("*")
            .in("route_id", routeIds);

          if (incrementalFilter) {
            stopQuery = stopQuery.gt("updated_at", incrementalFilter);
          }

          const { data: stopData, error: stopError } = await stopQuery;

          if (stopError) {
            throw new Error(
              `Sync failed on route_stops query: ${stopError.message}`,
            );
          }

          stopRows = (stopData ?? []) as SupabaseRouteStop[];
        }

        // ── QUERY 4 — reelers ───────────────────────────────────────────
        const reelerIds = [...new Set(stopRows.map((s) => s.reeler_id))];
        let reelerRows: SupabaseReeler[] = [];

        if (reelerIds.length > 0) {
          let reelerQuery = supabase
            .from("reelers")
            .select("*")
            .in("id", reelerIds);

          if (incrementalFilter) {
            reelerQuery = reelerQuery.gt("updated_at", incrementalFilter);
          }

          const { data: reelerData, error: reelerError } =
            await reelerQuery;

          if (reelerError) {
            throw new Error(
              `Sync failed on reelers query: ${reelerError.message}`,
            );
          }

          reelerRows = (reelerData ?? []) as SupabaseReeler[];
        }

        // ── Assemble Changes ────────────────────────────────────────────
        // SYNC DECISION: The keys in this object must exactly match the
        // table name strings in apps/collector-app/src/data/schema.ts.
        // Supabase table names and WatermelonDB table names are identical
        // (both snake_case) so no name mapping is needed.
        //
        // SYNC DECISION: collection_tickets is included with empty arrays
        // because WatermelonDB's synchronize requires all synced tables
        // to be present in the changes object. Collection tickets are
        // created locally and will be pushed in Phase 4.
        const changes = {
          profiles: buildChangeSet(profileRows, mapProfile, lastPulledAt),
          routes: buildChangeSet(routeRows, mapRoute, lastPulledAt),
          route_stops: buildChangeSet(
            stopRows,
            mapRouteStop,
            lastPulledAt,
          ),
          reelers: buildChangeSet(reelerRows, mapReeler, lastPulledAt),
          collection_tickets: emptyChangeSet,
        };

        return { changes, timestamp: Date.now() };
      },

      // STUB: pushChanges is not implemented in Phase 3.
      // In Phase 4 this function will push locally created
      // collection_tickets records and updated route_stop status
      // fields to Supabase via the NestJS backend API.
      // Until then all writes from the collector remain local only.
      pushChanges: async ({
        changes: _changes,
      }: {
        changes: Record<string, unknown>;
        lastPulledAt: number;
      }): Promise<void> => {
        return Promise.resolve();
      },
    });

    currentSyncStatus = "success";
    lastSyncedAt = new Date();
  } catch (error) {
    currentSyncStatus = "failed";
    lastSyncError =
      error instanceof Error ? error.message : "Unknown sync error";
    throw error;
  }
}
