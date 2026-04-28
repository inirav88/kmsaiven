import { relations } from "drizzle-orm";
import {
  users,
  properties,
  propertyMedia,
  projects,
  projectMedia,
  projectUnits,
  buyerRequirements,
  leads,
  leadActivities,
  blogPosts,
  teamMembers,
} from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// USER RELATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  leads: many(leads),
  activities: many(leadActivities),
  blogPosts: many(blogPosts),
  teamMember: many(teamMembers),
}));

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTY RELATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  media: many(propertyMedia),
  project: one(projects, {
    fields: [properties.linkedProjectId],
    references: [projects.id],
  }),
  assignedAgent: one(users, {
    fields: [properties.assignedAgentId],
    references: [users.id],
  }),
}));

export const propertyMediaRelations = relations(propertyMedia, ({ one }) => ({
  property: one(properties, {
    fields: [propertyMedia.propertyId],
    references: [properties.id],
  }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT RELATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const projectsRelations = relations(projects, ({ many }) => ({
  media: many(projectMedia),
  units: many(projectUnits),
  properties: many(properties),
}));

export const projectMediaRelations = relations(projectMedia, ({ one }) => ({
  project: one(projects, {
    fields: [projectMedia.projectId],
    references: [projects.id],
  }),
}));

export const projectUnitsRelations = relations(projectUnits, ({ one }) => ({
  project: one(projects, {
    fields: [projectUnits.projectId],
    references: [projects.id],
  }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// BUYER REQUIREMENT RELATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const buyerRequirementsRelations = relations(buyerRequirements, ({ one }) => ({
  assignedAgent: one(users, {
    fields: [buyerRequirements.assignedAgentId],
    references: [users.id],
  }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// LEAD RELATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const leadsRelations = relations(leads, ({ one, many }) => ({
  assignedAgent: one(users, {
    fields: [leads.assignedTo],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [leads.propertyId],
    references: [properties.id],
  }),
  project: one(projects, {
    fields: [leads.projectId],
    references: [projects.id],
  }),
  activities: many(leadActivities),
}));

export const leadActivitiesRelations = relations(leadActivities, ({ one }) => ({
  lead: one(leads, {
    fields: [leadActivities.leadId],
    references: [leads.id],
  }),
  user: one(users, {
    fields: [leadActivities.userId],
    references: [users.id],
  }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// BLOG RELATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// TEAM MEMBER RELATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));
