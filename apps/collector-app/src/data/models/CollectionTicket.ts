// ─── CollectionTicket Model ──────────────────────────────────────────────────
import { Model } from "@nozbe/watermelondb";
import { field, text, date, readonly, relation } from "@nozbe/watermelondb/decorators";
import { Grade, TicketStatus, SyncStatus } from "@silk-value/shared-types";

export default class CollectionTicket extends Model {
  static table = "collection_tickets";

  static associations = {
    route_stops: { type: "belongs_to" as const, key: "route_stop_id" },
    routes: { type: "belongs_to" as const, key: "route_id" },
    reelers: { type: "belongs_to" as const, key: "reeler_id" },
  };

  // ── Foreign Keys ──
  @text("route_stop_id") routeStopId!: string;
  @text("route_id") routeId!: string;
  @text("reeler_id") reelerId!: string;
  @text("collector_id") collectorId!: string;

  // ── Grading & Weights (Financial — sacred data) ──
  @text("grade") grade!: Grade;
  @field("gross_weight_kg") grossWeightKg!: number;
  @field("tare_weight_kg") tareWeightKg!: number;
  @field("net_weight_kg") netWeightKg!: number;
  @field("moisture_pct") moisturePct!: number | null;

  // ── Pricing ──
  @field("price_per_kg") pricePerKg!: number;
  @field("total_amount") totalAmount!: number;

  // ── Identifiers ──
  @text("ticket_number") ticketNumber!: string;

  /** Ticket lifecycle: draft → confirmed → gate_cleared | disputed | void */
  @text("status") status!: TicketStatus;

  @text("notes") notes!: string | null;

  /** Mapped UUID from the server after sync push */
  @text("server_id") serverId!: string | null;

  /** Offline sync state: created → synced — renamed to avoid collision with Model.syncStatus */
  @text("sync_status") serverSyncStatus!: SyncStatus;

  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;

  // ── Relations ──
  @relation("route_stops", "route_stop_id") routeStop: any;
  @relation("routes", "route_id") route: any;
  @relation("reelers", "reeler_id") reeler: any;
}
