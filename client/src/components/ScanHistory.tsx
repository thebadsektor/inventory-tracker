import { CheckCircle2, ArrowRightLeft, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface ScanLogEntry {
  id: string;
  barcode: string;
  itemName: string | null;
  action: "checked_in" | "checked_out" | "registered";
  timestamp: Date;
}

interface ScanHistoryProps {
  logs: ScanLogEntry[];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function groupByDate(logs: ScanLogEntry[]): Map<string, ScanLogEntry[]> {
  const groups = new Map<string, ScanLogEntry[]>();
  logs.forEach((log) => {
    const dateKey = log.timestamp.toDateString();
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(log);
  });
  return groups;
}

export function ScanHistory({ logs }: ScanHistoryProps) {
  const groupedLogs = groupByDate(logs);

  if (logs.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        No scan history yet. Start scanning to see activity here.
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Array.from(groupedLogs.entries()).map(([dateKey, dayLogs]) => (
        <div key={dateKey}>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
            {formatDate(dayLogs[0].timestamp)}
          </h3>
          <div className="border-l-2 border-border pl-6 space-y-4">
            {dayLogs.map((log) => (
              <div key={log.id} className="relative py-2" data-testid={`log-entry-${log.id}`}>
                <div className="absolute -left-[25px] top-3 h-3 w-3 rounded-full bg-border" />
                <div className="flex flex-wrap items-center gap-2">
                  {log.action === "checked_in" && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Checked In
                    </Badge>
                  )}
                  {log.action === "checked_out" && (
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 gap-1">
                      <ArrowRightLeft className="h-3 w-3" />
                      Checked Out
                    </Badge>
                  )}
                  {log.action === "registered" && (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 gap-1">
                      <Plus className="h-3 w-3" />
                      Registered
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {formatTime(log.timestamp)}
                  </span>
                </div>
                <p className="font-medium mt-1">{log.itemName || "Unknown Item"}</p>
                <p className="font-mono text-xs text-muted-foreground">{log.barcode}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
