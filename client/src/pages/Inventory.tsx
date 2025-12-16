import { useState } from "react";
import { Plus } from "lucide-react";
import { InventoryTable, type InventoryItem } from "@/components/InventoryTable";
import { SearchFilter } from "@/components/SearchFilter";
import { ItemRegistrationDialog } from "@/components/ItemRegistrationDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// todo: remove mock functionality
const initialItems: InventoryItem[] = [
  { id: "1", barcode: "123456789", name: "Dell Monitor 24\"", category: "Electronics", description: "", checkedIn: true },
  { id: "2", barcode: "987654321", name: "Wireless Keyboard", category: "Electronics", description: "", checkedIn: false },
  { id: "3", barcode: "456789123", name: "Standing Desk", category: "Furniture", description: "", checkedIn: true },
  { id: "4", barcode: "789123456", name: "Cordless Drill", category: "Tools", description: "", checkedIn: false },
  { id: "5", barcode: "321654987", name: "Stapler Set", category: "Office Supplies", description: "", checkedIn: true },
  { id: "6", barcode: "654987321", name: "Ergonomic Chair", category: "Furniture", description: "", checkedIn: true },
  { id: "7", barcode: "147258369", name: "USB Hub 7-Port", category: "Electronics", description: "", checkedIn: false },
  { id: "8", barcode: "369258147", name: "Whiteboard Markers", category: "Office Supplies", description: "", checkedIn: true },
];

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "in" | "out">("all");
  const [category, setCategory] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const { toast } = useToast();

  const categories = Array.from(new Set(items.map((i) => i.category)));

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

  const handleToggleStatus = (item: InventoryItem) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, checkedIn: !i.checkedIn } : i
      )
    );
    toast({
      title: item.checkedIn ? "Checked Out" : "Checked In",
      description: `${item.name} status updated.`,
    });
  };

  const handleDelete = (item: InventoryItem) => {
    setItemToDelete(item);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      toast({
        title: "Item Deleted",
        description: `${itemToDelete.name} has been removed.`,
      });
      setItemToDelete(null);
    }
  };

  const handleAddItem = (item: {
    barcode: string;
    name: string;
    category: string;
    description: string;
    checkedIn: boolean;
  }) => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      ...item,
    };
    setItems((prev) => [...prev, newItem]);
    toast({
      title: "Item Added",
      description: `${item.name} has been added to inventory.`,
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Inventory</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} items total, {items.filter((i) => i.checkedIn).length} available
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-item">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
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

      <InventoryTable
        items={filteredItems}
        onEdit={(item) => console.log("Edit:", item)}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      <ItemRegistrationDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        barcode=""
        onRegister={handleAddItem}
      />

      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} data-testid="button-confirm-delete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
