import { z } from "zod";
import { eq, and, desc, like, sql } from "drizzle-orm";
import { createRouter, publicQuery, editorQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { projects, projectMedia, projectUnits } from "@db/schema";

export const projectRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        city: z.string().optional(),
        locality: z.string().optional(),
        projectType: z.string().optional(),
        status: z.string().optional(),
        isFeatured: z.boolean().optional(),
        search: z.string().optional(),
        page: z.number().default(1),
        pageSize: z.number().default(24),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const filters = [];

      if (input?.city) filters.push(eq(projects.city, input.city));
      if (input?.locality) filters.push(like(projects.locality, `%${input.locality}%`));
      if (input?.projectType) filters.push(eq(projects.projectType, input.projectType as any));
      if (input?.status) filters.push(eq(projects.status, input.status as any));
      if (input?.isFeatured !== undefined) filters.push(eq(projects.isFeatured, input.isFeatured));
      if (input?.search) filters.push(like(projects.name, `%${input.search}%`));

      const whereClause = filters.length > 0 ? and(...filters) : undefined;

      const [rows, countResult] = await Promise.all([
        db.select().from(projects)
          .where(whereClause)
          .orderBy(desc(projects.createdAt))
          .limit(input?.pageSize ?? 24)
          .offset(((input?.page ?? 1) - 1) * (input?.pageSize ?? 24)),
        db.select({ count: sql<number>`count(*)` }).from(projects).where(whereClause),
      ]);

      return {
        items: rows,
        total: countResult[0]?.count ?? 0,
        page: input?.page ?? 1,
        pageSize: input?.pageSize ?? 24,
      };
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const project = await db.query.projects.findFirst({
        where: eq(projects.id, input.id),
      });

      if (!project) return null;

      const [media, units] = await Promise.all([
        db.select().from(projectMedia).where(eq(projectMedia.projectId, input.id)),
        db.select().from(projectUnits).where(eq(projectUnits.projectId, input.id)),
      ]);

      return { ...project, media, units };
    }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const project = await db.query.projects.findFirst({
        where: eq(projects.seoSlug, input.slug),
      });

      if (!project) return null;

      const [media, units] = await Promise.all([
        db.select().from(projectMedia).where(eq(projectMedia.projectId, project.id)),
        db.select().from(projectUnits).where(eq(projectUnits.projectId, project.id)),
      ]);

      return { ...project, media, units };
    }),

  create: editorQuery
    .input(z.object({
      name: z.string().min(1),
      developerName: z.string().optional(),
      description: z.string().optional(),
      projectType: z.enum(["RESIDENTIAL", "COMMERCIAL", "MIXED"]),
      locality: z.string().min(1),
      city: z.string().min(1),
      totalUnits: z.number().optional(),
      priceRangeMin: z.string().optional(),
      priceRangeMax: z.string().optional(),
      status: z.enum(["ACTIVE", "INACTIVE", "COMPLETED", "UPCOMING"]).default("ACTIVE"),
      seoSlug: z.string().optional(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
      isFeatured: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(projects).values(input as any).$returningId();
      return db.query.projects.findFirst({ where: eq(projects.id, result[0].id) });
    }),

  update: editorQuery
    .input(z.object({ id: z.number(), data: z.record(z.string(), z.any()) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(projects).set(input.data as any).where(eq(projects.id, input.id));
      return db.query.projects.findFirst({ where: eq(projects.id, input.id) });
    }),

  delete: editorQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(projects).where(eq(projects.id, input.id));
      return { success: true };
    }),
});
