import { useState } from "react";
import { Upload, Download, FileSpreadsheet, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ImportExportProps {
  onImport?: (file: File) => void;
  onExport?: (type: "all" | "checked-out" | "history") => void;
}

export function ImportExport({ onImport, onExport }: ImportExportProps) {
  const [exportType, setExportType] = useState<"all" | "checked-out" | "history">("all");
  const [isDragging, setIsDragging] = useState(false);
  const [importedFile, setImportedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith(".csv")) {
      setImportedFile(file.name);
      onImport?.(file);
      toast({
        title: "File imported",
        description: `${file.name} has been processed successfully.`,
      });
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportedFile(file.name);
      onImport?.(file);
      toast({
        title: "File imported",
        description: `${file.name} has been processed successfully.`,
      });
    }
  };

  const handleExport = () => {
    onExport?.(exportType);
    toast({
      title: "Export started",
      description: `Exporting ${exportType === "all" ? "full inventory" : exportType === "checked-out" ? "checked-out items" : "scan history"}...`,
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg min-h-48 flex flex-col items-center justify-center p-6 transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {importedFile ? (
              <>
                <Check className="h-12 w-12 text-green-600 dark:text-green-400 mb-3" />
                <p className="font-medium">{importedFile}</p>
                <p className="text-sm text-muted-foreground">Imported successfully</p>
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-3">
                  Drag and drop a CSV file here
                </p>
              </>
            )}
            <input
              type="file"
              accept=".csv"
              className="hidden"
              id="csv-upload"
              onChange={handleFileSelect}
              data-testid="input-csv-upload"
            />
            <Button asChild variant="outline" className="mt-2">
              <label htmlFor="csv-upload" className="cursor-pointer" data-testid="button-select-file">
                Select File
              </label>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            CSV should include columns: barcode, name, category, description, status
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={exportType}
            onValueChange={(v) => setExportType(v as typeof exportType)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-3 rounded-md border hover-elevate">
              <RadioGroupItem value="all" id="export-all" data-testid="radio-export-all" />
              <Label htmlFor="export-all" className="flex-1 cursor-pointer">
                <span className="font-medium">Full Inventory</span>
                <p className="text-xs text-muted-foreground">Export all items with current status</p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-md border hover-elevate">
              <RadioGroupItem value="checked-out" id="export-out" data-testid="radio-export-checked-out" />
              <Label htmlFor="export-out" className="flex-1 cursor-pointer">
                <span className="font-medium">Checked Out Items</span>
                <p className="text-xs text-muted-foreground">Export only items currently checked out</p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-md border hover-elevate">
              <RadioGroupItem value="history" id="export-history" data-testid="radio-export-history" />
              <Label htmlFor="export-history" className="flex-1 cursor-pointer">
                <span className="font-medium">Scan History</span>
                <p className="text-xs text-muted-foreground">Export complete activity log</p>
              </Label>
            </div>
          </RadioGroup>
          <Button className="w-full mt-6" onClick={handleExport} data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export as CSV
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
