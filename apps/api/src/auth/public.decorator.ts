// ─── @Public() Decorator ─────────────────────────────────────────────────────
import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

/**
 * Marks an endpoint as public — bypasses JWT authentication.
 * Use sparingly. Only for health checks and similar unauthenticated routes.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
