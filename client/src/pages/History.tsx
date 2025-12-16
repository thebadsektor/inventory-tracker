import { useState } from "react";
import { Download } from "lucide-react";
import { ScanHistory, type ScanLogEntry } from "@/components/ScanHistory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// todo: remove mock functionality
const mockLogs: ScanLogEntry[] = [
  { id: "1", barcode: "123456789", itemName: "Dell Monitor 24\"", action: "checked_out", timestamp: new Date() },
  { id: "2", barcode: "987654321", itemName: "Wireless Keyboard", action: "checked_in", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { id: "3", barcode: "456789123", itemName: "Standing Desk", action: "registered", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: "4", barcode: "789123456", itemName: "Cordless Drill", action: "checked_out", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { id: "5", barcode: "321654987", itemName: "Stapler Set", action: "checked_in", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: "6", barcode: "654987321", itemName: "Ergonomic Chair", action: "checked_out", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: "7", barcode: "147258369", itemName: "USB Hub 7-Port", action: "registered", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
  { id: "8", barcode: "369258147", itemName: "Whiteboard Markers", action: "checked_in", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) },
];

export default function History() {
  const [logs] = useState<ScanLogEntry[]>(mockLogs);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<"all" | "checked_in" | "checked_out" | "registered">("all");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.barcode.toLowerCase().includes(search.toLowerCase()) ||
      (log.itemName?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const handleExport = () => {
    console.log("Exporting history...");
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

      <ScanHistory logs={filteredLogs} />
    </div>
  );
}
