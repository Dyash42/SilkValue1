// ─── Silk Value API — Entry Point ────────────────────────────────────────────
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix for all routes
  app.setGlobalPrefix("api/v1");

  // CORS for mobile apps and web dashboard
  app.enableCors({
    origin: true,
    credentials: true,
  });

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  console.warn(`🧵 Silk Value API running on http://localhost:${port}/api/v1`);
}

bootstrap();
