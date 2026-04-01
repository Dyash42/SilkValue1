// ─── Auth Module ─────────────────────────────────────────────────────────────
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { SupabaseAuthGuard } from "./auth.guard";
import { RolesGuard } from "./roles.guard";

@Module({
  providers: [
    // Apply auth guard globally — all routes require valid JWT by default
    { provide: APP_GUARD, useClass: SupabaseAuthGuard },
    // Apply roles guard globally — checked after auth
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AuthModule {}
