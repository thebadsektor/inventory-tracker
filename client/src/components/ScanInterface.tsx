import { useState, useRef, useEffect } from "react";
import { ScanLine, CheckCircle2, ArrowRightLeft, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface ScanResult {
  barcode: string;
  itemName: string | null;
  action: "checked_in" | "checked_out" | "not_found";
  timestamp: Date;
}

interface ScanInterfaceProps {
  onScan: (barcode: string) => void;
  lastResult: ScanResult | null;
  onRegisterNew?: (barcode: string) => void;
}

export function ScanInterface({ onScan, lastResult, onRegisterNew }: ScanInterfaceProps) {
  const [barcode, setBarcode] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [lastResult]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode.trim()) {
      onScan(barcode.trim());
      setBarcode("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Scan Barcode</h1>
        <p className="text-sm text-muted-foreground">
          Scan or enter a barcode to check items in/out
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="relative">
          <ScanLine className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Scan or type barcode..."
            className="h-20 pl-14 text-3xl font-mono text-center"
            autoFocus
            data-testid="input-barcode"
          />
        </div>
      </form>

      <Card className="w-full max-w-2xl min-h-32 p-6">
        {lastResult ? (
          <div className="flex flex-col items-center gap-4">
            {lastResult.action === "checked_out" && (
              <>
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <ArrowRightLeft className="h-8 w-8" />
                  <span className="text-lg font-medium">Checked Out</span>
                </div>
                <p className="text-2xl font-semibold">{lastResult.itemName}</p>
                <p className="font-mono text-sm text-muted-foreground">{lastResult.barcode}</p>
                <Badge variant="secondary">
                  {lastResult.timestamp.toLocaleTimeString()}
                </Badge>
              </>
            )}
            {lastResult.action === "checked_in" && (
              <>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-8 w-8" />
                  <span className="text-lg font-medium">Checked In</span>
                </div>
                <p className="text-2xl font-semibold">{lastResult.itemName}</p>
                <p className="font-mono text-sm text-muted-foreground">{lastResult.barcode}</p>
                <Badge variant="secondary">
                  {lastResult.timestamp.toLocaleTimeString()}
                </Badge>
              </>
            )}
            {lastResult.action === "not_found" && (
              <>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Plus className="h-8 w-8" />
                  <span className="text-lg font-medium">New Barcode Detected</span>
                </div>
                <p className="font-mono text-xl">{lastResult.barcode}</p>
                <button
                  onClick={() => onRegisterNew?.(lastResult.barcode)}
                  className="mt-2 text-primary underline underline-offset-2"
                  data-testid="button-register-new"
                >
                  Register as new item
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <ScanLine className="h-12 w-12 mb-2 opacity-50" />
            <p>Waiting for scan...</p>
          </div>
        )}
      </Card>
    </div>
  );
}
