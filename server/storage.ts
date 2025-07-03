import { 
  users, 
  contacts, 
  deals, 
  tasks, 
  businessAnalysis,
  contentItems,
  voiceProfiles,
  type User, 
  type InsertUser,
  type Contact,
  type InsertContact,
  type Deal,
  type InsertDeal,
  type Task,
  type InsertTask,
  type BusinessAnalysis,
  type InsertBusinessAnalysis,
  type ContentItem,
  type InsertContentItem,
  type VoiceProfile,
  type InsertVoiceProfile
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: string): Promise<void>;

  // Contact methods
  getContacts(userId: string): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: string, contact: Partial<InsertContact>): Promise<Contact>;
  deleteContact(id: string): Promise<void>;

  // Deal methods
  getDeals(userId: string): Promise<Deal[]>;
  getDeal(id: string): Promise<Deal | undefined>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: string, deal: Partial<InsertDeal>): Promise<Deal>;
  deleteDeal(id: string): Promise<void>;

  // Task methods
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<Task>;
  deleteTask(id: string): Promise<void>;

  // Business Analysis methods
  getBusinessAnalyses(userId: string): Promise<BusinessAnalysis[]>;
  getBusinessAnalysis(id: string): Promise<BusinessAnalysis | undefined>;
  createBusinessAnalysis(analysis: InsertBusinessAnalysis): Promise<BusinessAnalysis>;
  updateBusinessAnalysis(id: string, analysis: Partial<InsertBusinessAnalysis>): Promise<BusinessAnalysis>;
  deleteBusinessAnalysis(id: string): Promise<void>;

  // Content Item methods
  getContentItems(userId: string): Promise<ContentItem[]>;
  getContentItem(id: string): Promise<ContentItem | undefined>;
  createContentItem(item: InsertContentItem): Promise<ContentItem>;
  updateContentItem(id: string, item: Partial<InsertContentItem>): Promise<ContentItem>;
  deleteContentItem(id: string): Promise<void>;

  // Voice Profile methods
  getVoiceProfiles(userId: string): Promise<VoiceProfile[]>;
  getVoiceProfile(id: string): Promise<VoiceProfile | undefined>;
  createVoiceProfile(profile: InsertVoiceProfile): Promise<VoiceProfile>;
  updateVoiceProfile(id: string, profile: Partial<InsertVoiceProfile>): Promise<VoiceProfile>;
  deleteVoiceProfile(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User> {
    const result = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return result[0];
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Contact methods
  async getContacts(userId: string): Promise<Contact[]> {
    return await db.select().from(contacts).where(eq(contacts.userId, userId));
  }

  async getContact(id: string): Promise<Contact | undefined> {
    const result = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
    return result[0];
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const result = await db.insert(contacts).values(contact).returning();
    return result[0];
  }

  async updateContact(id: string, contact: Partial<InsertContact>): Promise<Contact> {
    const result = await db.update(contacts).set(contact).where(eq(contacts.id, id)).returning();
    return result[0];
  }

  async deleteContact(id: string): Promise<void> {
    await db.delete(contacts).where(eq(contacts.id, id));
  }

  // Deal methods
  async getDeals(userId: string): Promise<Deal[]> {
    return await db.select().from(deals).where(eq(deals.userId, userId));
  }

  async getDeal(id: string): Promise<Deal | undefined> {
    const result = await db.select().from(deals).where(eq(deals.id, id)).limit(1);
    return result[0];
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    const result = await db.insert(deals).values(deal).returning();
    return result[0];
  }

  async updateDeal(id: string, deal: Partial<InsertDeal>): Promise<Deal> {
    const result = await db.update(deals).set(deal).where(eq(deals.id, id)).returning();
    return result[0];
  }

  async deleteDeal(id: string): Promise<void> {
    await db.delete(deals).where(eq(deals.id, id));
  }

  // Task methods
  async getTasks(userId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async getTask(id: string): Promise<Task | undefined> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    return result[0];
  }

  async createTask(task: InsertTask): Promise<Task> {
    const result = await db.insert(tasks).values(task).returning();
    return result[0];
  }

  async updateTask(id: string, task: Partial<InsertTask>): Promise<Task> {
    const result = await db.update(tasks).set(task).where(eq(tasks.id, id)).returning();
    return result[0];
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // Business Analysis methods
  async getBusinessAnalyses(userId: string): Promise<BusinessAnalysis[]> {
    return await db.select().from(businessAnalysis).where(eq(businessAnalysis.userId, userId));
  }

  async getBusinessAnalysis(id: string): Promise<BusinessAnalysis | undefined> {
    const result = await db.select().from(businessAnalysis).where(eq(businessAnalysis.id, id)).limit(1);
    return result[0];
  }

  async createBusinessAnalysis(analysis: InsertBusinessAnalysis): Promise<BusinessAnalysis> {
    const result = await db.insert(businessAnalysis).values(analysis).returning();
    return result[0];
  }

  async updateBusinessAnalysis(id: string, analysis: Partial<InsertBusinessAnalysis>): Promise<BusinessAnalysis> {
    const result = await db.update(businessAnalysis).set(analysis).where(eq(businessAnalysis.id, id)).returning();
    return result[0];
  }

  async deleteBusinessAnalysis(id: string): Promise<void> {
    await db.delete(businessAnalysis).where(eq(businessAnalysis.id, id));
  }

  // Content Item methods
  async getContentItems(userId: string): Promise<ContentItem[]> {
    return await db.select().from(contentItems).where(eq(contentItems.userId, userId));
  }

  async getContentItem(id: string): Promise<ContentItem | undefined> {
    const result = await db.select().from(contentItems).where(eq(contentItems.id, id)).limit(1);
    return result[0];
  }

  async createContentItem(item: InsertContentItem): Promise<ContentItem> {
    const result = await db.insert(contentItems).values(item).returning();
    return result[0];
  }

  async updateContentItem(id: string, item: Partial<InsertContentItem>): Promise<ContentItem> {
    const result = await db.update(contentItems).set(item).where(eq(contentItems.id, id)).returning();
    return result[0];
  }

  async deleteContentItem(id: string): Promise<void> {
    await db.delete(contentItems).where(eq(contentItems.id, id));
  }

  // Voice Profile methods
  async getVoiceProfiles(userId: string): Promise<VoiceProfile[]> {
    return await db.select().from(voiceProfiles).where(eq(voiceProfiles.userId, userId));
  }

  async getVoiceProfile(id: string): Promise<VoiceProfile | undefined> {
    const result = await db.select().from(voiceProfiles).where(eq(voiceProfiles.id, id)).limit(1);
    return result[0];
  }

  async createVoiceProfile(profile: InsertVoiceProfile): Promise<VoiceProfile> {
    const result = await db.insert(voiceProfiles).values(profile).returning();
    return result[0];
  }

  async updateVoiceProfile(id: string, profile: Partial<InsertVoiceProfile>): Promise<VoiceProfile> {
    const result = await db.update(voiceProfiles).set(profile).where(eq(voiceProfiles.id, id)).returning();
    return result[0];
  }

  async deleteVoiceProfile(id: string): Promise<void> {
    await db.delete(voiceProfiles).where(eq(voiceProfiles.id, id));
  }
}

export const storage = new DatabaseStorage();
