import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import { createRouter, publicQuery, agentQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { leads, leadActivities } from "@db/schema";

export const leadRouter = createRouter({
  // Public: Create lead (contact form, enquiry, etc.)
  create: publicQuery
    .input(z.object({
      type: z.enum([
        "PROPERTY_ENQUIRY", "PROJECT_ENQUIRY", "BUYER_REQUIREMENT",
        "CONTACT_US", "BROCHURE_DOWNLOAD", "SITE_VISIT_REQUEST",
        "CALL_REQUEST", "WHATSAPP"
      ]),
      propertyId: z.number().optional(),
      projectId: z.number().optional(),
      requirementId: z.number().optional(),
      name: z.string().min(1),
      email: z.string().email().optional(),
      mobile: z.string().optional(),
      message: z.string().optional(),
      source: z.string().default("WEBSITE"),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(leads).values(input as any).$returningId();
      return db.query.leads.findFirst({ where: eq(leads.id, result[0].id) });
    }),

  // Agent+: List leads with filters
  list: agentQuery
    .input(
      z.object({
        status: z.string().optional(),
        type: z.string().optional(),
        source: z.string().optional(),
        assignedTo: z.number().optional(),
        search: z.string().optional(),
        page: z.number().default(1),
        pageSize: z.number().default(50),
      }).optional()
    )
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const filters = [];

      // Agents only see their assigned leads (unless admin)
      if (ctx.user.role === "agent") {
        filters.push(eq(leads.assignedTo, ctx.user.id));
      }

      if (input?.status) filters.push(eq(leads.status, input.status as any));
      if (input?.type) filters.push(eq(leads.type, input.type as any));
      if (input?.source) filters.push(eq(leads.source, input.source as any));
      if (input?.assignedTo) filters.push(eq(leads.assignedTo, input.assignedTo));

      const whereClause = filters.length > 0 ? and(...filters) : undefined;

      const [rows, countResult] = await Promise.all([
        db.select().from(leads)
          .where(whereClause)
          .orderBy(desc(leads.createdAt))
          .limit(input?.pageSize ?? 50)
          .offset(((input?.page ?? 1) - 1) * (input?.pageSize ?? 50)),
        db.select({ count: sql<number>`count(*)` }).from(leads).where(whereClause),
      ]);

      return {
        items: rows,
        total: countResult[0]?.count ?? 0,
        page: input?.page ?? 1,
        pageSize: input?.pageSize ?? 50,
      };
    }),

  // Get lead by ID with activities
  byId: agentQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();

      const lead = await db.query.leads.findFirst({
        where: eq(leads.id, input.id),
      });

      if (!lead) return null;

      // Agents can only view their own leads
      if (ctx.user.role === "agent" && lead.assignedTo !== ctx.user.id) {
        return null;
      }

      const activities = await db.select().from(leadActivities)
        .where(eq(leadActivities.leadId, input.id))
        .orderBy(desc(leadActivities.createdAt));

      return { ...lead, activities };
    }),

  // Update lead status
  updateStatus: agentQuery
    .input(z.object({
      id: z.number(),
      status: z.enum([
        "NEW", "CONTACTED", "QUALIFIED", "SITE_VISIT_SCHEDULED",
        "SITE_VISIT_DONE", "NEGOTIATION", "CONVERTED", "LOST", "JUNK"
      ]),
      note: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const oldLead = await db.query.leads.findFirst({
        where: eq(leads.id, input.id),
      });

      await db.update(leads)
        .set({ status: input.status, updatedAt: new Date() })
        .where(eq(leads.id, input.id));

      // Log activity
      await db.insert(leadActivities).values({
        leadId: input.id,
        userId: ctx.user.id,
        action: "STATUS_CHANGED",
        note: input.note ?? `Status changed to ${input.status}`,
        oldStatus: oldLead?.status ?? undefined,
        newStatus: input.status,
      });

      return { success: true };
    }),

  // Add note to lead
  addNote: agentQuery
    .input(z.object({
      leadId: z.number(),
      note: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      await db.insert(leadActivities).values({
        leadId: input.leadId,
        userId: ctx.user.id,
        action: "NOTE_ADDED",
        note: input.note,
      });
      return { success: true };
    }),

  // Assign lead
  assign: adminQuery
    .input(z.object({
      id: z.number(),
      assignedTo: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      await db.update(leads)
        .set({ assignedTo: input.assignedTo, updatedAt: new Date() })
        .where(eq(leads.id, input.id));

      await db.insert(leadActivities).values({
        leadId: input.id,
        userId: ctx.user.id,
        action: "ASSIGNED",
        note: `Lead assigned to user ${input.assignedTo}`,
      });

      return { success: true };
    }),

  // Dashboard stats
  stats: adminQuery.query(async () => {
    const db = getDb();

    const [totalLeads, newLeads, convertedLeads, lostLeads] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(leads),
      db.select({ count: sql<number>`count(*)` }).from(leads).where(eq(leads.status, "NEW")),
      db.select({ count: sql<number>`count(*)` }).from(leads).where(eq(leads.status, "CONVERTED")),
      db.select({ count: sql<number>`count(*)` }).from(leads).where(eq(leads.status, "LOST")),
    ]);

    return {
      total: totalLeads[0]?.count ?? 0,
      new: newLeads[0]?.count ?? 0,
      converted: convertedLeads[0]?.count ?? 0,
      lost: lostLeads[0]?.count ?? 0,
    };
  }),
});
