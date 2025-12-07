"use client";

import { Route } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoutingHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SMS Routing</h1>
        <p className="text-gray-600 mt-1">Manage routing rules</p>
      </div>

      <Button className="flex items-center gap-2">
        <Route size={20} /> Add Route
      </Button>
    </div>
  );
}
