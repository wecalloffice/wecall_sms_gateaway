"use client";

import { Bell } from "lucide-react";

interface Settings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  lowBalanceAlert: boolean;
  alertThreshold: number;
}

interface Props {
  settings: Settings & any;
  setSettings: (s: Settings & any) => void;
}

export function NotificationSettings({ settings, setSettings }: Props) {
  const toggle = (key: keyof Settings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSettings({ ...settings, [key]: e.target.checked });

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell size={24} className="text-primary" />
        <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
      </div>

      <div className="space-y-4">
        {[
          { label: "Email Notifications", key: "emailNotifications", description: "Receive email alerts for important events" },
          { label: "SMS Notifications", key: "smsNotifications", description: "Receive SMS alerts" },
          { label: "Low Balance Alert", key: "lowBalanceAlert", description: "Get notified when balance is low" },
        ].map(({ label, key, description }) => (
          <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded">
            <div>
              <h3 className="font-medium text-gray-900">{label}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={settings[key]} onChange={toggle(key as keyof Settings)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}

        {settings.lowBalanceAlert && (
          <div className="p-4 border border-gray-200 rounded">
            <label className="block mb-2">
              <span className="font-medium text-gray-900">Alert Threshold ($)</span>
            </label>
            <input
              type="number"
              value={settings.alertThreshold}
              onChange={(e) => setSettings({ ...settings, alertThreshold: Number(e.target.value) })}
              className="input-field w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
