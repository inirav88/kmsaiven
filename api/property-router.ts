import { z } from "zod";
import { eq, and, desc, like, sql } from "drizzle-orm";
import { createRouter, publicQuery, editorQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { properties, propertyMedia } from "@db/schema";

export const propertyRouter = createRouter({
  // List properties with filters
  list: publicQuery
    .input(
      z.object({
        listingType: z.string().optional(),
        category: z.string().optional(),
        propertyType: z.string().optional(),
        city: z.string().optional(),
        locality: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
        bhk: z.string().optional(),
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

      if (input?.listingType) filters.push(eq(properties.listingType, input.listingType as "SALE" | "RENT" | "LEASE" | "PG" | "NEW_PROJECT"));
      if (input?.category) filters.push(eq(properties.category, input.category as "RESIDENTIAL" | "COMMERCIAL" | "PLOT_LAND" | "AGRICULTURAL"));
      if (input?.propertyType) filters.push(eq(properties.propertyType, input.propertyType as any));
      if (input?.city) filters.push(eq(properties.city, input.city));
      if (input?.locality) filters.push(like(properties.locality, `%${input.locality}%`));
      if (input?.status) filters.push(eq(properties.status, input.status as any));
      if (input?.isFeatured !== undefined) filters.push(eq(properties.isFeatured, input.isFeatured));
      if (input?.search) {
        filters.push(like(properties.title, `%${input.search}%`));
      }

      const whereClause = filters.length > 0 ? and(...filters) : undefined;

      const [rows, countResult] = await Promise.all([
        db.select().from(properties)
          .where(whereClause)
          .orderBy(desc(properties.createdAt))
          .limit(input?.pageSize ?? 24)
          .offset(((input?.page ?? 1) - 1) * (input?.pageSize ?? 24)),
        db.select({ count: sql<number>`count(*)` }).from(properties).where(whereClause),
      ]);

      return {
        items: rows,
        total: countResult[0]?.count ?? 0,
        page: input?.page ?? 1,
        pageSize: input?.pageSize ?? 24,
      };
    }),

  // Get single property by ID
  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const property = await db.query.properties.findFirst({
        where: eq(properties.id, input.id),
      });

      if (!property) return null;

      const media = await db.select().from(propertyMedia)
        .where(eq(propertyMedia.propertyId, input.id))
        .orderBy(propertyMedia.order);

      return { ...property, media };
    }),

  // Get property by slug
  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const property = await db.query.properties.findFirst({
        where: eq(properties.seoSlug, input.slug),
      });

      if (!property) return null;

      const media = await db.select().from(propertyMedia)
        .where(eq(propertyMedia.propertyId, property.id))
        .orderBy(propertyMedia.order);

      return { ...property, media };
    }),

  // Create property (editor+)
  create: editorQuery
    .input(z.object({
      listingType: z.enum(["SALE", "RENT", "LEASE", "PG", "NEW_PROJECT"]),
      category: z.enum(["RESIDENTIAL", "COMMERCIAL", "PLOT_LAND", "AGRICULTURAL"]),
      propertyType: z.string(),
      title: z.string().min(1),
      description: z.string().optional(),
      city: z.string().min(1),
      locality: z.string().min(1),
      pincode: z.string().min(1),
      state: z.string().default("Gujarat"),
      expectedPrice: z.string().optional(),
      monthlyRent: z.string().optional(),
      bedrooms: z.number().optional(),
      bathrooms: z.number().optional(),
      superBuiltUpArea: z.string().optional(),
      carpetArea: z.string().optional(),
      bhkConfig: z.string().optional(),
      furnishingStatus: z.string().optional(),
      possessionStatus: z.string().optional(),
      floorNo: z.number().optional(),
      totalFloors: z.number().optional(),
      facing: z.string().optional(),
      latitude: z.string().optional(),
      longitude: z.string().optional(),
      contactMobile: z.string().min(1),
      contactEmail: z.string().optional(),
      listedBy: z.enum(["OWNER", "BUILDER", "AGENT"]).default("OWNER"),
      seoSlug: z.string().optional(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional(),
      status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).default("DRAFT"),
      isFeatured: z.boolean().default(false),
      amenities: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      const propertyData: any = {
        ...input,
        createdBy: ctx.user.id,
      };

      const result = await db.insert(properties).values(propertyData as any).$returningId();
      const newProperty = await db.query.properties.findFirst({
        where: eq(properties.id, result[0]?.id ?? 0),
      });

      return newProperty;
    }),

  // Update property (editor+)
  update: editorQuery
    .input(z.object({
      id: z.number(),
      data: z.record(z.string(), z.any()),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(properties)
        .set(input.data)
        .where(eq(properties.id, input.id));

      return db.query.properties.findFirst({
        where: eq(properties.id, input.id),
      });
    }),

  // Delete property (editor+)
  delete: editorQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(properties).where(eq(properties.id, input.id));
      return { success: true };
    }),
});
