// ─── Supabase Service — Connection to Existing Database ──────────────────────
import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createAdminClient, TypedSupabaseClient } from "@silk-value/supabase-client";
import type { Profile } from "@silk-value/shared-types";

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private adminClient!: TypedSupabaseClient;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const url = this.config.getOrThrow<string>("SUPABASE_URL");
    const key = this.config.getOrThrow<string>("SUPABASE_SERVICE_ROLE_KEY");

    this.adminClient = createAdminClient(url, key);

    // Verify connectivity to existing database
    const { error } = await this.adminClient
      .from("clusters")
      .select("id")
      .limit(1);

    if (error) {
      this.logger.error(`Supabase connection FAILED: ${error.message}`);
      throw error;
    }

    this.logger.log("✅ Connected to Supabase (existing database verified)");
  }

  /** Returns the admin (service-role) client for server-side operations */
  getClient(): TypedSupabaseClient {
    return this.adminClient;
  }

  /**
   * Extracts and validates user profile from a Supabase JWT.
   * Returns the full profile row including role and cluster_id.
   */
  async getUserFromToken(jwt: string): Promise<Profile | null> {
    const {
      data: { user },
      error: authError,
    } = await this.adminClient.auth.getUser(jwt);

    if (authError || !user) return null;

    const { data: profile, error: profileError } = await this.adminClient
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) return null;
    return profile as Profile;
  }
}
