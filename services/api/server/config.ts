import { config } from "dotenv";

// Load environment variables
config();

export const serverConfig = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  allowedOrigins: (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:5174,https://web-production-1b22c.up.railway.app").split(","),
  // Add other config as needed
  databaseUrl: process.env.DATABASE_URL,
  sessionSecret: process.env.SESSION_SECRET || "default-secret",
  // AI service configs
  openaiApiKey: process.env.OPENAI_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  // Marketplace configs
  facebookAppId: process.env.FACEBOOK_APP_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
  craigslistUsername: process.env.CRAIGSLIST_USERNAME,
  craigslistPassword: process.env.CRAIGSLIST_PASSWORD,
};