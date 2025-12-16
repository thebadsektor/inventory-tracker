import { ScanHistory, type ScanLogEntry } from "../ScanHistory";

// todo: remove mock functionality
const mockLogs: ScanLogEntry[] = [
  { id: "1", barcode: "123456789", itemName: "Dell Monitor 24\"", action: "checked_out", timestamp: new Date() },
  { id: "2", barcode: "987654321", itemName: "Wireless Keyboard", action: "checked_in", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { id: "3", barcode: "456789123", itemName: "Standing Desk", action: "registered", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: "4", barcode: "789123456", itemName: "Cordless Drill", action: "checked_out", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: "5", barcode: "321654987", itemName: "Stapler Set", action: "checked_in", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
];

export default function ScanHistoryExample() {
  return <ScanHistory logs={mockLogs} />;
}
