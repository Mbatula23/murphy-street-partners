import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.string().optional(),
  VITE_APP_ID: z.string().min(1, "VITE_APP_ID is required"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  OAUTH_SERVER_URL: z.string().optional(),
  OWNER_OPEN_ID: z.string().optional(),
  BUILT_IN_FORGE_API_URL: z.string().optional(),
  BUILT_IN_FORGE_API_KEY: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const message = parsedEnv.error.errors
    .map(error => `${error.path.join(".") || "?"}: ${error.message}`)
    .join("; ");
  throw new Error(`[Config] Environment validation failed: ${message}`);
}

const env = parsedEnv.data;

const preferredPort = Number.parseInt(env.PORT ?? "", 10);

export const ENV = {
  appId: env.VITE_APP_ID,
  cookieSecret: env.JWT_SECRET,
  databaseUrl: env.DATABASE_URL,
  oAuthServerUrl: env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: env.OWNER_OPEN_ID ?? "",
  isProduction: env.NODE_ENV === "production",
  forgeApiUrl: env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: env.BUILT_IN_FORGE_API_KEY ?? "",
  preferredPort: Number.isFinite(preferredPort) ? preferredPort : 3000,
};
