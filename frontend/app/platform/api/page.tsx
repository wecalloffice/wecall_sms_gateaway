'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Key, Shield, Copy, RefreshCw } from 'lucide-react';

export default function ApiPage() {
  const [apiKeys, setApiKeys] = useState<any[]>([
    {
      id: 'ak_1',
      name: 'Production Key',
      key: 'wc_prod_abc123***********',
      created: '2024-01-15',
      lastUsed: '2024-01-20',
      status: 'active',
    },
    {
      id: 'ak_2',
      name: 'Development Key',
      key: 'wc_dev_xyz789***********',
      created: '2024-01-10',
      lastUsed: '2024-01-19',
      status: 'active',
    },
  ]);

  return (
    <MainLayout role="PLATFORM_ADMIN" businessName="WeCall Platform" userName="Admin User">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">API & Integrations</h1>
            <p className="text-gray-600 mt-1">Manage API keys and webhooks</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Key size={20} />
            Generate New Key
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active API Keys</p>
                <p className="text-2xl font-bold text-gray-900">{apiKeys.length}</p>
              </div>
              <Key size={32} className="text-primary" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">API Requests Today</p>
                <p className="text-2xl font-bold text-gray-900">15,420</p>
              </div>
              <RefreshCw size={32} className="text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Webhook Endpoints</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <Shield size={32} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">API Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {apiKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{key.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded">{key.key}</code>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Copy size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{key.created}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{key.lastUsed}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {key.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-red-600 hover:text-red-800">Revoke</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* API Documentation */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API Documentation</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-medium text-gray-900">Send SMS</h3>
              <code className="text-sm text-gray-600">POST /api/v1/sms/send</code>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-medium text-gray-900">Get Message Status</h3>
              <code className="text-sm text-gray-600">GET /api/v1/sms/{'<message_id>'}</code>
            </div>
            <div className="border-l-4 border-primary pl-4">
              <h3 className="font-medium text-gray-900">List Messages</h3>
              <code className="text-sm text-gray-600">GET /api/v1/sms/list</code>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
