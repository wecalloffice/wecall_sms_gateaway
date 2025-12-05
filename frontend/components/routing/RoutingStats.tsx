"use client";

import { Route, GitBranch, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function RoutingStats({ routes }: { routes: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Active Routes</p>
            <p className="text-2xl font-bold text-gray-900">{routes.length}</p>
          </div>
          <Route size={32} className="text-primary" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Gateways</p>
            <p className="text-2xl font-bold text-gray-900">2</p>
          </div>
          <GitBranch size={32} className="text-blue-600" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Success Rate</p>
            <p className="text-2xl font-bold text-green-600">97.7%</p>
          </div>
          <Activity size={32} className="text-green-600" />
        </CardContent>
      </Card>
    </div>
  );
}
