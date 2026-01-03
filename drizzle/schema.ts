import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Deals/Assets pipeline
 * Tracks every club or sports property we're monitoring or pursuing
 */
export const deals = mysqlTable("deals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Owner of this deal record
  
  // Basic Info
  name: varchar("name", { length: 255 }).notNull(), // Club/asset name
  league: varchar("league", { length: 255 }), // Premier League, La Liga, etc.
  country: varchar("country", { length: 100 }),
  sport: varchar("sport", { length: 100 }).default("football").notNull(),
  
  // Deal Status
  status: mysqlEnum("status", [
    "monitoring",
    "warm",
    "active",
    "offer_stage",
    "due_diligence",
    "closed_won",
    "closed_lost",
    "on_hold"
  ]).default("monitoring").notNull(),
  
  // Conviction & Priority
  conviction: mysqlEnum("conviction", ["low", "medium", "high", "very_high"]).default("medium"),
  priority: int("priority").default(3), // 1-5, 5 being highest
  
  // Financial Metrics (in millions EUR)
  currentValuation: text("currentValuation"),
  revenue: text("revenue"),
  ebitda: text("ebitda"),
  debt: text("debt"),
  
  // Ownership
  currentOwner: text("currentOwner"),
  ownershipStructure: text("ownershipStructure"), // Description
  minorityStakeAvailable: int("minorityStakeAvailable").default(0), // 0 or 1 (boolean)
  targetStakePercentage: text("targetStakePercentage"), // "15.00" = 15%
  
  // Key Dates
  mediaRightsExpiry: timestamp("mediaRightsExpiry"),
  lastContactDate: timestamp("lastContactDate"),
  nextFollowUpDate: timestamp("nextFollowUpDate"),
  
  // Notes & Intelligence
  investmentThesis: text("investmentThesis"),
  keyRisks: text("keyRisks"),
  valueCreationOpportunities: text("valueCreationOpportunities"),
  privateNotes: text("privateNotes"),
  
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = typeof deals.$inferInsert;

/**
 * Contacts/Relationships
 * Track everyone in your network relevant to deal sourcing
 */
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Basic Info
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }),
  organization: varchar("organization", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  linkedinUrl: varchar("linkedinUrl", { length: 500 }),
  
  // Relationship Context
  relationshipType: mysqlEnum("relationshipType", [
    "owner",
    "executive",
    "advisor",
    "banker",
    "lawyer",
    "agent",
    "other"
  ]),
  relationshipStrength: mysqlEnum("relationshipStrength", ["weak", "moderate", "strong", "very_strong"]).default("moderate"),
  
  // Relevance
  relevantToDeals: text("relevantToDeals"), // Comma-separated deal IDs or names
  expertise: text("expertise"), // Areas of expertise
  notes: text("notes"),
  
  // Interaction Tracking
  lastContactDate: timestamp("lastContactDate"),
  nextFollowUpDate: timestamp("nextFollowUpDate"),
  
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

/**
 * Activity Log
 * Track all interactions, meetings, emails, calls related to deals and contacts
 */
export const activities = mysqlTable("activities", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Related Entities
  dealId: int("dealId"), // Optional: related deal
  contactId: int("contactId"), // Optional: related contact
  
  // Activity Details
  type: mysqlEnum("type", [
    "meeting",
    "call",
    "email",
    "note",
    "research",
    "other"
  ]).notNull(),
  subject: varchar("subject", { length: 500 }),
  description: text("description"),
  outcome: text("outcome"),
  
  // Timing
  activityDate: timestamp("activityDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

/**
 * Deal Scenarios
 * Store financial modeling scenarios for each deal
 */
export const scenarios = mysqlTable("scenarios", {
  id: int("id").autoincrement().primaryKey(),
  dealId: int("dealId").notNull(),
  userId: int("userId").notNull(),
  
  // Scenario Info
  name: varchar("name", { length: 255 }).notNull(), // "Base Case", "Bull Case", etc.
  description: text("description"),
  
  // Entry Assumptions (stored as text for precision)
  entryValuation: text("entryValuation").notNull(),
  entryMultiple: text("entryMultiple"), // "10.5" = 10.5x EBITDA
  stakePercentage: text("stakePercentage").notNull(), // "15.00" = 15%
  investmentAmount: text("investmentAmount").notNull(),
  debtPercentage: text("debtPercentage"), // "30.00" = 30% debt financing, default "0"
  
  // Operational Assumptions (annual %)
  revenueGrowthRate: text("revenueGrowthRate"), // "5" = 5% annual, default "5"
  ebitdaMarginImprovement: text("ebitdaMarginImprovement"), // "2.00" = +200bps, default "0"
  
  // Exit Assumptions
  exitYear: int("exitYear").default(5), // Years from entry
  exitMultiple: text("exitMultiple"), // "12.0" = 12.0x EBITDA
  exitValuation: text("exitValuation"),
  
  // Calculated Returns
  irr: text("irr"), // "18.50" = 18.5%
  moic: text("moic"), // "2.50" = 2.5x
  cashOnCashReturn: text("cashOnCashReturn"),
  
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Scenario = typeof scenarios.$inferSelect;
export type InsertScenario = typeof scenarios.$inferInsert;

/**
 * Market Intelligence
 * Store external data points, news, and intelligence about clubs/markets
 */
export const intelligence = mysqlTable("intelligence", {
  id: int("id").autoincrement().primaryKey(),
  dealId: int("dealId"), // Optional: related to specific deal
  userId: int("userId").notNull(),
  
  // Intelligence Details
  type: mysqlEnum("type", [
    "financial_data",
    "news",
    "ownership_change",
    "management_change",
    "media_rights",
    "sponsorship",
    "transfer_activity",
    "other"
  ]).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content"),
  sourceUrl: varchar("sourceUrl", { length: 1000 }),
  sourceType: varchar("sourceType", { length: 100 }), // "Bloomberg", "Deloitte Report", etc.
  
  // Relevance
  relevance: mysqlEnum("relevance", ["low", "medium", "high"]).default("medium"),
  
  // Timing
  intelligenceDate: timestamp("intelligenceDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Intelligence = typeof intelligence.$inferSelect;
export type InsertIntelligence = typeof intelligence.$inferInsert;