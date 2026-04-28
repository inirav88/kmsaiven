import { getDb } from "./connection";
import { siteConfig } from "@db/schema";

// In-memory cache for site config
let configCache: Record<string, string> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60_000; // 1 minute cache

export async function getSiteConfig(): Promise<Record<string, string>> {
  const now = Date.now();

  if (configCache && now - cacheTimestamp < CACHE_TTL_MS) {
    return configCache;
  }

  const db = getDb();
  const rows = await db.select().from(siteConfig);

  const config: Record<string, string> = {};
  for (const row of rows) {
    config[row.key] = row.value ?? "";
  }

  configCache = config;
  cacheTimestamp = now;

  return config;
}

export async function getConfigValue(key: string): Promise<string | null> {
  const config = await getSiteConfig();
  return config[key] ?? null;
}

export async function refreshConfigCache(): Promise<void> {
  configCache = null;
  cacheTimestamp = 0;
  await getSiteConfig();
}

export async function updateConfigValue(key: string, value: string) {
  const db = getDb();
  await db
    .insert(siteConfig)
    .values({ key, value })
    .onDuplicateKeyUpdate({ set: { value, updatedAt: new Date() } });

  // Invalidate cache
  configCache = null;
  cacheTimestamp = 0;
}

// Helper to get CSS variables for frontend
export async function getCssVariables(): Promise<Record<string, string>> {
  const config = await getSiteConfig();

  return {
    "--color-primary": config["color_primary"] || "#DC2125",
    "--color-primary-dark": config["color_primary_dark"] || "#B91C1F",
    "--color-secondary": config["color_secondary"] || "#222120",
    "--color-accent": config["color_accent"] || "#E9781D",
    "--color-background": config["color_background"] || "#FFFFFF",
    "--color-surface": config["color_surface"] || "#F8F7F4",
    "--color-text-primary": config["color_text_primary"] || "#222120",
    "--color-text-secondary": config["color_text_secondary"] || "#6B6B6B",
    "--color-text-muted": config["color_text_muted"] || "#9A9A9A",
    "--font-heading": config["font_heading"] || "Playfair Display",
    "--font-body": config["font_body"] || "DM Sans",
  };
}
