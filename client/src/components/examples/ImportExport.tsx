import { ImportExport } from "../ImportExport";

export default function ImportExportExample() {
  const handleImport = (file: File) => {
    console.log("Importing file:", file.name);
  };

  const handleExport = (type: "all" | "checked-out" | "history") => {
    console.log("Exporting:", type);
  };

  return <ImportExport onImport={handleImport} onExport={handleExport} />;
}
