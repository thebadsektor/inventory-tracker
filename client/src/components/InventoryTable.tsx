import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface InventoryItem {
  id: string;
  barcode: string;
  name: string;
  category: string;
  description: string;
  checkedIn: boolean;
}

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (item: InventoryItem) => void;
  onToggleStatus?: (item: InventoryItem) => void;
}

export function InventoryTable({ items, onEdit, onDelete, onToggleStatus }: InventoryTableProps) {
  const [sortBy, setSortBy] = useState<"name" | "category" | "barcode">("name");
  const [sortAsc, setSortAsc] = useState(true);

  const sortedItems = [...items].sort((a, b) => {
    const aVal = a[sortBy].toLowerCase();
    const bVal = b[sortBy].toLowerCase();
    return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const handleSort = (column: "name" | "category" | "barcode") => {
    if (sortBy === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column);
      setSortAsc(true);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("barcode")}
                className="gap-1 -ml-3"
                data-testid="button-sort-barcode"
              >
                Barcode
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("name")}
                className="gap-1 -ml-3"
                data-testid="button-sort-name"
              >
                Name
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="w-40">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("category")}
                className="gap-1 -ml-3"
                data-testid="button-sort-category"
              >
                Category
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="w-32">Status</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                No items found
              </TableCell>
            </TableRow>
          ) : (
            sortedItems.map((item) => (
              <TableRow key={item.id} className="h-14" data-testid={`row-item-${item.id}`}>
                <TableCell className="font-mono text-sm">{item.barcode}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={item.checkedIn ? "default" : "outline"}
                    className={item.checkedIn 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                    }
                  >
                    {item.checkedIn ? "In" : "Out"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" data-testid={`button-actions-${item.id}`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onToggleStatus?.(item)}>
                        {item.checkedIn ? "Check Out" : "Check In"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(item)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete?.(item)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
