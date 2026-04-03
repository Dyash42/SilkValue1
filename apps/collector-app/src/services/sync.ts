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

// ── Shared Helpers ───────────────────────────────────────────────────────────

export function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ── Sync Service Status ──────────────────────────────────────────────────────

export type SyncServiceStatus = "idle" | "syncing" | "success" | "failed";

let currentSyncStatus: SyncServiceStatus = "idle";
let lastSyncedAt: Date | null = null;
let lastSyncError: string | null = null;
let isSyncLocked = false;

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

function isoToUnixMs(iso: string | null): number {
  if (!iso) return 0;
  return new Date(iso).getTime();
}

function isNewRecord(
  createdAt: string,
  lastPulledAt: number | null,
): boolean {
  if (lastPulledAt === null) return true;
  return new Date(createdAt).getTime() > lastPulledAt;
}

// ── Record Mappers ───────────────────────────────────────────────────────────

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

  if (isSyncLocked || currentSyncStatus === "syncing") {
    console.warn("performSync: Sync already in progress, skipping.");
    return;
  }

  isSyncLocked = true;
  currentSyncStatus = "syncing";
  lastSyncError = null;

  try {
    await synchronize({
      database,

      pullChanges: async ({ lastPulledAt: rawLastPulledAt }) => {
        const lastPulledAt: number | null = rawLastPulledAt ?? null;
        const incrementalFilter = lastPulledAt
          ? new Date(lastPulledAt).toISOString()
          : null;

        // ── QUERY 1 — profiles ──────────────────────────────────────────
        let profileQuery = supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId);

        if (incrementalFilter) {
          profileQuery = profileQuery.gt("updated_at", incrementalFilter);
        }

        const { data: profileData, error: profileError } = await profileQuery;
        if (profileError) throw new Error(`Sync failed on profiles: ${profileError.message}`);
        const profileRows = (profileData ?? []) as SupabaseProfile[];

        // Always resolve the profile ID to fetch related records (fixes BUG-01)
        const { data: currentProfile, error: profileLookupError } = await supabase
          .from("profiles")
          .select("id, cluster_id")
          .eq("user_id", userId)
          .single();
        if (profileLookupError || !currentProfile) {
          throw new Error(`Sync failed: Could not resolve profile for auth user ${userId}`);
        }
        const profileId = currentProfile.id;
        const clusterId = currentProfile.cluster_id;

        // ── QUERY 2 — routes ────────────────────────────────────────────
        // FIX: The "Early Morning" Timezone Trap
        // Extracts local device date strictly, ignoring UTC rollover
        const today = getLocalDateString();

        let routeQuery = supabase
          .from("routes")
          .select("*")
          .eq("collector_id", profileId)
          .eq("date", today);

        if (incrementalFilter) {
          routeQuery = routeQuery.gt("updated_at", incrementalFilter);
        }

        const { data: routeData, error: routeError } = await routeQuery;
        if (routeError) throw new Error(`Sync failed on routes: ${routeError.message}`);
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
          if (stopError) throw new Error(`Sync failed on route_stops: ${stopError.message}`);
          stopRows = (stopData ?? []) as SupabaseRouteStop[];
        }

        // ── QUERY 4 — reelers ───────────────────────────────────────────
        let reelerRows: SupabaseReeler[] = [];
        
        // On first sync get ALL reelers for the cluster.
        // On incremental, we also fetch reelers by cluster but filtered by date
        // to catch reelers whose records updated even if they aren't strictly
        // in today's routes yet. This fixes missing reeler updates (BUG-11).
        let reelerQuery = supabase
          .from("reelers")
          .select("*")
          .eq("cluster_id", clusterId);

        if (incrementalFilter) {
          reelerQuery = reelerQuery.gt("updated_at", incrementalFilter);
        }

        const { data: reelerData, error: reelerError } = await reelerQuery;
        if (reelerError) throw new Error(`Sync failed on reelers: ${reelerError.message}`);
        reelerRows = (reelerData ?? []) as SupabaseReeler[];

        const changes = {
          profiles: buildChangeSet(profileRows, mapProfile, lastPulledAt),
          routes: buildChangeSet(routeRows, mapRoute, lastPulledAt),
          route_stops: buildChangeSet(stopRows, mapRouteStop, lastPulledAt),
          reelers: buildChangeSet(reelerRows, mapReeler, lastPulledAt),
          collection_tickets: emptyChangeSet,
        };

        return { changes, timestamp: Date.now() };
      },

      pushChanges: async ({ changes, lastPulledAt }): Promise<void> => {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;

        if (!token) {
          throw new Error("Cannot push changes: No active session token.");
        }

        // NOTE: The API currently only processes ticket creations & stop updates.
        // It discards other pushes right now.
        const response = await fetch("http://10.0.2.2:3000/api/v1/sync/push", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ changes, last_pulled_at: lastPulledAt }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Push failed: ${response.status} - ${errorText}`);
        }
      },
    });

    currentSyncStatus = "success";
    lastSyncedAt = new Date();
  } catch (error) {
    currentSyncStatus = "failed";
    lastSyncError = error instanceof Error ? error.message : "Unknown sync error";
    throw error;
  } finally {
    isSyncLocked = false;
  }
}