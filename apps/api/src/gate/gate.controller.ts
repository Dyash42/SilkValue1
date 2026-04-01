// ─── Gate Controller — Weighment & Variance ─────────────────────────────────
import { Controller, Post, Body, Req, HttpCode } from "@nestjs/common";
import { Roles } from "../auth/roles.decorator";
import { GateService } from "./gate.service";
import type { Profile } from "@silk-value/shared-types";

interface WeighmentDto {
  route_id: string;
  vehicle_id: string;
  actual_weight_kg: number;
  notes?: string;
}

@Controller("gate")
export class GateController {
  constructor(private readonly gateService: GateService) {}

  /**
   * POST /api/v1/gate/weighment
   * Submits the actual gate scale weight, calculates variance against
   * the sum of collection_tickets for the route, and creates a gate_entry.
   */
  @Post("weighment")
  @HttpCode(200)
  @Roles("gate_operator", "supervisor", "admin")
  async submitWeighment(
    @Body() dto: WeighmentDto,
    @Req() req: { user: Profile }
  ): Promise<any> {
    return this.gateService.processWeighment(req.user, dto);
  }
}
