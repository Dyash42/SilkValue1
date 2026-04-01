// ─── @Roles() Decorator ──────────────────────────────────────────────────────
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

/**
 * Restricts endpoint access to specific roles.
 * @example @Roles('collector', 'supervisor')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
