// ─── Silk Value — WatermelonDB Observable Queries ────────────────────────────
// Centralized query functions that return RxJS Observables for reactive UI.
// Each function wraps a WatermelonDB `query().observe()` call and can be
// consumed directly by `withObservables` HOCs in screen components.
//
// RULE: These functions only access the LOCAL WatermelonDB database.
// No Supabase imports are allowed here.

import { Q } from "@nozbe/watermelondb";
import type { Database } from "@nozbe/watermelondb";
import type { Observable } from "rxjs";

import type Profile from "./models/Profile";
import type Route from "./models/Route";
import type RouteStop from "./models/RouteStop";
import type Reeler from "./models/Reeler";
import type CollectionTicket from "./models/CollectionTicket";

// ── Profile Queries ──────────────────────────────────────────────────────────

/**
 * Observes the Profile row for the currently authenticated user.
 * Returns Observable<Profile[]> — callers should take [0] since each
 * user_id maps to exactly one profile row.
 */
export function observeCollectorProfile(
  database: Database,
  userId: string,
): Observable<Profile[]> {
  return database
    .get<Profile>("profiles")
    .query(Q.where("user_id", userId))
    .observe();
}

// ── Route Queries ────────────────────────────────────────────────────────────

/**
 * Observes today's route for the given collector.
 * Returns Observable<Route[]> — callers should take [0].
 *
 * QUERY DECISION: Filters by collector_id and today's date (YYYY-MM-DD).
 * The date column in WatermelonDB stores ISO date strings, matching the
 * Supabase `date` column format used in the sync service.
 */
import { getLocalDateString } from "../services/sync";

export function observeTodayRoute(
  database: Database,
  userId: string,
): Observable<Route[]> {
  const today = getLocalDateString();
  return database
    .get<Route>("routes")
    .query(Q.where("collector_id", userId), Q.where("date", today))
    .observe();
}

// ── Route Stop Queries ───────────────────────────────────────────────────────

/**
 * Observes all stops for a given route, sorted by stop_order ascending.
 * Returns Observable<RouteStop[]>.
 */
export function observeRouteStops(
  database: Database,
  routeId: string,
): Observable<RouteStop[]> {
  return database
    .get<RouteStop>("route_stops")
    .query(
      Q.where("route_id", routeId),
      Q.sortBy("stop_order", Q.asc),
    )
    .observe();
}

// ── Reeler Queries ───────────────────────────────────────────────────────────

/**
 * Observes the Reeler related to a given RouteStop via the @relation
 * decorator. Returns Observable<Reeler> (single record, not array).
 *
 * Used by `EnhancedStopItem` to resolve reeler name and village
 * for display on each StopCard.
 */
export function observeReelerForStop(
  routeStop: RouteStop,
): Observable<Reeler> {
  return routeStop.reeler.observe() as Observable<Reeler>;
}

// ── Collection Ticket Queries ────────────────────────────────────────────────

/**
 * Observes all collection tickets for a given route.
 * Used to compute aggregate total weight (sum of net_weight_kg).
 */
export function observeCollectionTickets(
  database: Database,
  routeId: string,
): Observable<CollectionTicket[]> {
  return database
    .get<CollectionTicket>("collection_tickets")
    .query(Q.where("route_id", routeId))
    .observe();
}

// ── Single Ticket Query ────────────────────────────────────────────

/**
 * Observes a single CollectionTicket by its WatermelonDB ID.
 * Used by CollectionTicketScreen to show the receipt.
 * Returns Observable<CollectionTicket>.
 */
export function observeTicketById(
  database: Database,
  ticketId: string,
): Observable<CollectionTicket> {
  return database
    .get<CollectionTicket>("collection_tickets")
    .findAndObserve(ticketId);
}

// ── Route Stop Single Query ───────────────────────────────────────

/**
 * Observes a single RouteStop by its WatermelonDB ID.
 * Used by screens that need to react to stop status changes.
 * Returns Observable<RouteStop>.
 */
export function observeRouteStopById(
  database: Database,
  stopId: string,
): Observable<RouteStop> {
  return database
    .get<RouteStop>("route_stops")
    .findAndObserve(stopId);
}

// ── Unsynced Tickets Query ────────────────────────────────────────

/**
 * Observes all tickets that have not yet been pushed to the server.
 * Used by TripSheetSummary to show the pending sync count badge.
 * Returns Observable<CollectionTicket[]>.
 */
export function observeUnsyncedTickets(
  database: Database,
): Observable<CollectionTicket[]> {
  return database
    .get<CollectionTicket>("collection_tickets")
    .query(
      Q.where("sync_status", Q.oneOf(["created", "updated"])),
    )
    .observe();
}
