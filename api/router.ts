import { authRouter } from "./auth-router";
import { siteConfigRouter } from "./site-config-router";
import { propertyRouter } from "./property-router";
import { projectRouter } from "./project-router";
import { leadRouter } from "./lead-router";
import { requirementRouter } from "./requirement-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  siteConfig: siteConfigRouter,
  property: propertyRouter,
  project: projectRouter,
  lead: leadRouter,
  requirement: requirementRouter,
});

export type AppRouter = typeof appRouter;
