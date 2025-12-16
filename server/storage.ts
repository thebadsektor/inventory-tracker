import { eq, desc, ilike, or, and, sql } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  inventoryItems,
  scanLogs,
  type User,
  type InsertUser,
  type InventoryItem,
  type InsertItem,
  type ScanLog,
  type InsertScanLog,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAllItems(): Promise<InventoryItem[]>;
  getItemById(id: string): Promise<InventoryItem | undefined>;
  getItemByBarcode(barcode: string): Promise<InventoryItem | undefined>;
  createItem(item: InsertItem): Promise<InventoryItem>;
  updateItem(id: string, item: Partial<InsertItem>): Promise<InventoryItem | undefined>;
  deleteItem(id: string): Promise<boolean>;
  searchItems(query: string, status?: "all" | "in" | "out", category?: string): Promise<InventoryItem[]>;
  bulkCreateItems(items: InsertItem[]): Promise<InventoryItem[]>;

  getAllScanLogs(): Promise<ScanLog[]>;
  createScanLog(log: InsertScanLog): Promise<ScanLog>;
  getScanLogsByBarcode(barcode: string): Promise<ScanLog[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllItems(): Promise<InventoryItem[]> {
    return db.select().from(inventoryItems).orderBy(inventoryItems.name);
  }

  async getItemById(id: string): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id));
    return item;
  }

  async getItemByBarcode(barcode: string): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.barcode, barcode));
    return item;
  }

  async createItem(item: InsertItem): Promise<InventoryItem> {
    const [newItem] = await db.insert(inventoryItems).values(item).returning();
    return newItem;
  }

  async updateItem(id: string, item: Partial<InsertItem>): Promise<InventoryItem | undefined> {
    const [updated] = await db
      .update(inventoryItems)
      .set(item)
      .where(eq(inventoryItems.id, id))
      .returning();
    return updated;
  }

  async deleteItem(id: string): Promise<boolean> {
    const result = await db.delete(inventoryItems).where(eq(inventoryItems.id, id)).returning();
    return result.length > 0;
  }

  async searchItems(
    query: string,
    status?: "all" | "in" | "out",
    category?: string
  ): Promise<InventoryItem[]> {
    let conditions = [];

    if (query) {
      conditions.push(
        or(
          ilike(inventoryItems.barcode, `%${query}%`),
          ilike(inventoryItems.name, `%${query}%`)
        )
      );
    }

    if (status === "in") {
      conditions.push(eq(inventoryItems.checkedIn, true));
    } else if (status === "out") {
      conditions.push(eq(inventoryItems.checkedIn, false));
    }

    if (category && category !== "all") {
      conditions.push(eq(inventoryItems.category, category));
    }

    if (conditions.length === 0) {
      return this.getAllItems();
    }

    return db
      .select()
      .from(inventoryItems)
      .where(and(...conditions))
      .orderBy(inventoryItems.name);
  }

  async bulkCreateItems(items: InsertItem[]): Promise<InventoryItem[]> {
    if (items.length === 0) return [];
    return db.insert(inventoryItems).values(items).returning();
  }

  async getAllScanLogs(): Promise<ScanLog[]> {
    return db.select().from(scanLogs).orderBy(desc(scanLogs.timestamp));
  }

  async createScanLog(log: InsertScanLog): Promise<ScanLog> {
    const [newLog] = await db.insert(scanLogs).values(log).returning();
    return newLog;
  }

  async getScanLogsByBarcode(barcode: string): Promise<ScanLog[]> {
    return db
      .select()
      .from(scanLogs)
      .where(eq(scanLogs.barcode, barcode))
      .orderBy(desc(scanLogs.timestamp));
  }
}

export const storage = new DatabaseStorage();
