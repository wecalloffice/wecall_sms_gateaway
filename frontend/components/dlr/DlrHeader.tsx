"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DlrHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Delivery Reports (DLR)</h1>
        <p className="text-gray-600 mt-1">
          Track message delivery status for all clients
        </p>
      </div>

      <Button className="flex items-center gap-2">
        <Download size={20} />
        Export Report
      </Button>
    </div>
  );
}
