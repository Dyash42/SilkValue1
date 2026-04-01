// ─── Silk Value — Database Row Interfaces ────────────────────────────────────
// These interfaces are the SINGLE SOURCE OF TRUTH for all TypeScript code.
// They match the 10 tables already created in Supabase exactly.

import {
  Role,
  SyncStatus,
  TicketStatus,
  GateEntryStatus,
  PaymentStatus,
  Grade,
  RouteStatus,
  StopStatus,
  KycStatus,
  NotificationType,
} from "./enums";

// ─── Base ────────────────────────────────────────────────────────────────────

/** Common timestamp fields present on every table */
export interface BaseRow {
  id: string; // UUID, primary key
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

// ─── 1. Clusters ─────────────────────────────────────────────────────────────

export interface Cluster extends BaseRow {
  name: string;
  region: string;
  state: string;
  district: string;
}

// ─── 2. Profiles ─────────────────────────────────────────────────────────────

export interface Profile extends BaseRow {
  user_id: string; // FK → Supabase Auth user
  role: Role;
  full_name: string;
  phone: string;
  cluster_id: string; // FK → clusters.id
  avatar_url: string | null;
}

// ─── 3. Reelers ──────────────────────────────────────────────────────────────

export interface Reeler extends BaseRow {
  full_name: string;
  phone: string;
  cluster_id: string; // FK → clusters.id
  village: string;
  taluk: string;
  district: string;
  bank_account_number: string | null;
  bank_ifsc: string | null;
  upi_id: string | null;
  qr_code_hash: string;
  kyc_status: KycStatus;
}

// ─── 4. Vehicles ─────────────────────────────────────────────────────────────

export interface Vehicle extends BaseRow {
  registration_number: string;
  driver_name: string;
  driver_phone: string;
  cluster_id: string; // FK → clusters.id
}

// ─── 5. Routes ───────────────────────────────────────────────────────────────

export interface Route extends BaseRow {
  name: string;
  cluster_id: string; // FK → clusters.id
  collector_id: string; // FK → profiles.id
  vehicle_id: string; // FK → vehicles.id
  date: string; // ISO date (YYYY-MM-DD)
  status: RouteStatus;
}

// ─── 6. Route Stops ──────────────────────────────────────────────────────────

export interface RouteStop extends BaseRow {
  route_id: string; // FK → routes.id
  reeler_id: string; // FK → reelers.id
  stop_order: number;
  status: StopStatus;
  arrived_at: string | null;
  departed_at: string | null;
}

// ─── 7. Collection Tickets ───────────────────────────────────────────────────

export interface CollectionTicket extends BaseRow {
  route_stop_id: string; // FK → route_stops.id
  route_id: string; // FK → routes.id
  reeler_id: string; // FK → reelers.id
  collector_id: string; // FK → profiles.id
  grade: Grade;
  gross_weight_kg: number;
  tare_weight_kg: number;
  net_weight_kg: number;
  moisture_pct: number | null;
  price_per_kg: number;
  total_amount: number;
  ticket_number: string;
  status: TicketStatus;
  notes: string | null;
  sync_status: SyncStatus;
  server_id: string | null; // Mapped server UUID after sync
}

// ─── 8. Gate Entries ─────────────────────────────────────────────────────────

export interface GateEntry extends BaseRow {
  route_id: string; // FK → routes.id
  vehicle_id: string; // FK → vehicles.id
  gate_operator_id: string; // FK → profiles.id
  expected_weight_kg: number;
  actual_weight_kg: number;
  variance_pct: number;
  variance_kg: number;
  status: GateEntryStatus;
  notes: string | null;
}

// ─── 9. Payments ─────────────────────────────────────────────────────────────

export interface Payment extends BaseRow {
  reeler_id: string; // FK → reelers.id
  gate_entry_id: string; // FK → gate_entries.id
  amount: number;
  payment_method: string;
  transaction_ref: string | null;
  status: PaymentStatus;
  processed_by: string; // FK → profiles.id
  notes: string | null;
}

// ─── 10. Notifications ──────────────────────────────────────────────────────

export interface Notification extends BaseRow {
  user_id: string; // FK → profiles.id
  title: string;
  body: string;
  type: NotificationType;
  is_read: boolean;
  metadata: Record<string, unknown> | null;
}

// ─── Supabase Database Typing ────────────────────────────────────────────────

/** Full database schema type for use with @supabase/supabase-js */
export interface Database {
  public: {
    Tables: {
      clusters: { Row: Cluster; Insert: Omit<Cluster, "id" | "created_at" | "updated_at">; Update: Partial<Omit<Cluster, "id">> };
      profiles: { Row: Profile; Insert: Omit<Profile, "id" | "created_at" | "updated_at">; Update: Partial<Omit<Profile, "id">> };
      reelers: { Row: Reeler; Insert: Omit<Reeler, "id" | "created_at" | "updated_at">; Update: Partial<Omit<Reeler, "id">> };
      vehicles: { Row: Vehicle; Insert: Omit<Vehicle, "id" | "created_at" | "updated_at">; Update: Partial<Omit<Vehicle, "id">> };
      routes: { Row: Route; Insert: Omit<Route, "id" | "created_at" | "updated_at">; Update: Partial<Omit<Route, "id">> };
      route_stops: { Row: RouteStop; Insert: Omit<RouteStop, "id" | "created_at" | "updated_at">; Update: Partial<Omit<RouteStop, "id">> };
      collection_tickets: { Row: CollectionTicket; Insert: Omit<CollectionTicket, "id" | "created_at" | "updated_at">; Update: Partial<Omit<CollectionTicket, "id">> };
      gate_entries: { Row: GateEntry; Insert: Omit<GateEntry, "id" | "created_at" | "updated_at">; Update: Partial<Omit<GateEntry, "id">> };
      payments: { Row: Payment; Insert: Omit<Payment, "id" | "created_at" | "updated_at">; Update: Partial<Omit<Payment, "id">> };
      notifications: { Row: Notification; Insert: Omit<Notification, "id" | "created_at" | "updated_at">; Update: Partial<Omit<Notification, "id">> };
    };
  };
}
