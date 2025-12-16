import { useState } from "react";
import { Link } from "wouter";
import { ScanLine, ArrowRight } from "lucide-react";
import { StatsCards } from "@/components/StatsCards";
import { InventoryTable, type InventoryItem } from "@/components/InventoryTable";
import { SearchFilter } from "@/components/SearchFilter";
import { ScanHistory, type ScanLogEntry } from "@/components/ScanHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// todo: remove mock functionality
const mockItems: InventoryItem[] = [
  { id: "1", barcode: "123456789", name: "Dell Monitor 24\"", category: "Electronics", description: "", checkedIn: true },
  { id: "2", barcode: "987654321", name: "Wireless Keyboard", category: "Electronics", description: "", checkedIn: false },
  { id: "3", barcode: "456789123", name: "Standing Desk", category: "Furniture", description: "", checkedIn: true },
  { id: "4", barcode: "789123456", name: "Cordless Drill", category: "Tools", description: "", checkedIn: false },
  { id: "5", barcode: "321654987", name: "Stapler Set", category: "Office Supplies", description: "", checkedIn: true },
];

const mockLogs: ScanLogEntry[] = [
  { id: "1", barcode: "123456789", itemName: "Dell Monitor 24\"", action: "checked_out", timestamp: new Date() },
  { id: "2", barcode: "987654321", itemName: "Wireless Keyboard", action: "checked_in", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { id: "3", barcode: "456789123", itemName: "Standing Desk", action: "registered", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
];

export default function Dashboard() {
  const [items] = useState<InventoryItem[]>(mockItems);
  const [logs] = useState<ScanLogEntry[]>(mockLogs);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "in" | "out">("all");
  const [category, setCategory] = useState("all");

  const categories = Array.from(new Set(items.map((i) => i.category)));
  const checkedInCount = items.filter((i) => i.checkedIn).length;
  const checkedOutCount = items.filter((i) => !i.checkedIn).length;

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.barcode.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      status === "all" ||
      (status === "in" && item.checkedIn) ||
      (status === "out" && !item.checkedIn);
    const matchesCategory = category === "all" || item.category === category;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your inventory status
          </p>
        </div>
        <Button asChild>
          <Link href="/scan" data-testid="button-go-to-scan">
            <ScanLine className="h-4 w-4 mr-2" />
            Start Scanning
          </Link>
        </Button>
      </div>

      <StatsCards
        totalItems={items.length}
        checkedIn={checkedInCount}
        checkedOut={checkedOutCount}
        recentScans={logs.length}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-lg font-semibold">Inventory</h2>
            <Button variant="outline" asChild size="sm">
              <Link href="/inventory" data-testid="link-view-all-inventory">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
          <SearchFilter
            searchQuery={search}
            onSearchChange={setSearch}
            statusFilter={status}
            onStatusChange={setStatus}
            categoryFilter={category}
            onCategoryChange={setCategory}
            categories={categories}
          />
          <InventoryTable items={filteredItems.slice(0, 5)} />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/history" data-testid="link-view-all-history">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ScanHistory logs={logs.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
