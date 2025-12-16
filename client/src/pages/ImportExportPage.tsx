import { ImportExport } from "@/components/ImportExport";

export default function ImportExportPage() {
  const handleImport = (file: File) => {
    // todo: remove mock functionality
    console.log("Processing import:", file.name);
  };

  const handleExport = (type: "all" | "checked-out" | "history") => {
    // todo: remove mock functionality
    console.log("Exporting:", type);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Import / Export</h1>
        <p className="text-sm text-muted-foreground">
          Bulk import items or export data for reporting
        </p>
      </div>

      <ImportExport onImport={handleImport} onExport={handleExport} />
    </div>
  );
}
