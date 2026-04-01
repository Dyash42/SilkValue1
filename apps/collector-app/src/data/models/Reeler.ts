// ─── Reeler Model ────────────────────────────────────────────────────────────
import { Model } from "@nozbe/watermelondb";
import { field, text, date, readonly, children } from "@nozbe/watermelondb/decorators";
import { KycStatus, SyncStatus } from "@silk-value/shared-types";

export default class Reeler extends Model {
  static table = "reelers";

  static associations = {
    route_stops: { type: "has_many" as const, foreignKey: "reeler_id" },
    collection_tickets: { type: "has_many" as const, foreignKey: "reeler_id" },
  };

  @text("full_name") fullName!: string;
  @text("phone") phone!: string;
  @text("cluster_id") clusterId!: string;
  @text("village") village!: string;
  @text("taluk") taluk!: string;
  @text("district") district!: string;

  // ── Banking (optional — may not be filled at registration) ──
  @text("bank_account_number") bankAccountNumber!: string | null;
  @text("bank_ifsc") bankIfsc!: string | null;
  @text("upi_id") upiId!: string | null;

  /** Unique hash identifying this reeler's QR code */
  @text("qr_code_hash") qrCodeHash!: string;

  /** KYC verification status */
  @text("kyc_status") kycStatus!: KycStatus;

  @text("server_id") serverId!: string | null;
  /** Offline sync state — renamed to avoid collision with Model.syncStatus */
  @text("sync_status") serverSyncStatus!: SyncStatus;

  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;

  // ── Relations ──
  @children("route_stops") routeStops: any;
  @children("collection_tickets") collectionTickets: any;
}
