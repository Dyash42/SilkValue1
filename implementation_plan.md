# Principal Engineer Review — Silk Value Sync Architecture

## Executive Summary

The offline-first sync engine has a **sound conceptual design** — WatermelonDB as local truth, Supabase as remote truth, NestJS as the authenticated push gateway. However, the implementation has **11 bugs across 3 severity tiers**, including 3 showstoppers that prevent any data from loading or syncing correctly. The fixes below are surgical and don't require architectural redesign.

---

## P0 — Showstoppers (Data flow is broken today)

### 🔴 BUG-01: Identity Mismatch — `auth.users.id` ≠ `profiles.id`

This is the most dangerous bug. It corrupts the entire pull pipeline.

**Root cause:** The client calls `performSync(session.user.id)` where `session.user.id` is the **Supabase Auth UUID** (`auth.users.id`). But `routes.collector_id` is an FK to `profiles.id` — a completely different UUID.

| Location | Filter | Value Used | Column Points To | Correct? |
|---|---|---|---|---|
| [sync.ts:187](file:///c:/1D/BKR/SilK/Silk%20Value/apps/collector-app/src/services/sync.ts#L187) | `profiles.user_id` | auth UUID | `auth.users.id` | ✅ |
| [sync.ts:209](file:///c:/1D/BKR/SilK/Silk%20Value/apps/collector-app/src/services/sync.ts#L209) | `routes.collector_id` | auth UUID | `profiles.id` | ❌ **WRONG** |

**Impact:** The routes query returns **zero rows every time**. Consequently, route_stops and reelers also return zero rows (they depend on routeIds). The collector sees an empty dashboard — forever.

**Fix:** After fetching the profile, extract `profiles.id` from the result and use that for all subsequent queries that filter on `collector_id`.

---

### 🔴 BUG-02: DTO Enum Validation Rejects ALL Valid Data

The `PushSyncDto` validators use hardcoded string arrays that don't match the canonical enums.

| Field | DTO Accepts | Enum Defines | Overlap |
|---|---|---|---|
| `CollectionTicketRecordDto.status` | `collected, at_gate, verified, paid` | `draft, confirmed, gate_cleared, disputed, void` | **Zero** |
| `CollectionTicketRecordDto.grade` | `A+, A, B, C, Reject` | `A, B, C, D, reject` | Partial (case mismatch on `Reject` vs `reject`, missing `D`, phantom `A+`) |
| `RouteStopRecordDto.status` | `pending, collected, skipped` | `pending, arrived, collected, skipped` | Missing `arrived` |
| `*.sync_status` | `pending, synced, failed` | `created, updated, synced, conflict` | Only `synced` overlaps |

**Impact:** `ValidationPipe` rejects every valid push payload with a 400 error. Push sync is **completely non-functional**.

**Fix:** Replace hardcoded `@IsIn` arrays with values from the canonical enum definitions.

---

### 🔴 BUG-03: Split-Brain Architecture — Two Incompatible Data Paths

The system has a fundamental architectural split:

```
PULL PATH:  Mobile App → Supabase directly (anon key, user-scoped)
PUSH PATH:  Mobile App → NestJS API → Supabase (service role, profile-scoped)
```

Problems with this:
1. **Different auth models:** Pull uses anon key + RLS. Push uses JWT→NestJS→service-role. A RLS misconfiguration on pull can leak data that the NestJS push path correctly restricts.
2. **Dead code:** The backend's `pullChanges` method and `GET /sync` endpoint are fully implemented but never called. They use cluster-scoped filtering (different from the client's user-scoped logic).
3. **Duplicate push endpoints:** `POST /sync` (generic `pushChanges`) and `POST /sync/push` (specific `processPush`) both exist with different logic.
4. **ID semantics diverge:** Client pull uses `auth.users.id`. Backend push uses `profiles.id`. These are different UUIDs passed as `userId` — meaning data written via push won't match data read via pull.

**Fix:** Unify all sync through the NestJS backend. Remove direct Supabase calls from the client sync service. Delete the dead `pullChanges` method and generic `POST /sync` endpoint from the backend (or defer to Phase 5). The client should call `POST /api/sync/push` for pushes and — when the backend pull is ready — `GET /api/sync/pull` for pulls. For now, the client pull-from-Supabase is acceptable as a transitional approach **only if** the identity bug is fixed.

> [!IMPORTANT]
> The most pragmatic fix for Phase 4 is: keep the direct-Supabase pull (fix the identity bug), wire `pushChanges` to the NestJS `POST /sync/push` endpoint, and delete the dead generic push endpoint. Full backend-pull can be Phase 5.

---

## P1 — Will Crash in Production

### 🟡 BUG-04: Timezone Date Disagreement Between Sync and Queries

Two different date-extraction methods are used:

| Location | Method | IST at 1:00 AM on Apr 2 | Result |
|---|---|---|---|
| [sync.ts:200-204](file:///c:/1D/BKR/SilK/Silk%20Value/apps/collector-app/src/services/sync.ts#L200-L204) | `new Date().getFullYear()` etc. (local) | April 2 | ✅ `"2026-04-02"` |
| [queries.ts:50](file:///c:/1D/BKR/SilK/Silk%20Value/apps/collector-app/src/data/queries.ts#L50) | `new Date().toISOString().split("T")[0]` (UTC) | April 1 | ❌ `"2026-04-01"` |

**Impact:** Between midnight and 5:30 AM IST, sync fetches April 2's routes but the reactive query observes April 1's routes. The UI shows **yesterday's data** or nothing.

**Fix:** Extract a shared `getLocalDateString()` helper and use it in both locations.

---

### 🟡 BUG-05: WatermelonDB IDs May Not Be Valid UUIDs

WatermelonDB's default ID generator produces short alphanumeric strings (e.g., `"asd8f7a"`), not UUIDv4. In [processPush:183](file:///c:/1D/BKR/SilK/Silk%20Value/apps/api/src/sync/sync.service.ts#L183):

```typescript
id: record.id,  // WatermelonDB-generated ID → used as Postgres PK
```

If the `collection_tickets.id` column in Postgres is type `uuid`, this insert will fail with a constraint violation.

**Fix:** Either (a) configure WatermelonDB to generate UUIDv4 IDs, or (b) let Postgres generate UUIDs and map back. Option (a) is simpler — override the `_prepareCreate` hook or set a custom ID function in the database adapter.

---

### 🟡 BUG-06: Sync Re-entrancy Race Condition

[useSync.ts](file:///c:/1D/BKR/SilK/Silk%20Value/apps/collector-app/src/hooks/useSync.ts) has no guard against concurrent syncs. If the user triggers pull-to-refresh while an automatic mount-sync is running, WatermelonDB throws an error ("Another sync is in progress"), which surfaces as a confusing error toast.

**Fix:** Add a module-level lock flag in `sync.ts` that prevents concurrent `synchronize()` calls.

---

### 🟡 BUG-07: Falsy-check on Timestamps Drops Valid Zero Values

In [sync.service.ts:238-243](file:///c:/1D/BKR/SilK/Silk%20Value/apps/api/src/sync/sync.service.ts#L238-L243):
```typescript
if (record.arrived_at) { ... }  // Drops timestamp value 0
```

While a zero timestamp (Unix epoch) is unlikely for `arrived_at`, using a truthiness check on a number field is a latent bug. Use `!= null` instead.

---

## P2 — Architectural Debt

### 🔵 BUG-08: Backend `pullChanges` Created/Updated Partition is Wrong

Lines 78-83 of `sync.service.ts` put ALL records in `created` on first sync and ALL in `updated` on subsequent syncs. If a new reeler is added between two syncs, WatermelonDB will try to "update" a record that doesn't exist locally and crash.

> [!NOTE]
> This is dead code today (client doesn't call the backend pull), but must be fixed before Phase 5.

### 🔵 BUG-09: No Transaction Boundaries on Push

`processPush` performs multiple sequential database writes without a transaction. If the process crashes mid-push (e.g., after inserting 3 of 5 tickets but before updating stops), the data is in an inconsistent state. The upsert-with-onConflict partially mitigates this for idempotent retries, but doesn't guarantee atomicity.

### 🔵 BUG-10: Generic `pushChanges` Method is Unsafe Dead Code

The `pushChanges` method accepts ANY table name from the client and does blind upserts. It strips `id` and `sync_status` but doesn't validate fields, enforce ownership, or restrict mutable columns. If this endpoint were ever called, it would be a privilege escalation vector.

### 🔵 BUG-11: Reeler Incremental Sync Can Miss Data

In [sync.ts:248-251](file:///c:/1D/BKR/SilK/Silk%20Value/apps/collector-app/src/services/sync.ts#L248-L251), the reeler query combines `.in("id", reelerIds)` with `.gt("updated_at", incrementalFilter)`. On incremental sync, if a reeler's data hasn't changed since last pull but their route_stop HAS changed, the reeler row won't be re-fetched. This is only an issue if the reeler ID in a stop changed (reassignment), which would leave the UI with a stale reeler reference.

---

## Proposed Changes

### Client — Collector App

#### [MODIFY] [sync.ts](file:///c:/1D/BKR/SilK/Silk%20Value/apps/collector-app/src/services/sync.ts)
- Fix BUG-01: After fetching profile, extract `profiles.id` and use it for `collector_id` filters
- Fix BUG-03: Wire `pushChanges` to NestJS `POST /sync/push` endpoint
- Fix BUG-06: Add sync lock to prevent re-entrant calls
- Fix BUG-11: On first sync, fetch ALL reelers for the cluster instead of only those on today's routes
- Extract `getLocalDateString()` helper for BUG-04

#### [MODIFY] [queries.ts](file:///c:/1D/BKR/SilK/Silk%20Value/apps/collector-app/src/data/queries.ts)
- Fix BUG-04: Replace `toISOString().split("T")[0]` with local date extraction

---

### Backend — NestJS API

#### [MODIFY] [sync.service.ts](file:///c:/1D/BKR/SilK/Silk%20Value/apps/api/src/sync/sync.service.ts)
- Fix BUG-07: Use `!= null` for timestamp checks
- Fix BUG-10: Delete the generic `pushChanges` method (dead, unsafe code)
- Clean up `pullChanges` created/updated partitioning for future use (BUG-08)

#### [MODIFY] [sync.controller.ts](file:///c:/1D/BKR/SilK/Silk%20Value/apps/api/src/sync/sync.controller.ts)
- Fix BUG-03/10: Delete the generic `POST /sync` endpoint

#### [MODIFY] [push-sync.dto.ts](file:///c:/1D/BKR/SilK/Silk%20Value/apps/api/src/sync/dto/push-sync.dto.ts)
- Fix BUG-02: Replace all `@IsIn` arrays with canonical enum values
- Fix BUG-05: Add `@IsUUID()` validator on `id` field (defense in depth)

---

## Open Questions

> [!IMPORTANT]
> **Q1: WatermelonDB ID format.** Does your Postgres `collection_tickets.id` column use `uuid` type or `text`? If `uuid`, we need to configure WatermelonDB to generate UUIDv4 IDs for locally-created records. I'll proceed assuming `uuid` and add a UUID generator.

> [!IMPORTANT]  
> **Q2: Backend pull endpoint.** Should I delete the backend `pullChanges` / `GET /sync` entirely, or leave it cleaned up for Phase 5? I'll leave it cleaned up but mark it as `@deprecated`.

> [!WARNING]
> **Q3: The `SyncStatus` enum mismatch.** The DTO validates `sync_status` as `pending | synced | failed`, but the enum defines `created | updated | synced | conflict`. Should I update the enum to match the DTO, or update the DTO to match the enum? I'll align the DTO to the enum since the shared-types package is the source of truth. However, note we strip `sync_status` before inserting to Supabase anyway, so this validator only affects request validation.

## Verification Plan

### Automated Tests
- Run `pnpm build` across the monorepo to verify TypeScript compilation
- Verify DTO enum values match shared-types enums

### Manual Verification
- After fixes, sync should successfully pull today's routes for the logged-in collector
- Push of a collection_ticket should pass DTO validation and upsert into Supabase
- Opening the app at 1:00 AM IST should show the correct day's route
