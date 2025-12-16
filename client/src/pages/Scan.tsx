import { useState } from "react";
import { ScanInterface, type ScanResult } from "@/components/ScanInterface";
import { ItemRegistrationDialog } from "@/components/ItemRegistrationDialog";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockInventory: Map<string, { name: string; checkedIn: boolean }> = new Map([
  ["123456789", { name: "Dell Monitor 24\"", checkedIn: true }],
  ["987654321", { name: "Wireless Keyboard", checkedIn: false }],
  ["456789123", { name: "Standing Desk", checkedIn: true }],
]);

export default function Scan() {
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [pendingBarcode, setPendingBarcode] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const { toast } = useToast();

  const handleScan = (barcode: string) => {
    const item = mockInventory.get(barcode);

    if (item) {
      const newStatus = !item.checkedIn;
      mockInventory.set(barcode, { ...item, checkedIn: newStatus });
      
      setLastResult({
        barcode,
        itemName: item.name,
        action: newStatus ? "checked_in" : "checked_out",
        timestamp: new Date(),
      });

      toast({
        title: newStatus ? "Checked In" : "Checked Out",
        description: `${item.name} has been ${newStatus ? "checked in" : "checked out"}.`,
      });
    } else {
      setLastResult({
        barcode,
        itemName: null,
        action: "not_found",
        timestamp: new Date(),
      });
    }
  };

  const handleRegisterNew = (barcode: string) => {
    setPendingBarcode(barcode);
    setShowRegistration(true);
  };

  const handleRegister = (item: {
    barcode: string;
    name: string;
    category: string;
    description: string;
    checkedIn: boolean;
  }) => {
    // todo: remove mock functionality
    mockInventory.set(item.barcode, { name: item.name, checkedIn: item.checkedIn });
    
    setLastResult({
      barcode: item.barcode,
      itemName: item.name,
      action: item.checkedIn ? "checked_in" : "checked_out",
      timestamp: new Date(),
    });

    toast({
      title: "Item Registered",
      description: `${item.name} has been added to inventory.`,
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <ScanInterface
          onScan={handleScan}
          lastResult={lastResult}
          onRegisterNew={handleRegisterNew}
        />
      </div>

      <ItemRegistrationDialog
        open={showRegistration}
        onOpenChange={setShowRegistration}
        barcode={pendingBarcode || ""}
        onRegister={handleRegister}
      />
    </div>
  );
}
