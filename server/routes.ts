import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertItemSchema, insertScanLogSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/items", async (req, res) => {
    try {
      const { search, status, category } = req.query;
      const items = await storage.searchItems(
        (search as string) || "",
        (status as "all" | "in" | "out") || "all",
        (category as string) || "all"
      );
      res.json(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  app.get("/api/items/:id", async (req, res) => {
    try {
      const item = await storage.getItemById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching item:", error);
      res.status(500).json({ error: "Failed to fetch item" });
    }
  });

  app.get("/api/items/barcode/:barcode", async (req, res) => {
    try {
      const item = await storage.getItemByBarcode(req.params.barcode);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching item:", error);
      res.status(500).json({ error: "Failed to fetch item" });
    }
  });

  app.post("/api/items", async (req, res) => {
    try {
      const validatedData = insertItemSchema.parse(req.body);
      const existing = await storage.getItemByBarcode(validatedData.barcode);
      if (existing) {
        return res.status(409).json({ error: "Barcode already exists" });
      }
      const item = await storage.createItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating item:", error);
      res.status(500).json({ error: "Failed to create item" });
    }
  });

  app.patch("/api/items/:id", async (req, res) => {
    try {
      const updateSchema = insertItemSchema.partial();
      const validatedData = updateSchema.parse(req.body);
      const item = await storage.updateItem(req.params.id, validatedData);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating item:", error);
      res.status(500).json({ error: "Failed to update item" });
    }
  });

  app.delete("/api/items/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ error: "Failed to delete item" });
    }
  });

  app.post("/api/scan", async (req, res) => {
    try {
      const { barcode } = req.body;
      if (!barcode || typeof barcode !== "string") {
        return res.status(400).json({ error: "Barcode is required" });
      }

      const item = await storage.getItemByBarcode(barcode);
      
      if (!item) {
        return res.json({
          barcode,
          itemName: null,
          action: "not_found",
          item: null,
        });
      }

      const newStatus = !item.checkedIn;
      await storage.updateItem(item.id, { checkedIn: newStatus });
      
      const action = newStatus ? "checked_in" : "checked_out";
      await storage.createScanLog({
        barcode,
        itemName: item.name,
        action,
      });

      const updatedItem = await storage.getItemById(item.id);

      res.json({
        barcode,
        itemName: item.name,
        action,
        item: updatedItem,
      });
    } catch (error) {
      console.error("Error processing scan:", error);
      res.status(500).json({ error: "Failed to process scan" });
    }
  });

  app.post("/api/items/bulk", async (req, res) => {
    try {
      const items = req.body;
      if (!Array.isArray(items)) {
        return res.status(400).json({ error: "Expected array of items" });
      }

      const validatedItems = items.map((item) => insertItemSchema.parse(item));
      const createdItems = await storage.bulkCreateItems(validatedItems);
      res.status(201).json(createdItems);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error bulk creating items:", error);
      res.status(500).json({ error: "Failed to bulk create items" });
    }
  });

  app.get("/api/logs", async (req, res) => {
    try {
      const logs = await storage.getAllScanLogs();
      res.json(logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const items = await storage.getAllItems();
      const logs = await storage.getAllScanLogs();
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayScans = logs.filter((log) => new Date(log.timestamp) >= today).length;

      res.json({
        totalItems: items.length,
        checkedIn: items.filter((i) => i.checkedIn).length,
        checkedOut: items.filter((i) => !i.checkedIn).length,
        recentScans: todayScans,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const items = await storage.getAllItems();
      const categories = Array.from(new Set(items.map((i) => i.category)));
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/export/items", async (req, res) => {
    try {
      const { status } = req.query;
      let items = await storage.getAllItems();
      
      if (status === "out") {
        items = items.filter((i) => !i.checkedIn);
      }

      const csv = [
        "barcode,name,category,description,status",
        ...items.map((i) => 
          `"${i.barcode}","${i.name}","${i.category}","${i.description || ""}","${i.checkedIn ? "in" : "out"}"`
        ),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="inventory_${Date.now()}.csv"`);
      res.send(csv);
    } catch (error) {
      console.error("Error exporting items:", error);
      res.status(500).json({ error: "Failed to export items" });
    }
  });

  app.get("/api/export/logs", async (req, res) => {
    try {
      const logs = await storage.getAllScanLogs();

      const csv = [
        "barcode,item_name,action,timestamp",
        ...logs.map((l) => 
          `"${l.barcode}","${l.itemName || ""}","${l.action}","${l.timestamp}"`
        ),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="scan_history_${Date.now()}.csv"`);
      res.send(csv);
    } catch (error) {
      console.error("Error exporting logs:", error);
      res.status(500).json({ error: "Failed to export logs" });
    }
  });

  return httpServer;
}
