import { useState } from "react";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InventoryTable, type InventoryItem } from "@/components/InventoryTable";
import { SearchFilter } from "@/components/SearchFilter";
import { ItemRegistrationDialog } from "@/components/ItemRegistrationDialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generateBarcode } from "@/lib/utils";
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

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "in" | "out">("all");
  const [category, setCategory] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newBarcode, setNewBarcode] = useState("");
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: ["/api/items"],
  });

  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ["/api/categories"],
  });

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

  const toggleMutation = useMutation({
    mutationFn: async (item: InventoryItem) => {
      const response = await apiRequest("PATCH", `/api/items/${item.id}`, {
        checkedIn: !item.checkedIn,
      });
      return response.json();
    },
    onSuccess: (data, item) => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: item.checkedIn ? "Checked Out" : "Checked In",
        description: `${item.name} status updated.`,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Item Deleted",
        description: `${itemToDelete?.name} has been removed.`,
      });
      setItemToDelete(null);
    },
  });

  const addMutation = useMutation({
    mutationFn: async (item: {
      barcode: string;
      name: string;
      category: string;
      description: string;
      checkedIn: boolean;
    }) => {
      const response = await apiRequest("POST", "/api/items", item);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Item Added",
        description: `${data.name} has been added to inventory.`,
      });
    },
    onError: () => {
      toast({
        title: "Failed to Add Item",
        description: "Could not add the item. The barcode may already exist.",
        variant: "destructive",
      });
    },
  });

  const checkedInCount = items.filter((i) => i.checkedIn).length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Inventory</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} items total, {checkedInCount} available
          </p>
        </div>
        <Button
          onClick={() => {
            setNewBarcode(generateBarcode());
            setShowAddDialog(true);
          }}
          data-testid="button-add-item"
        >
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

      {isLoading ? (
        <Skeleton className="h-64" />
      ) : (
        <InventoryTable
          items={filteredItems}
          onEdit={(item) => console.log("Edit:", item)}
          onDelete={(item) => setItemToDelete(item)}
          onToggleStatus={(item) => toggleMutation.mutate(item)}
        />
      )}

      <ItemRegistrationDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        barcode={newBarcode}
        onRegister={(item) => addMutation.mutate(item)}
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
            <AlertDialogAction
              onClick={() => itemToDelete && deleteMutation.mutate(itemToDelete.id)}
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
