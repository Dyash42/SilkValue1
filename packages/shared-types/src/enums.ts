// ─── Silk Value — Shared Enums ───────────────────────────────────────────────
// These enums mirror the PostgreSQL enum types in the existing Supabase schema.
// Do NOT modify without also updating the database constraints.

/** User roles within the system */
export enum Role {
  COLLECTOR = "collector",
  REELER = "reeler",
  GATE_OPERATOR = "gate_operator",
  SUPERVISOR = "supervisor",
  ADMIN = "admin",
}

/** Sync state for offline-first records */
export enum SyncStatus {
  CREATED = "created",
  UPDATED = "updated",
  SYNCED = "synced",
  CONFLICT = "conflict",
}

/** Collection ticket lifecycle */
export enum TicketStatus {
  DRAFT = "draft",
  CONFIRMED = "confirmed",
  GATE_CLEARED = "gate_cleared",
  DISPUTED = "disputed",
  VOID = "void",
}

/** Gate entry verdict */
export enum GateEntryStatus {
  CLEARED = "cleared",
  HELD = "held",
  OVERRIDE_APPROVED = "override_approved",
}

/** Payment lifecycle */
export enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  REVERSED = "reversed",
}

/** Silk grade classification */
export enum Grade {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  REJECT = "reject",
}

/** Route status */
export enum RouteStatus {
  PLANNED = "planned",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

/** Route stop status */
export enum StopStatus {
  PENDING = "pending",
  ARRIVED = "arrived",
  COLLECTED = "collected",
  SKIPPED = "skipped",
}

/** KYC verification status */
export enum KycStatus {
  PENDING = "pending",
  SUBMITTED = "submitted",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

/** Notification type */
export enum NotificationType {
  COLLECTION = "collection",
  PAYMENT = "payment",
  GATE_ALERT = "gate_alert",
  SYSTEM = "system",
  KYC = "kyc",
}
