import { InventoryTable, type InventoryItem } from "../InventoryTable";

// todo: remove mock functionality
const mockItems: InventoryItem[] = [
  { id: "1", barcode: "123456789", name: "Dell Monitor 24\"", category: "Electronics", description: "", checkedIn: true },
  { id: "2", barcode: "987654321", name: "Wireless Keyboard", category: "Electronics", description: "", checkedIn: false },
  { id: "3", barcode: "456789123", name: "Standing Desk", category: "Furniture", description: "", checkedIn: true },
  { id: "4", barcode: "789123456", name: "Cordless Drill", category: "Tools", description: "", checkedIn: false },
  { id: "5", barcode: "321654987", name: "Stapler Set", category: "Office Supplies", description: "", checkedIn: true },
];

export default function InventoryTableExample() {
  const handleEdit = (item: InventoryItem) => console.log("Edit:", item);
  const handleDelete = (item: InventoryItem) => console.log("Delete:", item);
  const handleToggle = (item: InventoryItem) => console.log("Toggle:", item);

  return (
    <InventoryTable
      items={mockItems}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleStatus={handleToggle}
    />
  );
}
