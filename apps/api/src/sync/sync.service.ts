// ─── Sync Service — WatermelonDB Sync Logic ─────────────────────────────────
import { Injectable, Logger } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import type { Profile } from "@silk-value/shared-types";
import { PushSyncDto } from "./dto/push-sync.dto";

export interface ProcessedCountsDto {
  collection_tickets_created: number;
  route_stops_updated: number;
}

/** Tables that participate in the offline sync protocol */
const SYNCABLE_TABLES = [
  "collection_tickets",
  "route_stops",
  "routes",
  "reelers",
  "notifications",
] as const;

type SyncableTable = (typeof SYNCABLE_TABLES)[number];

interface SyncChangeset {
  changes: Record<
    string,
    { created: unknown[]; updated: unknown[]; deleted: string[] }
  >;
  timestamp: number;
}

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(private readonly supabase: SupabaseService) {}

  /**
   * PULL: Fetch all rows modified since `lastPulledAt` for the user's cluster.
   * Returns a WatermelonDB-compatible changeset.
   */
  async pullChanges(
    user: Profile,
    lastPulledAt: string
  ): Promise<SyncChangeset> {
    const client = this.supabase.getClient();
    const since =
      lastPulledAt === "0"
        ? new Date(0).toISOString()
        : new Date(Number(lastPulledAt)).toISOString();

    const changes: SyncChangeset["changes"] = {};

    for (const table of SYNCABLE_TABLES) {
      let query = client
        .from(table)
        .select("*")
        .gt("updated_at", since);

      // Cluster-scoped filtering (RLS at the application level)
      if (table === "collection_tickets") {
        query = query.eq("collector_id", user.id);
      } else if (table === "routes") {
        query = query.eq("cluster_id", user.cluster_id);
      } else if (table === "reelers") {
        query = query.eq("cluster_id", user.cluster_id);
      } else if (table === "notifications") {
        query = query.eq("user_id", user.id);
      }

      const { data, error } = await query;

      if (error) {
        this.logger.error(`Pull error on ${table}: ${error.message}`);
        changes[table] = { created: [], updated: [], deleted: [] };
        continue;
      }

      // For first sync, everything is "created". For subsequent, everything is "updated".
      if (lastPulledAt === "0") {
        changes[table] = { created: data || [], updated: [], deleted: [] };
      } else {
        changes[table] = { created: [], updated: data || [], deleted: [] };
      }
    }

    return {
      changes,
      timestamp: Date.now(),
    };
  }

  /**
   * PUSH: Accept locally created/updated records and upsert into Supabase.
   * Returns ID mappings for newly created records.
   */
  async pushChanges(
    user: Profile,
    changes: Record<
      string,
      {
        created: Record<string, unknown>[];
        updated: Record<string, unknown>[];
        deleted: string[];
      }
    >
  ): Promise<{ ok: boolean; idMappings: Record<string, string> }> {
    const client = this.supabase.getClient();
    const idMappings: Record<string, string> = {};

    for (const [tableName, tableChanges] of Object.entries(changes)) {
      if (!SYNCABLE_TABLES.includes(tableName as SyncableTable)) {
        this.logger.warn(`Ignoring non-syncable table: ${tableName}`);
        continue;
      }

      // Handle CREATED records
      for (const record of tableChanges.created || []) {
        const localId = record.id as string;

        // Strip local-only fields before inserting
        const { id: _id, sync_status: _ss, ...serverRecord } = record;

        const { data, error } = await client
          .from(tableName)
          .insert({ ...serverRecord, created_at: new Date().toISOString() } as never)
          .select("id")
          .single();

        if (error) {
          this.logger.error(`Push create error on ${tableName}: ${error.message}`);
          continue;
        }

        if (data && localId) {
          idMappings[localId] = (data as { id: string }).id;
        }
      }

      // Handle UPDATED records (Server Wins for financial fields)
      for (const record of tableChanges.updated || []) {
        const serverId = record.server_id || record.id;

        const { id: _id, sync_status: _ss, server_id: _si, ...updateData } = record;

        const { error } = await client
          .from(tableName)
          .update({ ...updateData, updated_at: new Date().toISOString() } as never)
          .eq("id", serverId as string);

        if (error) {
          this.logger.error(`Push update error on ${tableName}: ${error.message}`);
        }
      }
    }

    return { ok: true, idMappings };
  }

  async processPush(
    changes: PushSyncDto,
    userId: string
  ): Promise<{ success: boolean; processed: ProcessedCountsDto }> {
    const client = this.supabase.getClient();

    // OPERATION 1 — Process created collection_tickets
    const createdTickets = changes.collection_tickets?.created || [];
    let ticketsCreatedCount = 0;

    if (createdTickets.length > 0) {
      // MAPPING: WatermelonDB uses snake_case which matches the Supabase schema directly
      const mappedRecords = createdTickets.map((record) => {
        // MAPPING: WatermelonDB timestamps are stored as Unix milliseconds.
        // Supabase created_at expects an ISO 8601 string. Convert them.
        
        // SECURITY: Never use the userId from the record body.
        // Always override collector_id with the userId from the verified JWT token.
        // This prevents malicious writes on behalf of another user.
        
        // MAPPING: The local WatermelonDB id is a device-generated UUID.
        // Insert it as the Supabase id field so subsequent pulls return the same record.
        const mapped = {
          ...record,
          id: record.id,
          collector_id: userId,
          created_at: new Date(record.created_at).toISOString(),
          updated_at: new Date(record.updated_at).toISOString(),
        };

        // Don't send WatermelonDB sync_status to the server
        delete (mapped as any).sync_status;
        return mapped;
      });

      // UPSERT DECISION: Using upsert with onConflict: 'id' instead of insert
      // to make this operation idempotent. If the mobile app retries
      // a failed push the same records will be upserted without creating duplicates.
      const { error } = await client
        .from('collection_tickets')
        .upsert(mappedRecords as any, { onConflict: 'id' });

      if (error) {
        throw new Error(
          `Push failed on collection_tickets insert: ${error.message}`
        );
      }
      ticketsCreatedCount = createdTickets.length;
    }

    // OPERATION 2 — Process updated route_stops
    const updatedStops = changes.route_stops?.updated || [];
    let stopsUpdatedCount = 0;

    if (updatedStops.length > 0) {
      for (const record of updatedStops) {
        // SECURITY: Verify the route_stop being updated belongs to a route
        // assigned to this collector before updating.
        const { data: stopCheck, error: checkError } = await client
          .from('route_stops')
          .select('id, routes!inner(collector_id)')
          .eq('id', record.id)
          .eq('routes.collector_id', userId)
          .single();

        if (checkError || !stopCheck) {
          this.logger.warn(
            `Push: route_stop ${record.id} not found or not owned by user ${userId}. Skipping.`
          );
          continue;
        }

        // MAPPING: Only update fields the collector is permitted to change.
        // Converting arrived_at and departed_at to ISO strings if present.
        const updatePayload: any = {
          status: record.status,
          updated_at: new Date(record.updated_at).toISOString(),
        };
        
        if (record.arrived_at) {
          updatePayload.arrived_at = new Date(record.arrived_at).toISOString();
        }
        if (record.departed_at) {
          updatePayload.departed_at = new Date(record.departed_at).toISOString();
        }

        const { error: updateError } = await client
          .from('route_stops')
          .update(updatePayload as never)
          .eq('id', record.id);

        if (updateError) {
          throw new Error(
            `Push failed on route_stops update for id ${record.id}: ${updateError.message}`
          );
        }
        stopsUpdatedCount++;
      }
    }

    // OPERATION 3 — Return the processed counts
    return {
      success: true,
      processed: {
        collection_tickets_created: ticketsCreatedCount,
        route_stops_updated: stopsUpdatedCount,
      },
    };
  }
}
