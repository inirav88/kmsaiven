import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import {
  getSiteConfig,
  getConfigValue,
  updateConfigValue,
  getCssVariables,
  refreshConfigCache,
} from "./queries/siteConfig";

export const siteConfigRouter = createRouter({
  // Public: Get all config (used by frontend to initialize CSS variables)
  list: publicQuery.query(async () => {
    return getSiteConfig();
  }),

  // Public: Get single value
  get: publicQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      return getConfigValue(input.key);
    }),

  // Public: Get CSS variables
  cssVars: publicQuery.query(async () => {
    return getCssVariables();
  }),

  // Admin: Update config value
  update: adminQuery
    .input(
      z.object({
        key: z.string().min(1),
        value: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await updateConfigValue(input.key, input.value);
      return { success: true };
    }),

  // Admin: Bulk update config values
  bulkUpdate: adminQuery
    .input(
      z.record(z.string(), z.string())
    )
    .mutation(async ({ input }) => {
      for (const [key, value] of Object.entries(input)) {
        await updateConfigValue(key, value as string);
      }
      return { success: true };
    }),

  // Admin: Refresh cache
  refreshCache: adminQuery.mutation(async () => {
    await refreshConfigCache();
    return { success: true };
  }),
});
