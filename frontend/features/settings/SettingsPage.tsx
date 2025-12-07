"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";

import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";

export default function ClientSettingsPage() {
  const [settings, setSettings] = useState({
    businessName: 'RDB',
    contactEmail: 'contact@rdb.rw',
    contactPhone: '+250712345678',
    timezone: 'Africa/Kigali',
    emailNotifications: true,
    smsNotifications: true,
    lowBalanceAlert: true,
    alertThreshold: 50,
  });

  const handleSave = () => alert("Settings saved successfully!");

  return (
    <MainLayout role="CLIENT_ADMIN" businessName="RDB" userName="RDB User">
      <div className="space-y-6">
        <SettingsHeader onSave={handleSave} />
        <AccountSettings settings={settings} setSettings={setSettings} />
        <NotificationSettings settings={settings} setSettings={setSettings} />
      </div>
    </MainLayout>
  );
}
