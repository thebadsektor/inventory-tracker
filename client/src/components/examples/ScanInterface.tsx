import { useState } from "react";
import { ScanInterface, type ScanResult } from "../ScanInterface";

export default function ScanInterfaceExample() {
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);

  const handleScan = (barcode: string) => {
    // todo: remove mock functionality
    const mockItems: Record<string, { name: string; checkedIn: boolean }> = {
      "123456789": { name: "Dell Monitor 24\"", checkedIn: true },
      "987654321": { name: "Wireless Keyboard", checkedIn: false },
    };

    const item = mockItems[barcode];
    if (item) {
      setLastResult({
        barcode,
        itemName: item.name,
        action: item.checkedIn ? "checked_out" : "checked_in",
        timestamp: new Date(),
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
    console.log("Register new item with barcode:", barcode);
  };

  return (
    <ScanInterface
      onScan={handleScan}
      lastResult={lastResult}
      onRegisterNew={handleRegisterNew}
    />
  );
}
