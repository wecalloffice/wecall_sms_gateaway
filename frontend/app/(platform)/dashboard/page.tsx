"use client";

import MainLayout from "@/components/ui/layout/MainLayout";
import BillingPanelLive from "@/features/billing/components/BillingPanelLive";

export default function PlatformDashboardPage() {
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold">Platform Admin Dashboard</h1>

      <div className="mt-6">
        <BillingPanelLive />
      </div>
    </MainLayout>
  );
}
