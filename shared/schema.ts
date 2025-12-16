import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const inventoryItems = pgTable("inventory_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  barcode: text("barcode").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").default(""),
  checkedIn: boolean("checked_in").notNull().default(true),
});

export const insertItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
});

export type InsertItem = z.infer<typeof insertItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

export const scanLogs = pgTable("scan_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  barcode: text("barcode").notNull(),
  itemName: text("item_name"),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertScanLogSchema = createInsertSchema(scanLogs).omit({
  id: true,
  timestamp: true,
});

export type InsertScanLog = z.infer<typeof insertScanLogSchema>;
export type ScanLog = typeof scanLogs.$inferSelect;
