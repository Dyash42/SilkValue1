// ─── Health Controller — Public Endpoint ─────────────────────────────────────
import { Controller, Get } from "@nestjs/common";
import { Public } from "../auth/public.decorator";
import { SupabaseService } from "../supabase/supabase.service";

@Controller("health")
export class HealthController {
  constructor(private readonly supabase: SupabaseService) {}

  @Get()
  @Public()
  async check() {
    let supabaseStatus = "connected";

    try {
      const { error } = await this.supabase
        .getClient()
        .from("clusters")
        .select("id")
        .limit(1);

      if (error) supabaseStatus = `error: ${error.message}`;
    } catch (e) {
      supabaseStatus = `error: ${(e as Error).message}`;
    }

    return {
      status: supabaseStatus === "connected" ? "ok" : "degraded",
      supabase: supabaseStatus,
      timestamp: new Date().toISOString(),
      version: "0.0.1",
    };
  }
}
