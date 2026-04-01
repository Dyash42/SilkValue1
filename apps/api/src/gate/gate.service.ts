// ─── Gate Service — Variance Calculation & Entry Creation ────────────────────
import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import { GateEntryStatus } from "@silk-value/shared-types";
import type { Profile, GateEntry } from "@silk-value/shared-types";

/** Variance threshold — entries above this % are held for review */
const VARIANCE_THRESHOLD_PCT = 2.0;

interface WeighmentInput {
  route_id: string;
  vehicle_id: string;
  actual_weight_kg: number;
  notes?: string;
}

interface WeighmentResult {
  gate_entry: GateEntry;
  expected_weight_kg: number;
  actual_weight_kg: number;
  variance_pct: number;
  variance_kg: number;
  status: GateEntryStatus;
  held: boolean;
}

@Injectable()
export class GateService {
  private readonly logger = new Logger(GateService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async processWeighment(
    operator: Profile,
    input: WeighmentInput
  ): Promise<WeighmentResult> {
    const client = this.supabase.getClient();

    // ── Step 1: Fetch expected weight (SUM of all collection tickets for this route)
    const { data: tickets, error: ticketError } = await client
      .from("collection_tickets")
      .select("net_weight_kg")
      .eq("route_id", input.route_id)
      .in("status", ["confirmed", "draft"]);

    if (ticketError) {
      throw new BadRequestException(
        `Failed to fetch collection tickets: ${ticketError.message}`
      );
    }

    const expectedWeight = (tickets || []).reduce(
      (sum: number, t: { net_weight_kg: number }) => sum + t.net_weight_kg,
      0
    );

    if (expectedWeight === 0) {
      throw new BadRequestException(
        `No collection tickets found for route ${input.route_id}`
      );
    }

    // ── Step 2: Calculate variance
    const varianceKg = expectedWeight - input.actual_weight_kg;
    const variancePct =
      Math.abs(varianceKg / expectedWeight) * 100;

    // ── Step 3: Determine status
    const status: GateEntryStatus =
      variancePct <= VARIANCE_THRESHOLD_PCT
        ? GateEntryStatus.CLEARED
        : GateEntryStatus.HELD;

    // ── Step 4: Insert gate entry (atomic)
    const { data: gateEntry, error: insertError } = await client
      .from("gate_entries")
      .insert({
        route_id: input.route_id,
        vehicle_id: input.vehicle_id,
        gate_operator_id: operator.id,
        expected_weight_kg: expectedWeight,
        actual_weight_kg: input.actual_weight_kg,
        variance_pct: Math.round(variancePct * 100) / 100,
        variance_kg: Math.round(varianceKg * 100) / 100,
        status,
        notes: input.notes || null,
      } as never)
      .select("*")
      .single();

    if (insertError) {
      this.logger.error(`Gate entry insert failed: ${insertError.message}`);
      throw new BadRequestException(
        `Failed to create gate entry: ${insertError.message}`
      );
    }

    // ── Step 5: If held, create a notification for supervisors
    if (status === GateEntryStatus.HELD) {
      this.logger.warn(
        `⚠️ Variance breach on route ${input.route_id}: ${variancePct.toFixed(1)}% (${varianceKg.toFixed(1)} kg)`
      );

      // Fire-and-forget notification — non-blocking
      client
        .from("notifications")
        .insert({
          user_id: operator.id,
          title: "Gate Variance Alert",
          body: `Route ${input.route_id}: ${variancePct.toFixed(1)}% variance (${Math.abs(varianceKg).toFixed(1)} kg). Entry held for review.`,
          type: "gate_alert",
          is_read: false,
          metadata: {
            gate_entry_id: (gateEntry as GateEntry).id,
            route_id: input.route_id,
            variance_pct: variancePct,
          },
        } as never)
        .then(({ error }) => {
          if (error) this.logger.error(`Notification insert failed: ${error.message}`);
        });
    }

    // ── Step 6: If cleared, update ticket statuses to gate_cleared
    if (status === GateEntryStatus.CLEARED) {
      await client
        .from("collection_tickets")
        .update({ status: "gate_cleared", updated_at: new Date().toISOString() } as never)
        .eq("route_id", input.route_id)
        .in("status", ["confirmed", "draft"]);
    }

    return {
      gate_entry: gateEntry as GateEntry,
      expected_weight_kg: expectedWeight,
      actual_weight_kg: input.actual_weight_kg,
      variance_pct: Math.round(variancePct * 100) / 100,
      variance_kg: Math.round(varianceKg * 100) / 100,
      status,
      held: status === GateEntryStatus.HELD,
    };
  }
}
