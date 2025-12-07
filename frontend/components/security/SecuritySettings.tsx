"use client";

interface Props {
  settings: { twoFactorEnabled: boolean; sessionTimeout: number };
  setSettings: (s: any) => void;
}

export function SecuritySettings({ settings, setSettings }: Props) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Configuration</h2>

      {/* 2FA Toggle */}
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
        <div>
          <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.twoFactorEnabled}
            onChange={(e) => setSettings({ ...settings, twoFactorEnabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      {/* Session Timeout */}
      <div className="p-4 border border-gray-200 rounded">
        <label className="block mb-2 font-medium text-gray-900">Session Timeout (minutes)</label>
        <input
          type="number"
          value={settings.sessionTimeout}
          onChange={(e) => setSettings({ ...settings, sessionTimeout: Number(e.target.value) })}
          className="input-field w-full"
        />
      </div>

      {/* Change Password */}
      <div className="p-4 border border-gray-200 rounded">
        <h3 className="font-medium text-gray-900 mb-2">Change Password</h3>
        <button className="btn-secondary w-full">Update Password</button>
      </div>
    </div>
  );
}
