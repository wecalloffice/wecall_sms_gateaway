'use client';

import { Lock, Bell, Eye } from 'lucide-react';

interface SettingsItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
}

export default function ProfileSettings() {
  const settings: SettingsItem[] = [
    {
      icon: <Lock size={20} />,
      title: 'Change Password',
      description: 'Update your password regularly for better security',
      action: 'Change',
    },
    {
      icon: <Bell size={20} />,
      title: 'Notification Preferences',
      description: 'Manage how you receive alerts and notifications',
      action: 'Configure',
    },
    {
      icon: <Eye size={20} />,
      title: 'Privacy Settings',
      description: 'Control who can see your profile information',
      action: 'Manage',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Settings</h2>

      <div className="space-y-3">
        {settings.map((setting, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-4">
              <div className="text-primary">{setting.icon}</div>
              <div>
                <h3 className="font-medium text-gray-900">{setting.title}</h3>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
            </div>
            <button className="px-3 py-1 text-primary hover:bg-pink-50 rounded text-sm font-medium">
              {setting.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
