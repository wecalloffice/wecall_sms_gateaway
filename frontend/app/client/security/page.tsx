'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Shield, Lock, Key } from 'lucide-react';

export default function ClientSecurityPage() {
  const [settings, setSettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
  });

  return (
    <MainLayout role="CLIENT_ADMIN" businessName="RDB" userName="RDB User">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Security</h1>
            <p className="text-gray-600 mt-1">Manage your security settings</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <Shield size={32} className="text-primary" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">2FA Enabled</p>
                <p className="text-2xl font-bold text-red-600">No</p>
              </div>
              <Lock size={32} className="text-red-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">API Keys</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
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
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
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
                <span className="font-medium text-gray-900">Session Timeout (minutes)</span>
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({...settings, sessionTimeout: Number(e.target.value)})}
                className="input-field w-full"
              />
            </div>

            <div className="p-4 border border-gray-200 rounded">
              <h3 className="font-medium text-gray-900 mb-2">Change Password</h3>
              <button className="btn-secondary">
                Update Password
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Security Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Login</td>
                  <td className="px-6 py-4 text-sm text-gray-600">192.168.1.100</td>
                  <td className="px-6 py-4 text-sm text-gray-600">2024-01-20 10:30:00</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Success</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">API Key Generated</td>
                  <td className="px-6 py-4 text-sm text-gray-600">192.168.1.100</td>
                  <td className="px-6 py-4 text-sm text-gray-600">2024-01-19 15:20:00</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Success</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
