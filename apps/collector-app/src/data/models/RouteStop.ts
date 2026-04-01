// ─── RouteStop Model ─────────────────────────────────────────────────────────
import { Model } from "@nozbe/watermelondb";
import { field, text, date, readonly, relation, children } from "@nozbe/watermelondb/decorators";
import { StopStatus, SyncStatus } from "@silk-value/shared-types";

export default class RouteStop extends Model {
  static table = "route_stops";

  static associations = {
    routes: { type: "belongs_to" as const, key: "route_id" },
    reelers: { type: "belongs_to" as const, key: "reeler_id" },
    collection_tickets: { type: "has_many" as const, foreignKey: "route_stop_id" },
  };

  /** FK → routes */
  @text("route_id") routeId!: string;

  /** FK → reelers */
  @text("reeler_id") reelerId!: string;

  /** Order of this stop along the route (1-based) */
  @field("stop_order") stopOrder!: number;

  /** Stop lifecycle: pending → arrived → collected | skipped */
  @text("status") status!: StopStatus;

  /** Timestamp when collector arrived at this stop */
  @date("arrived_at") arrivedAt!: Date | null;

  /** Timestamp when collector departed this stop */
  @date("departed_at") departedAt!: Date | null;

  @text("server_id") serverId!: string | null;
  /** Offline sync state — renamed to avoid collision with Model.syncStatus */
  @text("sync_status") serverSyncStatus!: SyncStatus;

  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;

  // ── Relations ──
  @relation("routes", "route_id") route: any;
  @relation("reelers", "reeler_id") reeler: any;
  @children("collection_tickets") collectionTickets: any;
}
