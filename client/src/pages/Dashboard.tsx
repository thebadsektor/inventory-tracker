import { useState } from "react";
import { Link } from "wouter";
import { ScanLine, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { StatsCards } from "@/components/StatsCards";
import { InventoryTable, type InventoryItem } from "@/components/InventoryTable";
import { SearchFilter } from "@/components/SearchFilter";
import { ScanHistory, type ScanLogEntry } from "@/components/ScanHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "in" | "out">("all");
  const [category, setCategory] = useState("all");

  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalItems: number;
    checkedIn: number;
    checkedOut: number;
    recentScans: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const { data: items = [], isLoading: itemsLoading } = useQuery<InventoryItem[]>({
    queryKey: ["/api/items", { search, status, category }],
  });

  const { data: logs = [], isLoading: logsLoading } = useQuery<ScanLogEntry[]>({
    queryKey: ["/api/logs"],
    select: (data) =>
      data.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp),
      })),
  });

  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ["/api/categories"],
  });

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

      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <StatsCards
          totalItems={stats?.totalItems ?? 0}
          checkedIn={stats?.checkedIn ?? 0}
          checkedOut={stats?.checkedOut ?? 0}
          recentScans={stats?.recentScans ?? 0}
        />
      )}

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
          {itemsLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <InventoryTable items={filteredItems.slice(0, 5)} />
          )}
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
            {logsLoading ? (
              <Skeleton className="h-48" />
            ) : (
              <ScanHistory logs={logs.slice(0, 5)} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
