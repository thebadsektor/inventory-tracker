import { useState } from "react";
import { ItemRegistrationDialog } from "../ItemRegistrationDialog";
import { Button } from "@/components/ui/button";

export default function ItemRegistrationDialogExample() {
  const [open, setOpen] = useState(true);

  const handleRegister = (item: {
    barcode: string;
    name: string;
    category: string;
    description: string;
    checkedIn: boolean;
  }) => {
    console.log("Registered item:", item);
  };

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Registration Dialog</Button>
      <ItemRegistrationDialog
        open={open}
        onOpenChange={setOpen}
        barcode="ABC123456789"
        onRegister={handleRegister}
      />
    </div>
  );
}
