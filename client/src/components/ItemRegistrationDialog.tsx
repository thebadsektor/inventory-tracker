import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface ItemRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barcode: string;
  onRegister: (item: {
    barcode: string;
    name: string;
    category: string;
    description: string;
    checkedIn: boolean;
  }) => void;
}

const categories = [
  "Electronics",
  "Tools",
  "Office Supplies",
  "Equipment",
  "Furniture",
  "Other",
];

export function ItemRegistrationDialog({
  open,
  onOpenChange,
  barcode,
  onRegister,
}: ItemRegistrationDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [checkedIn, setCheckedIn] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && category) {
      onRegister({
        barcode,
        name: name.trim(),
        category,
        description: description.trim(),
        checkedIn,
      });
      setName("");
      setCategory("");
      setDescription("");
      setCheckedIn(true);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Register New Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Barcode</Label>
            <Input
              value={barcode}
              readOnly
              className="font-mono bg-muted"
              data-testid="input-registration-barcode"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              required
              data-testid="input-item-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger data-testid="select-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
              data-testid="input-item-description"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="status">Initial Status</Label>
              <p className="text-xs text-muted-foreground">
                {checkedIn ? "Item will be available" : "Item will be marked as checked out"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Checked Out</span>
              <Switch
                id="status"
                checked={checkedIn}
                onCheckedChange={setCheckedIn}
                data-testid="switch-initial-status"
              />
              <span className="text-sm text-muted-foreground">Checked In</span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-registration"
            >
              Cancel
            </Button>
            <Button type="submit" data-testid="button-submit-registration">
              Register Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
