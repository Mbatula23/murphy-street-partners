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

type MemoryDeal = InsertDeal & { id: number; createdAt?: Date; updatedAt?: Date };
type MemoryScenario = InsertScenario & { id: number; createdAt?: Date; updatedAt?: Date };

const memoryDb = {
  deals: [] as MemoryDeal[],
  scenarios: [] as MemoryScenario[],
};

function applyDealDefaults(deal: InsertDeal, id: number): MemoryDeal {
  const timestamp = new Date();
  return {
    id,
    status: "monitoring",
    conviction: "medium",
    priority: 3,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...deal,
  };
}

function applyScenarioDefaults(scenario: InsertScenario, id: number): MemoryScenario {
  const timestamp = new Date();
  return {
    id,
    exitYear: 5,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...scenario,
  };
}

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
  if (!db) {
    const newDeal = applyDealDefaults(deal, memoryDb.deals.length + 1);
    memoryDb.deals.push(newDeal);
    return newDeal;
  }

  const result = await db.insert(deals).values(deal);
  const insertId = (result as { insertId?: number }).insertId;
  if (insertId) {
    const [inserted] = await db.select().from(deals).where(eq(deals.id, insertId)).limit(1);
    if (inserted) return inserted;
  }
  return applyDealDefaults(deal, insertId ?? memoryDb.deals.length + 1);
}

export async function getUserDeals(userId: number) {
  const db = await getDb();
  if (!db) {
    return memoryDb.deals
      .filter(deal => deal.userId === userId)
      .sort((a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0));
  }

  return await db
    .select()
    .from(deals)
    .where(eq(deals.userId, userId))
    .orderBy(desc(deals.updatedAt));
}

export async function getDealById(dealId: number, userId: number) {
  const db = await getDb();
  if (!db) {
    const deal = memoryDb.deals.find(d => d.id === dealId && d.userId === userId);
    return deal ?? null;
  }

  const result = await db
    .select()
    .from(deals)
    .where(and(eq(deals.id, dealId), eq(deals.userId, userId)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateDeal(dealId: number, userId: number, updates: Partial<InsertDeal>) {
  const db = await getDb();
  if (!db) {
    const dealIndex = memoryDb.deals.findIndex(d => d.id === dealId && d.userId === userId);
    if (dealIndex === -1) throw new Error("Deal not found");

    const updatedDeal = {
      ...memoryDb.deals[dealIndex],
      ...updates,
      updatedAt: new Date(),
    };
    memoryDb.deals[dealIndex] = updatedDeal;
    return updatedDeal;
  }

  await db
    .update(deals)
    .set(updates)
    .where(and(eq(deals.id, dealId), eq(deals.userId, userId)));

  return await getDealById(dealId, userId);
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
  if (!db) {
    const newScenario = applyScenarioDefaults(scenario, memoryDb.scenarios.length + 1);
    memoryDb.scenarios.push(newScenario);
    return newScenario;
  }

  const result = await db.insert(scenarios).values(scenario);
  const insertId = (result as { insertId?: number }).insertId;
  if (insertId) {
    const [inserted] = await db.select().from(scenarios).where(eq(scenarios.id, insertId)).limit(1);
    if (inserted) return inserted;
  }
  return applyScenarioDefaults(scenario, insertId ?? memoryDb.scenarios.length + 1);
}

export async function getDealScenarios(dealId: number, userId: number) {
  const db = await getDb();
  if (!db) {
    return memoryDb.scenarios
      .filter(s => s.dealId === dealId && s.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }

  return await db
    .select()
    .from(scenarios)
    .where(and(eq(scenarios.dealId, dealId), eq(scenarios.userId, userId)))
    .orderBy(desc(scenarios.createdAt));
}

export async function updateScenario(scenarioId: number, userId: number, updates: Partial<InsertScenario>) {
  const db = await getDb();
  if (!db) {
    const scenarioIndex = memoryDb.scenarios.findIndex(s => s.id === scenarioId && s.userId === userId);
    if (scenarioIndex === -1) throw new Error("Scenario not found");

    const updatedScenario = {
      ...memoryDb.scenarios[scenarioIndex],
      ...updates,
      updatedAt: new Date(),
    };
    memoryDb.scenarios[scenarioIndex] = updatedScenario;
    return updatedScenario;
  }

  await db
    .update(scenarios)
    .set(updates)
    .where(and(eq(scenarios.id, scenarioId), eq(scenarios.userId, userId)));

  const [updated] = await db
    .select()
    .from(scenarios)
    .where(and(eq(scenarios.id, scenarioId), eq(scenarios.userId, userId)))
    .limit(1);

  return updated ?? null;
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
