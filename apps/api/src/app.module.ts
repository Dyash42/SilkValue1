// ─── Silk Value API — Root Module ────────────────────────────────────────────
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SupabaseModule } from "./supabase/supabase.module";
import { AuthModule } from "./auth/auth.module";
import { SyncModule } from "./sync/sync.module";
import { GateModule } from "./gate/gate.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    // Load .env file — isGlobal makes it available everywhere
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"],
    }),

    // Core infrastructure
    SupabaseModule,
    AuthModule,

    // Business modules
    SyncModule,
    GateModule,

    // Operations
    HealthModule,
  ],
})
export class AppModule {}
