import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import { createRouter, publicQuery, agentQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { buyerRequirements } from "@db/schema";

export const requirementRouter = createRouter({
  // Public: Create buyer requirement
  create: publicQuery
    .input(z.object({
      requirementType: z.enum(["BUY", "RENT", "LEASE", "PG"]),
      category: z.enum(["RESIDENTIAL", "COMMERCIAL", "PLOT_LAND", "AGRICULTURAL"]),
      propertyType: z.string(),
      subTypeDetail: z.string().optional(),
      bhkConfig: z.array(z.string()).optional(),
      city: z.string().min(1),
      localities: z.array(z.string()).optional(),
      searchRadius: z.string().optional(),
      areaMin: z.string().optional(),
      areaMax: z.string().optional(),
      areaUnit: z.string().optional(),
      budgetMin: z.string().optional(),
      budgetMax: z.string().optional(),
      monthlyRentMin: z.string().optional(),
      monthlyRentMax: z.string().optional(),
      possessionStatus: z.string().optional(),
      furnishingStatus: z.string().optional(),
      amenities: z.array(z.string()).optional(),
      isVastuCompliant: z.boolean().optional(),
      needsLoan: z.boolean().optional(),
      monthlyIncome: z.string().optional(),
      contactName: z.string().min(1),
      mobile: z.string().min(1),
      email: z.string().optional(),
      whatsapp: z.string().optional(),
      additionalNotes: z.string().optional(),
      source: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(buyerRequirements)
        .values(input as any)
        .$returningId();

      return db.query.buyerRequirements.findFirst({
        where: eq(buyerRequirements.id, result[0].id),
      });
    }),

  // Agent+: List requirements
  list: agentQuery
    .input(
      z.object({
        status: z.string().optional(),
        requirementType: z.string().optional(),
        city: z.string().optional(),
        page: z.number().default(1),
        pageSize: z.number().default(50),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const filters = [];

      if (input?.status) filters.push(eq(buyerRequirements.status, input.status as any));
      if (input?.requirementType) filters.push(eq(buyerRequirements.requirementType, input.requirementType as any));
      if (input?.city) filters.push(eq(buyerRequirements.city, input.city));

      const whereClause = filters.length > 0 ? and(...filters) : undefined;

      const [rows, countResult] = await Promise.all([
        db.select().from(buyerRequirements)
          .where(whereClause)
          .orderBy(desc(buyerRequirements.createdAt))
          .limit(input?.pageSize ?? 50)
          .offset(((input?.page ?? 1) - 1) * (input?.pageSize ?? 50)),
        db.select({ count: sql<number>`count(*)` }).from(buyerRequirements).where(whereClause),
      ]);

      return {
        items: rows,
        total: countResult[0]?.count ?? 0,
        page: input?.page ?? 1,
        pageSize: input?.pageSize ?? 50,
      };
    }),

  // Get by ID
  byId: agentQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getDb().query.buyerRequirements.findFirst({
        where: eq(buyerRequirements.id, input.id),
      });
    }),

  // Update status
  updateStatus: agentQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["ACTIVE", "FULFILLED", "EXPIRED"]),
    }))
    .mutation(async ({ input }) => {
      await getDb().update(buyerRequirements)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(buyerRequirements.id, input.id));
      return { success: true };
    }),
});
