// ─── Route Model ─────────────────────────────────────────────────────────────
import { Model } from "@nozbe/watermelondb";
import { field, text, date, readonly, children } from "@nozbe/watermelondb/decorators";
import { RouteStatus, SyncStatus } from "@silk-value/shared-types";

export default class Route extends Model {
  static table = "routes";

  static associations = {
    route_stops: { type: "has_many" as const, foreignKey: "route_id" },
    collection_tickets: { type: "has_many" as const, foreignKey: "route_id" },
  };

  @text("name") name!: string;

  /** FK → clusters */
  @text("cluster_id") clusterId!: string;

  /** FK → profiles (the assigned collector) */
  @text("collector_id") collectorId!: string;

  /** FK → vehicles */
  @text("vehicle_id") vehicleId!: string;

  /** ISO date string (YYYY-MM-DD) */
  @text("date") date!: string;

  /** Route lifecycle: planned → in_progress → completed | cancelled */
  @text("status") status!: RouteStatus;

  @text("server_id") serverId!: string | null;
  /** Offline sync state — renamed to avoid collision with Model.syncStatus */
  @text("sync_status") serverSyncStatus!: SyncStatus;

  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;

  // ── Relations ──
  @children("route_stops") routeStops: any;
  @children("collection_tickets") collectionTickets: any;
}
