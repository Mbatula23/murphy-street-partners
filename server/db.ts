import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  deals,
  contacts,
  activities,
  scenarios,
  intelligence,
  InsertDeal,
  InsertContact,
  InsertActivity,
  InsertScenario,
  InsertIntelligence,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && ENV.databaseUrl) {
    try {
      _db = drizzle(ENV.databaseUrl);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== DEALS =====

export async function createDeal(deal: InsertDeal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(deals).values(deal);
  return result;
}

export async function getUserDeals(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(deals)
    .where(eq(deals.userId, userId))
    .orderBy(desc(deals.updatedAt));
}

export async function getDealById(dealId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db
    .select()
    .from(deals)
    .where(and(eq(deals.id, dealId), eq(deals.userId, userId)))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function updateDeal(dealId: number, userId: number, updates: Partial<InsertDeal>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .update(deals)
    .set(updates)
    .where(and(eq(deals.id, dealId), eq(deals.userId, userId)));
}

export async function deleteDeal(dealId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .delete(deals)
    .where(and(eq(deals.id, dealId), eq(deals.userId, userId)));
}

// ===== CONTACTS =====

export async function createContact(contact: InsertContact) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(contacts).values(contact);
}

export async function getUserContacts(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(contacts)
    .where(eq(contacts.userId, userId))
    .orderBy(desc(contacts.updatedAt));
}

export async function getContactById(contactId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db
    .select()
    .from(contacts)
    .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function updateContact(contactId: number, userId: number, updates: Partial<InsertContact>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .update(contacts)
    .set(updates)
    .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)));
}

export async function deleteContact(contactId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .delete(contacts)
    .where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)));
}

// ===== ACTIVITIES =====

export async function createActivity(activity: InsertActivity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(activities).values(activity);
}

export async function getUserActivities(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(activities)
    .where(eq(activities.userId, userId))
    .orderBy(desc(activities.activityDate))
    .limit(limit);
}

export async function getDealActivities(dealId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(activities)
    .where(and(eq(activities.dealId, dealId), eq(activities.userId, userId)))
    .orderBy(desc(activities.activityDate));
}

// ===== SCENARIOS =====

export async function createScenario(scenario: InsertScenario) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(scenarios).values(scenario);
}

export async function getDealScenarios(dealId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(scenarios)
    .where(and(eq(scenarios.dealId, dealId), eq(scenarios.userId, userId)))
    .orderBy(desc(scenarios.createdAt));
}

export async function updateScenario(scenarioId: number, userId: number, updates: Partial<InsertScenario>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .update(scenarios)
    .set(updates)
    .where(and(eq(scenarios.id, scenarioId), eq(scenarios.userId, userId)));
}

export async function deleteScenario(scenarioId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .delete(scenarios)
    .where(and(eq(scenarios.id, scenarioId), eq(scenarios.userId, userId)));
}

// ===== INTELLIGENCE =====

export async function createIntelligence(intel: InsertIntelligence) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(intelligence).values(intel);
}

export async function getUserIntelligence(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(intelligence)
    .where(eq(intelligence.userId, userId))
    .orderBy(desc(intelligence.intelligenceDate))
    .limit(limit);
}

export async function getDealIntelligence(dealId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(intelligence)
    .where(and(eq(intelligence.dealId, dealId), eq(intelligence.userId, userId)))
    .orderBy(desc(intelligence.intelligenceDate));
}
