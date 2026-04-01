// ─── Sync Controller — WatermelonDB Protocol ────────────────────────────────
import { Controller, Get, Post, Query, Body, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { Roles } from "../auth/roles.decorator";
import { SyncService } from "./sync.service";
import type { Profile } from "@silk-value/shared-types";
import { PushSyncDto } from "./dto/push-sync.dto";

interface SyncPullQuery {
  last_pulled_at: string; // ISO timestamp or "0" for first sync
}

interface SyncPushBody {
  changes: Record<
    string,
    {
      created: Record<string, unknown>[];
      updated: Record<string, unknown>[];
      deleted: string[];
    }
  >;
}

@Controller("sync")
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  /**
   * PULL — Mobile app requests all changes since last sync.
   * Filtered by user's cluster_id for RLS enforcement at the app level.
   */
  @Get()
  @Roles("collector", "reeler", "supervisor", "admin")
  async pull(
    @Query() query: SyncPullQuery,
    @Req() req: { user: Profile }
  ): Promise<any> {
    const lastPulledAt = query.last_pulled_at || "0";
    return this.syncService.pullChanges(req.user, lastPulledAt);
  }

  /**
   * PUSH — Mobile app pushes locally created/updated records.
   * Returns { ok: true, idMappings: { localId: serverId } }
   */
  @Post()
  @Roles("collector", "reeler", "supervisor", "admin")
  async push(
    @Body() body: SyncPushBody,
    @Req() req: { user: Profile }
  ): Promise<any> {
    return this.syncService.pushChanges(req.user, body.changes);
  }

  /**
   * Receives WatermelonDB push changes from the mobile collector app.
   * Processes new collection_tickets and updated route_stops.
   * Authenticated via Supabase JWT — userId is extracted from token.
   */
  @Post('push')
  @Roles("collector", "reeler", "supervisor", "admin")
  @UsePipes(new ValidationPipe({ transform: true }))
  async processPush(
    @Body() body: PushSyncDto,
    @Req() req: { user: Profile }
  ): Promise<any> {
    return this.syncService.processPush(body, req.user.id);
  }
}
