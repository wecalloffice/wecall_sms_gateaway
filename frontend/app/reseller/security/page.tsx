'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Shield, Lock, Key } from 'lucide-react';

export default function ResellerSecurityPage() {
  const [settings, setSettings] = useState({
    twoFactorEnabled: true,
    apiRateLimit: 500,
    sessionTimeout: 30,
  });

  return (
    <MainLayout role="RESELLER" businessName="KCB Bank" userName="KCB Admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Security</h1>
            <p className="text-gray-600 mt-1">Manage security settings</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <Shield size={32} className="text-primary" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">2FA Enabled</p>
                <p className="text-2xl font-bold text-green-600">Yes</p>
              </div>
              <Lock size={32} className="text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">API Keys</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <Key size={32} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Configuration</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
              <div>
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Require 2FA for login</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactorEnabled}
                  onChange={(e) => setSettings({...settings, twoFactorEnabled: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="p-4 border border-gray-200 rounded">
              <label className="block mb-2">
                <span className="font-medium text-gray-900">API Rate Limit (requests/min)</span>
              </label>
              <input
                type="number"
                value={settings.apiRateLimit}
                onChange={(e) => setSettings({...settings, apiRateLimit: Number(e.target.value)})}
                className="input-field w-full"
              />
            </div>

            <div className="p-4 border border-gray-200 rounded">
              <label className="block mb-2">
                <span className="font-medium text-gray-900">Session Timeout (minutes)</span>
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({...settings, sessionTimeout: Number(e.target.value)})}
                className="input-field w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
