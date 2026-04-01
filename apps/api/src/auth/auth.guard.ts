// ─── Supabase JWT Auth Guard ─────────────────────────────────────────────────
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { SupabaseService } from "../supabase/supabase.service";
import { IS_PUBLIC_KEY } from "./public.decorator";

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(SupabaseAuthGuard.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Allow public endpoints (like /health) to bypass auth
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing or malformed Authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const profile = await this.supabase.getUserFromToken(token);

    if (!profile) {
      this.logger.warn("JWT validation failed — no matching profile");
      throw new UnauthorizedException("Invalid token or profile not found");
    }

    // Attach the full profile to the request for downstream use
    request.user = profile;
    return true;
  }
}
