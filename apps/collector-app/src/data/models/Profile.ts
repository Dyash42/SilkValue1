// ─── Profile Model ───────────────────────────────────────────────────────────
import { Model } from "@nozbe/watermelondb";
import { field, text, date, readonly } from "@nozbe/watermelondb/decorators";
import { Role, SyncStatus } from "@silk-value/shared-types";

export default class Profile extends Model {
  static table = "profiles";

  /** Supabase Auth user UUID */
  @text("user_id") userId!: string;

  /** System role: collector, reeler, gate_operator, supervisor, admin */
  @text("role") role!: Role;

  @text("full_name") fullName!: string;
  @text("phone") phone!: string;

  /** FK → clusters table */
  @text("cluster_id") clusterId!: string;

  @text("avatar_url") avatarUrl!: string | null;

  /** Mapped server UUID after sync */
  @text("server_id") serverId!: string | null;

  /** Offline sync state — renamed to avoid collision with Model.syncStatus */
  @text("sync_status") serverSyncStatus!: SyncStatus;

  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
}
