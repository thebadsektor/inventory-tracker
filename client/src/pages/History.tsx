import { useState } from "react";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ScanHistory, type ScanLogEntry } from "@/components/ScanHistory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function History() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<"all" | "checked_in" | "checked_out" | "registered">("all");

  const { data: logs = [], isLoading } = useQuery<ScanLogEntry[]>({
    queryKey: ["/api/logs"],
    select: (data) =>
      data.map((log: any) => ({
        ...log,
        timestamp: new Date(log.timestamp),
      })),
  });

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.barcode.toLowerCase().includes(search.toLowerCase()) ||
      (log.itemName?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const handleExport = () => {
    window.location.href = "/api/export/logs";
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Scan History</h1>
          <p className="text-sm text-muted-foreground">
            {logs.length} total scans recorded
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} data-testid="button-export-history">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by barcode or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-history-search"
          />
        </div>
        <Select value={actionFilter} onValueChange={(v) => setActionFilter(v as typeof actionFilter)}>
          <SelectTrigger className="w-40" data-testid="select-action-filter">
            <SelectValue placeholder="Filter action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="checked_in">Checked In</SelectItem>
            <SelectItem value="checked_out">Checked Out</SelectItem>
            <SelectItem value="registered">Registered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : (
        <ScanHistory logs={filteredLogs} />
      )}
    </div>
  );
}
