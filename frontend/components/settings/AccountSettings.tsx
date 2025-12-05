"use client";

import { User } from "lucide-react";

interface Settings {
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  timezone: string;
}

interface Props {
  settings: Settings;
  setSettings: (s: Settings & any) => void;
}

export function AccountSettings({ settings, setSettings }: Props) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <User size={24} className="text-primary" />
        <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
          <input
            type="text"
            value={settings.businessName}
            onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
            className="input-field w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              value={settings.contactPhone}
              onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              className="input-field w-full"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
          <select
            value={settings.timezone}
            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
            className="input-field w-full"
          >
            <option value="Africa/Kigali">Kigali</option>
            <option value="Africa/Nairobi">Nairobi</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </div>
    </div>
  );
}
