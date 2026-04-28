import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
  json,
  decimal,
  boolean,
  date,
  index,
} from "drizzle-orm/mysql-core";

// ─────────────────────────────────────────────────────────────────────────────
// 1. USERS & AUTH
// ─────────────────────────────────────────────────────────────────────────────

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  mobile: varchar("mobile", { length: 20 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "agent", "editor", "admin", "super_admin"]).default("user").notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastLogin: timestamp("lastLogin").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// 2. PROPERTIES (complete model from 13-step wizard)
// ─────────────────────────────────────────────────────────────────────────────

export const properties = mysqlTable("properties", {
  id: serial("id").primaryKey(),

  // Step 1: Listing purpose
  listingType: mysqlEnum("listingType", ["SALE", "RENT", "LEASE", "PG", "NEW_PROJECT"]).notNull(),
  category: mysqlEnum("category", ["RESIDENTIAL", "COMMERCIAL", "PLOT_LAND", "AGRICULTURAL"]).notNull(),
  propertyType: mysqlEnum("propertyType", [
    "FLAT", "VILLA", "HOUSE", "BUILDER_FLOOR", "PENTHOUSE", "STUDIO",
    "ROW_HOUSE", "BUNGALOW", "FARM_HOUSE", "SERVICED_APARTMENT", "CO_LIVING",
    "OFFICE", "SHOP", "SHOWROOM", "WAREHOUSE", "INDUSTRIAL_SHED", "COWORK",
    "HOTEL", "COLD_STORAGE", "COMMERCIAL_COMPLEX", "PETROL_PUMP",
    "RESIDENTIAL_PLOT", "COMMERCIAL_PLOT", "INDUSTRIAL_PLOT", "AGRICULTURAL_LAND",
    "FARM_LAND", "ORCHARD", "AGRI_BUSINESS", "FOREST_LAND"
  ]).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),

  // Step 4: Location
  buildingName: varchar("buildingName", { length: 255 }),
  street: varchar("street", { length: 255 }),
  locality: varchar("locality", { length: 255 }).notNull(),
  subLocality: varchar("subLocality", { length: 255 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  pincode: varchar("pincode", { length: 10 }).notNull(),
  landmark: varchar("landmark", { length: 255 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),

  // Floor info
  floorNo: int("floorNo"),
  totalFloors: int("totalFloors"),
  tower: varchar("tower", { length: 100 }),

  // Step 5: Property configuration
  superBuiltUpArea: decimal("superBuiltUpArea", { precision: 12, scale: 2 }),
  builtUpArea: decimal("builtUpArea", { precision: 12, scale: 2 }),
  carpetArea: decimal("carpetArea", { precision: 12, scale: 2 }),
  plotArea: decimal("plotArea", { precision: 12, scale: 2 }),
  areaUnit: mysqlEnum("areaUnit", ["SQ_FT", "SQ_YD", "SQ_M", "ACRES", "BIGHA", "GUNTHA", "HECTARE"]).default("SQ_FT"),

  // Room config
  bhkConfig: mysqlEnum("bhkConfig", ["STUDIO", "1_BHK", "1_5_BHK", "2_BHK", "2_5_BHK", "3_BHK", "3_5_BHK", "4_BHK", "4PLUS_BHK", "5PLUS_BHK"]),
  bedrooms: int("bedrooms"),
  bathrooms: int("bathrooms"),
  balconies: int("balconies"),
  hasStudyRoom: boolean("hasStudyRoom").default(false),
  hasServantRoom: boolean("hasServantRoom").default(false),
  hasPujaRoom: boolean("hasPujaRoom").default(false),

  // Commercial specs
  washrooms: int("washrooms"),
  ceilingHeight: decimal("ceilingHeight", { precision: 5, scale: 2 }),
  frontageWidth: decimal("frontageWidth", { precision: 5, scale: 2 }),
  hasLoadingDock: boolean("hasLoadingDock").default(false),
  cabinsCount: int("cabinsCount"),

  // Orientation & parking
  facing: mysqlEnum("facing", ["EAST", "WEST", "NORTH", "SOUTH", "NE", "NW", "SE", "SW"]),
  coveredParking4W: int("coveredParking4W").default(0),
  openParking4W: int("openParking4W").default(0),
  parking2W: int("parking2W").default(0),
  isCornerUnit: boolean("isCornerUnit").default(false),

  // Step 6: Condition & utilities
  possessionStatus: mysqlEnum("possessionStatus", ["READY", "UNDER_CONSTRUCTION", "NEW_LAUNCH"]).notNull(),
  availableFrom: date("availableFrom"),
  ageOfProperty: mysqlEnum("ageOfProperty", ["NEW", "UNDER_1_YEAR", "1_3_YEARS", "3_5_YEARS", "5_10_YEARS", "10_20_YEARS", "20PLUS_YEARS"]),
  furnishingStatus: mysqlEnum("furnishingStatus", ["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"]),
  flooringType: mysqlEnum("flooringType", ["VITRIFIED", "MARBLE", "GRANITE", "WOODEN", "IPS", "CEMENT"]),
  openSides: mysqlEnum("openSides", ["1", "2", "3", "4"]),
  isVastuCompliant: boolean("isVastuCompliant").default(false),

  // Utilities (stored as JSON arrays)
  waterSupply: json("waterSupply").$type<string[]>(),
  powerBackup: mysqlEnum("powerBackup", ["FULL", "PARTIAL", "DG_SET", "SOLAR", "NONE"]),
  gasConnection: mysqlEnum("gasConnection", ["PNG", "LPG", "BOTH", "NONE"]),
  lift: mysqlEnum("lift", ["PASSENGER", "PASSENGER_GOODS", "NONE"]),
  isInternetReady: boolean("isInternetReady").default(false),

  // Step 7: Pricing
  expectedPrice: decimal("expectedPrice", { precision: 15, scale: 2 }),
  monthlyRent: decimal("monthlyRent", { precision: 12, scale: 2 }),
  pricePerSqft: decimal("pricePerSqft", { precision: 12, scale: 2 }),
  isNegotiable: boolean("isNegotiable").default(false),
  isAllInclusive: boolean("isAllInclusive").default(false),
  stampDutyBy: mysqlEnum("stampDutyBy", ["BUYER", "SELLER", "SHARED", "TBD"]),
  loanAvailable: boolean("loanAvailable").default(false),
  approvedBanks: json("approvedBanks").$type<string[]>(),

  // Rent/Lease
  securityDeposit: decimal("securityDeposit", { precision: 12, scale: 2 }),
  depositMonths: mysqlEnum("depositMonths", ["1", "2", "3", "6", "FIXED"]),
  maintenanceCharges: decimal("maintenanceCharges", { precision: 10, scale: 2 }),
  maintenanceIncluded: boolean("maintenanceIncluded").default(false),
  lockInPeriod: int("lockInPeriod"),
  leaseDuration: int("leaseDuration"),

  // PG
  pgOccupancy: json("pgOccupancy").$type<string[]>(),
  pgPreferredTenants: json("pgPreferredTenants").$type<string[]>(),
  pgMealsAvailable: boolean("pgMealsAvailable").default(false),
  pgMealPlan: json("pgMealPlan").$type<string[]>(),

  // Brokerage
  brokerageApplicable: boolean("brokerageApplicable").default(false),
  brokerageAmount: decimal("brokerageAmount", { precision: 10, scale: 2 }),
  brokerageBy: mysqlEnum("brokerageBy", ["BUYER", "OWNER", "SHARED"]),

  // Step 8: Society amenities (stored as JSON array)
  amenities: json("amenities").$type<string[]>(),

  // Step 9: Unit features (stored as JSON arrays)
  kitchenFeatures: json("kitchenFeatures").$type<string[]>(),
  livingRoomFeatures: json("livingRoomFeatures").$type<string[]>(),
  appliances: json("appliances").$type<string[]>(),

  // Step 11: Legal & RERA
  isReraRegistered: boolean("isReraRegistered").default(false),
  reraNumber: varchar("reraNumber", { length: 255 }),
  reraUrl: text("reraUrl"),
  occupancyCertificate: mysqlEnum("occupancyCertificate", ["RECEIVED", "PENDING", "NOT_APPLIED", "NA"]),
  completionCertificate: mysqlEnum("completionCertificate", ["RECEIVED", "PENDING", "NA"]),
  hasNAOrder: boolean("hasNAOrder").default(false),
  hasEnvClearance: boolean("hasEnvClearance").default(false),
  hasFireNOC: boolean("hasFireNOC").default(false),
  propertyTaxStatus: mysqlEnum("propertyTaxStatus", ["PAID", "PENDING", "NA"]),
  titleStatus: mysqlEnum("titleStatus", ["CLEAR", "MORTGAGE", "COURT", "TBD"]),
  ownershipType: mysqlEnum("ownershipType", ["FREEHOLD", "LEASEHOLD", "COOP", "GIDC"]),
  societyFormed: boolean("societyFormed").default(false),
  totalUnits: int("totalUnits"),
  unitsSold: int("unitsSold"),

  // Step 12: Contact & agent
  listedBy: mysqlEnum("listedBy", ["OWNER", "BUILDER", "AGENT"]).notNull(),
  agentName: varchar("agentName", { length: 255 }),
  agentReraNumber: varchar("agentReraNumber", { length: 255 }),
  contactMobile: varchar("contactMobile", { length: 20 }).notNull(),
  contactWhatsapp: varchar("contactWhatsapp", { length: 20 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  preferredCallTime: json("preferredCallTime").$type<string[]>(),
  languagePreference: json("languagePreference").$type<string[]>(),

  // Site visit
  siteVisitsAllowed: boolean("siteVisitsAllowed").default(true),
  priorAppointment: boolean("priorAppointment").default(true),
  visitDays: json("visitDays").$type<string[]>(),
  visitHoursFrom: varchar("visitHoursFrom", { length: 10 }),
  visitHoursTo: varchar("visitHoursTo", { length: 10 }),

  // Step 13: Review & publish
  status: mysqlEnum("status", ["DRAFT", "ACTIVE", "INACTIVE", "SOLD", "RENTED"]).default("DRAFT").notNull(),
  listingTier: mysqlEnum("listingTier", ["STANDARD", "FEATURED", "VIP_PREMIUM"]).default("STANDARD"),
  validUntil: date("validUntil"),
  autoRenew: boolean("autoRenew").default(false),
  renewalReminderDays: int("renewalReminderDays").default(7),

  // SEO
  seoSlug: varchar("seoSlug", { length: 500 }),
  seoTitle: varchar("seoTitle", { length: 100 }),
  seoDescription: varchar("seoDescription", { length: 200 }),
  propertyHighlights: text("propertyHighlights"),

  // Internal
  linkedProjectId: bigint("linkedProjectId", { mode: "number", unsigned: true }),
  assignedAgentId: bigint("assignedAgentId", { mode: "number", unsigned: true }),
  leadSource: mysqlEnum("leadSource", ["WALK_IN", "WHATSAPP", "WEBSITE", "NINETYNINEACRES", "HOUSING", "MAGICBRICKS", "SOCIAL_MEDIA", "REFERRAL", "COLD_CALL"]),
  isHotProperty: boolean("isHotProperty").default(false),
  adminNotes: text("adminNotes"),

  // Counters
  views: int("views").default(0),
  enquiries: int("enquiries").default(0),

  // Flags
  isFeatured: boolean("isFeatured").default(false),
  isPremium: boolean("isPremium").default(false),
  isVerified: boolean("isVerified").default(false),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  index("idx_properties_listingType").on(table.listingType),
  index("idx_properties_category").on(table.category),
  index("idx_properties_propertyType").on(table.propertyType),
  index("idx_properties_city").on(table.city),
  index("idx_properties_locality").on(table.locality),
  index("idx_properties_status").on(table.status),
  index("idx_properties_price").on(table.expectedPrice),
  index("idx_properties_seoSlug").on(table.seoSlug),
]);

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// 3. PROPERTY MEDIA
// ─────────────────────────────────────────────────────────────────────────────

export const propertyMedia = mysqlTable("property_media", {
  id: serial("id").primaryKey(),
  propertyId: bigint("propertyId", { mode: "number", unsigned: true }).notNull(),
  type: mysqlEnum("type", ["PHOTO", "VIDEO", "FLOORPLAN", "BROCHURE", "SITE_PLAN", "VIRTUAL_TOUR"]).notNull(),
  url: text("url").notNull(),
  order: int("order").default(0),
  caption: varchar("caption", { length: 255 }),
  roomTag: varchar("roomTag", { length: 100 }),
  isCover: boolean("isCover").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PropertyMedia = typeof propertyMedia.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 4. PROJECTS
// ─────────────────────────────────────────────────────────────────────────────

export const projects = mysqlTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  developerName: varchar("developerName", { length: 255 }),
  tagline: varchar("tagline", { length: 500 }),
  description: text("description"),
  projectType: mysqlEnum("projectType", ["RESIDENTIAL", "COMMERCIAL", "MIXED"]).notNull(),
  totalUnits: int("totalUnits"),
  totalTowers: int("totalTowers"),
  totalFloors: int("totalFloors"),
  projectArea: decimal("projectArea", { precision: 10, scale: 2 }),
  projectAreaUnit: mysqlEnum("projectAreaUnit", ["ACRES", "SQ_FT", "SQ_M"]).default("ACRES"),

  // Location
  address: text("address"),
  locality: varchar("locality", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  pincode: varchar("pincode", { length: 10 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  googleMapsEmbed: text("googleMapsEmbed"),
  nearbyLandmarks: json("nearbyLandmarks").$type<string[]>(),

  // Timeline
  launchDate: date("launchDate"),
  constructionStartDate: date("constructionStartDate"),
  possessionDate: date("possessionDate"),
  constructionStage: mysqlEnum("constructionStage", ["FOUNDATION", "STRUCTURE", "FINISHING", "READY"]),
  reraNumber: varchar("reraNumber", { length: 255 }),
  reraExpiry: date("reraExpiry"),

  // Approvals
  ocStatus: mysqlEnum("ocStatus", ["RECEIVED", "PENDING", "NOT_APPLIED", "NA"]),
  buildingPlanAuthority: varchar("buildingPlanAuthority", { length: 255 }),
  bankApprovals: json("bankApprovals").$type<string[]>(),

  // Amenities (same 36-item system)
  amenities: json("amenities").$type<string[]>(),

  // Specifications
  structureType: varchar("structureType", { length: 255 }),
  flooring: varchar("flooring", { length: 255 }),
  doorsWindows: varchar("doorsWindows", { length: 255 }),
  kitchenPlatform: varchar("kitchenPlatform", { length: 255 }),
  electrical: varchar("electrical", { length: 255 }),
  plumbing: varchar("plumbing", { length: 255 }),
  paintingFinish: varchar("paintingFinish", { length: 255 }),

  // Developer info
  developerEstablished: int("developerEstablished"),
  developerTotalProjects: int("developerTotalProjects"),
  developerWebsite: varchar("developerWebsite", { length: 255 }),
  developerLogo: text("developerLogo"),

  // SEO
  seoSlug: varchar("seoSlug", { length: 500 }),
  seoTitle: varchar("seoTitle", { length: 100 }),
  seoDescription: varchar("seoDescription", { length: 200 }),
  ogImage: text("ogImage"),

  status: mysqlEnum("status", ["ACTIVE", "INACTIVE", "COMPLETED", "UPCOMING"]).default("ACTIVE"),
  isFeatured: boolean("isFeatured").default(false),

  priceRangeMin: decimal("priceRangeMin", { precision: 15, scale: 2 }),
  priceRangeMax: decimal("priceRangeMax", { precision: 15, scale: 2 }),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  index("idx_projects_city").on(table.city),
  index("idx_projects_locality").on(table.locality),
  index("idx_projects_status").on(table.status),
  index("idx_projects_seoSlug").on(table.seoSlug),
]);

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// 5. PROJECT MEDIA
// ─────────────────────────────────────────────────────────────────────────────

export const projectMedia = mysqlTable("project_media", {
  id: serial("id").primaryKey(),
  projectId: bigint("projectId", { mode: "number", unsigned: true }).notNull(),
  type: mysqlEnum("type", ["PHOTO", "MASTER_PLAN", "FLOOR_PLAN", "VIDEO", "VIRTUAL_TOUR", "BROCHURE"]).notNull(),
  url: text("url").notNull(),
  order: int("order").default(0),
  caption: varchar("caption", { length: 255 }),
  unitType: varchar("unitType", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectMedia = typeof projectMedia.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 6. PROJECT UNITS
// ─────────────────────────────────────────────────────────────────────────────

export const projectUnits = mysqlTable("project_units", {
  id: serial("id").primaryKey(),
  projectId: bigint("projectId", { mode: "number", unsigned: true }).notNull(),
  unitType: varchar("unitType", { length: 50 }).notNull(),
  areaMin: decimal("areaMin", { precision: 10, scale: 2 }),
  areaMax: decimal("areaMax", { precision: 10, scale: 2 }),
  areaUnit: mysqlEnum("areaUnit", ["SQ_FT", "SQ_YD", "SQ_M"]).default("SQ_FT"),
  priceMin: decimal("priceMin", { precision: 15, scale: 2 }),
  priceMax: decimal("priceMax", { precision: 15, scale: 2 }),
  availability: int("availability"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectUnit = typeof projectUnits.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 7. BUYER REQUIREMENTS (from post-requirement.html)
// ─────────────────────────────────────────────────────────────────────────────

export const buyerRequirements = mysqlTable("buyer_requirements", {
  id: serial("id").primaryKey(),
  requirementType: mysqlEnum("requirementType", ["BUY", "RENT", "LEASE", "PG"]).notNull(),
  category: mysqlEnum("category", ["RESIDENTIAL", "COMMERCIAL", "PLOT_LAND", "AGRICULTURAL"]).notNull(),
  propertyType: mysqlEnum("propertyType", [
    "FLAT", "VILLA", "HOUSE", "BUILDER_FLOOR", "PENTHOUSE", "STUDIO",
    "ROW_HOUSE", "FARM_HOUSE", "OFFICE", "SHOP", "WAREHOUSE", "COWORK",
    "RESIDENTIAL_PLOT", "COMMERCIAL_PLOT", "INDUSTRIAL_PLOT",
    "AGRICULTURAL_LAND", "FARM_LAND", "ORCHARD"
  ]).notNull(),

  // Sub-type detail
  subTypeDetail: varchar("subTypeDetail", { length: 255 }),

  // BHK
  bhkConfig: json("bhkConfig").$type<string[]>(),

  // Location
  city: varchar("city", { length: 100 }).notNull(),
  localities: json("localities").$type<string[]>(),
  searchRadius: varchar("searchRadius", { length: 20 }),

  // Area
  areaMin: decimal("areaMin", { precision: 12, scale: 2 }),
  areaMax: decimal("areaMax", { precision: 12, scale: 2 }),
  areaUnit: mysqlEnum("areaUnit", ["SQ_FT", "SQ_YD", "SQ_M", "ACRES", "BIGHA", "GUNTHA", "HECTARE"]).default("SQ_FT"),

  // Budget
  budgetMin: decimal("budgetMin", { precision: 15, scale: 2 }),
  budgetMax: decimal("budgetMax", { precision: 15, scale: 2 }),
  budgetUnit: mysqlEnum("budgetUnit", ["LAKH", "CRORE", "THOUSAND"]).default("LAKH"),

  // Rent-specific
  monthlyRentMin: decimal("monthlyRentMin", { precision: 12, scale: 2 }),
  monthlyRentMax: decimal("monthlyRentMax", { precision: 12, scale: 2 }),
  maxDeposit: varchar("maxDeposit", { length: 50 }),
  leaseTenure: varchar("leaseTenure", { length: 50 }),

  // Preferences
  possessionStatus: mysqlEnum("possessionStatus", ["READY", "UNDER_CONSTRUCTION", "ANY"]).default("ANY"),
  timeline: varchar("timeline", { length: 50 }),
  furnishingStatus: mysqlEnum("furnishingStatus", ["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED", "ANY"]).default("ANY"),
  floorPreference: json("floorPreference").$type<string[]>(),
  amenities: json("amenities").$type<string[]>(),
  parking4W: int("parking4W").default(0),
  parking2W: int("parking2W").default(0),
  facing: json("facing").$type<string[]>(),

  // Toggles
  isVastuCompliant: boolean("isVastuCompliant").default(false),
  nearHighway: boolean("nearHighway").default(false),
  isCornerPlot: boolean("isCornerPlot").default(false),
  flexibleLocation: boolean("flexibleLocation").default(false),

  // Loan
  needsLoan: boolean("needsLoan").default(false),
  monthlyIncome: decimal("monthlyIncome", { precision: 12, scale: 2 }),
  loanAmount: decimal("loanAmount", { precision: 15, scale: 2 }),
  employmentType: mysqlEnum("employmentType", ["SALARIED", "SELF_EMPLOYED", "NRI", "FREELANCER"]),
  preferredBank: varchar("preferredBank", { length: 100 }),

  // Price preferences
  isNegotiable: boolean("isNegotiable").default(true),
  zeroBrokerage: boolean("zeroBrokerage").default(false),

  // Contact
  contactName: varchar("contactName", { length: 255 }).notNull(),
  mobile: varchar("mobile", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  whatsapp: varchar("whatsapp", { length: 20 }),

  // Communication prefs
  whatsappUpdates: boolean("whatsappUpdates").default(true),
  emailAlerts: boolean("emailAlerts").default(true),
  phoneFollowUp: boolean("phoneFollowUp").default(true),
  preferredCallTime: json("preferredCallTime").$type<string[]>(),
  languagePreference: json("languagePreference").$type<string[]>(),

  // Profile
  buyerProfile: mysqlEnum("buyerProfile", ["FAMILY", "COUPLE", "BACHELOR_M", "BACHELOR_F", "CORPORATE", "NRI"]),
  familySize: varchar("familySize", { length: 50 }),
  additionalNotes: text("additionalNotes"),
  source: varchar("source", { length: 100 }),

  // Status
  status: mysqlEnum("status", ["ACTIVE", "FULFILLED", "EXPIRED"]).default("ACTIVE"),
  expiresAt: date("expiresAt"),
  assignedAgentId: bigint("assignedAgentId", { mode: "number", unsigned: true }),
  isVerified: boolean("isVerified").default(false),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  index("idx_reqs_type").on(table.requirementType),
  index("idx_reqs_category").on(table.category),
  index("idx_reqs_city").on(table.city),
  index("idx_reqs_status").on(table.status),
]);

export type BuyerRequirement = typeof buyerRequirements.$inferSelect;
export type InsertBuyerRequirement = typeof buyerRequirements.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// 8. LEADS (CRM)
// ─────────────────────────────────────────────────────────────────────────────

export const leads = mysqlTable("leads", {
  id: serial("id").primaryKey(),
  type: mysqlEnum("type", [
    "PROPERTY_ENQUIRY", "PROJECT_ENQUIRY", "BUYER_REQUIREMENT",
    "CONTACT_US", "BROCHURE_DOWNLOAD", "SITE_VISIT_REQUEST",
    "CALL_REQUEST", "WHATSAPP"
  ]).notNull(),

  // Linked entities
  propertyId: bigint("propertyId", { mode: "number", unsigned: true }),
  projectId: bigint("projectId", { mode: "number", unsigned: true }),
  requirementId: bigint("requirementId", { mode: "number", unsigned: true }),

  // Contact
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  mobile: varchar("mobile", { length: 20 }),
  message: text("message"),

  // Source & status
  source: mysqlEnum("source", [
    "WEBSITE", "PORTAL", "SOCIAL", "DIRECT", "WALK_IN",
    "REFERRAL", "WHATSAPP", "NINETYNINEACRES", "HOUSING", "MAGICBRICKS",
    "INDIAMART", "FACEBOOK_ADS"
  ]).default("WEBSITE"),
  status: mysqlEnum("status", [
    "NEW", "CONTACTED", "QUALIFIED", "SITE_VISIT_SCHEDULED",
    "SITE_VISIT_DONE", "NEGOTIATION", "CONVERTED", "LOST", "JUNK"
  ]).default("NEW"),

  // Assignment & follow-up
  assignedTo: bigint("assignedTo", { mode: "number", unsigned: true }),
  notes: json("notes").$type<Array<{ note: string; createdBy: number; createdAt: Date }>>(),
  nextFollowUp: timestamp("nextFollowUp"),

  // Scoring
  leadScore: int("leadScore").default(0),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => [
  index("idx_leads_type").on(table.type),
  index("idx_leads_status").on(table.status),
  index("idx_leads_source").on(table.source),
  index("idx_leads_assigned").on(table.assignedTo),
  index("idx_leads_created").on(table.createdAt),
]);

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// 9. LEAD ACTIVITIES
// ─────────────────────────────────────────────────────────────────────────────

export const leadActivities = mysqlTable("lead_activities", {
  id: serial("id").primaryKey(),
  leadId: bigint("leadId", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  action: mysqlEnum("action", [
    "NOTE_ADDED", "STATUS_CHANGED", "ASSIGNED", "SITE_VISIT_SCHEDULED",
    "WHATSAPP_SENT", "EMAIL_SENT", "CALL_MADE", "FOLLOW_UP_SET"
  ]).notNull(),
  note: text("note"),
  oldStatus: varchar("oldStatus", { length: 50 }),
  newStatus: varchar("newStatus", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LeadActivity = typeof leadActivities.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 10. SITE CONFIG (CMS)
// ─────────────────────────────────────────────────────────────────────────────

export const siteConfig = mysqlTable("site_config", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  type: mysqlEnum("type", ["STRING", "JSON", "BOOLEAN", "COLOR", "FILE"]).default("STRING"),
  group: varchar("group", { length: 100 }).default("general"),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type SiteConfig = typeof siteConfig.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 11. CMS PAGES
// ─────────────────────────────────────────────────────────────────────────────

export const pages = mysqlTable("pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  content: json("content").$type<Array<{ type: string; data: Record<string, unknown> }>>(),
  seoTitle: varchar("seoTitle", { length: 100 }),
  seoDescription: varchar("seoDescription", { length: 200 }),
  isPublished: boolean("isPublished").default(false),
  template: varchar("template", { length: 50 }).default("default"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Page = typeof pages.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 12. HOMEPAGE SECTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const homepageSections = mysqlTable("homepage_sections", {
  id: serial("id").primaryKey(),
  type: mysqlEnum("type", [
    "HERO_BANNER", "SEARCH_BAR", "FEATURED_PROPERTIES",
    "FEATURED_PROJECTS", "BUYER_CTA", "WHY_CHOOSE_US",
    "STATISTICS", "TESTIMONIALS", "BLOG", "AGENTS_TEAM", "FOOTER"
  ]).notNull(),
  title: varchar("title", { length: 255 }),
  subtitle: varchar("subtitle", { length: 500 }),
  order: int("order").default(0),
  config: json("config"),
  isEnabled: boolean("isEnabled").default(true),
  showOnMobile: boolean("showOnMobile").default(true),
  showOnDesktop: boolean("showOnDesktop").default(true),
  bgColor: varchar("bgColor", { length: 20 }),
  padding: varchar("padding", { length: 20 }).default("medium"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type HomepageSection = typeof homepageSections.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 13. BANNERS
// ─────────────────────────────────────────────────────────────────────────────

export const banners = mysqlTable("banners", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  imageUrl: text("imageUrl"),
  ctaLabel: varchar("ctaLabel", { length: 100 }),
  ctaUrl: varchar("ctaUrl", { length: 255 }),
  position: mysqlEnum("position", ["HOME_HERO", "HOME_MID", "PROPERTY_LISTING", "PROJECT_LISTING", "SIDEBAR"]).default("HOME_HERO"),
  order: int("order").default(0),
  isActive: boolean("isActive").default(true),
  startsAt: timestamp("startsAt").defaultNow(),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Banner = typeof banners.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 14. AUTOMATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const automations = mysqlTable("automations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  trigger: mysqlEnum("trigger", [
    "NEW_LEAD", "STATUS_CHANGED", "LEAD_ASSIGNED",
    "PROPERTY_ENQUIRY", "BROCHURE_DOWNLOAD", "BUYER_REQUIREMENT_SUBMITTED",
    "NO_ACTIVITY"
  ]).notNull(),
  conditions: json("conditions"),
  actions: json("actions").$type<Array<{
    type: string;
    config: Record<string, unknown>;
  }>>(),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Automation = typeof automations.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 15. BLOG POSTS
// ─────────────────────────────────────────────────────────────────────────────

export const blogPosts = mysqlTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content"),
  coverImage: text("coverImage"),
  category: varchar("category", { length: 100 }),
  tags: json("tags").$type<string[]>(),
  authorId: bigint("authorId", { mode: "number", unsigned: true }),
  seoTitle: varchar("seoTitle", { length: 100 }),
  seoDescription: varchar("seoDescription", { length: 200 }),
  isPublished: boolean("isPublished").default(false),
  publishedAt: timestamp("publishedAt"),
  views: int("views").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type BlogPost = typeof blogPosts.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 16. TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────

export const testimonials = mysqlTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 100 }),
  company: varchar("company", { length: 255 }),
  content: text("content").notNull(),
  rating: int("rating").default(5),
  avatar: text("avatar"),
  isActive: boolean("isActive").default(true),
  order: int("order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;

// ─────────────────────────────────────────────────────────────────────────────
// 17. TEAM MEMBERS / AGENTS
// ─────────────────────────────────────────────────────────────────────────────

export const teamMembers = mysqlTable("team_members", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 100 }).notNull(),
  bio: text("bio"),
  photo: text("photo"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  whatsapp: varchar("whatsapp", { length: 20 }),
  isFeatured: boolean("isFeatured").default(false),
  isActive: boolean("isActive").default(true),
  order: int("order").default(0),
  socialLinks: json("socialLinks").$type<Record<string, string>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type TeamMember = typeof teamMembers.$inferSelect;
