import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ScanInterface, type ScanResult } from "@/components/ScanInterface";
import { ItemRegistrationDialog } from "@/components/ItemRegistrationDialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Scan() {
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);
  const [pendingBarcode, setPendingBarcode] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scanMutation = useMutation({
    mutationFn: async (barcode: string) => {
      const response = await apiRequest("POST", "/api/scan", { barcode });
      return response.json();
    },
    onSuccess: (data) => {
      setLastResult({
        barcode: data.barcode,
        itemName: data.itemName,
        action: data.action,
        timestamp: new Date(),
      });

      if (data.action !== "not_found") {
        queryClient.invalidateQueries({ queryKey: ["/api/items"] });
        queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
        queryClient.invalidateQueries({ queryKey: ["/api/logs"] });
        
        toast({
          title: data.action === "checked_in" ? "Checked In" : "Checked Out",
          description: `${data.itemName} has been ${data.action === "checked_in" ? "checked in" : "checked out"}.`,
        });
      }
    },
    onError: () => {
      toast({
        title: "Scan Failed",
        description: "Failed to process barcode scan.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
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

      setLastResult({
        barcode: data.barcode,
        itemName: data.name,
        action: data.checkedIn ? "checked_in" : "checked_out",
        timestamp: new Date(),
      });

      toast({
        title: "Item Registered",
        description: `${data.name} has been added to inventory.`,
      });
    },
    onError: () => {
      toast({
        title: "Registration Failed",
        description: "Failed to register new item.",
        variant: "destructive",
      });
    },
  });

  const handleScan = (barcode: string) => {
    scanMutation.mutate(barcode);
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
    registerMutation.mutate(item);
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
