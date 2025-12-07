"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

import { SecurityHeader } from "@/components/security/SecurityHeader";
import { SecurityStats } from "@/components/security/SecurityStats";
import { SecuritySettings } from "@/components/security/SecuritySettings";
import { RecentActivityTable } from "@/components/security/RecentActivityTable";

export default function ClientSecurityPage() {
  const [settings, setSettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
  });

  return (
    <MainLayout role="CLIENT_ADMIN" businessName="RDB" userName="RDB User">
      <div className="space-y-6">
        <SecurityHeader />

        <SecurityStats />

        <SecuritySettings settings={settings} setSettings={setSettings} />

        <RecentActivityTable />
      </div>
    </MainLayout>
  );
}
