"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import RoutingHeader from "@/components/routing/RoutingHeader";
import RoutingStats from "@/components/routing/RoutingStats";
import RoutingTable from "@/components/routing/RoutingTable";

export default function ResellerRoutingPage() {
  const [routes] = useState([
    {
      id: "route_1",
      name: "Kenya Primary",
      prefix: "+254",
      gateway: "safaricom_gateway",
      priority: 1,
      status: "active",
      successRate: 98.5,
    },
    {
      id: "route_2",
      name: "Kenya Backup",
      prefix: "+254",
      gateway: "airtel_kenya",
      priority: 2,
      status: "active",
      successRate: 96.8,
    },
  ]);

  return (
    <MainLayout role="RESELLER" businessName="KCB Bank" userName="KCB Admin">
      <div className="space-y-6">
        <RoutingHeader />
        <RoutingStats routes={routes} />
        <RoutingTable routes={routes} />
      </div>
    </MainLayout>
  );
}
