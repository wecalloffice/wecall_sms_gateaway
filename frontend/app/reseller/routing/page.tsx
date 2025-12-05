'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Route, GitBranch, Activity } from 'lucide-react';

export default function ResellerRoutingPage() {
  const [routes, setRoutes] = useState([
    {
      id: 'route_1',
      name: 'Kenya Primary',
      prefix: '+254',
      gateway: 'safaricom_gateway',
      priority: 1,
      status: 'active',
      successRate: 98.5,
    },
    {
      id: 'route_2',
      name: 'Kenya Backup',
      prefix: '+254',
      gateway: 'airtel_kenya',
      priority: 2,
      status: 'active',
      successRate: 96.8,
    },
  ]);

  return (
    <MainLayout role="RESELLER" businessName="KCB Bank" userName="KCB Admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SMS Routing</h1>
            <p className="text-gray-600 mt-1">Manage routing rules</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Route size={20} />
            Add Route
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Routes</p>
                <p className="text-2xl font-bold text-gray-900">{routes.length}</p>
              </div>
              <Route size={32} className="text-primary" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gateways</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <GitBranch size={32} className="text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">97.7%</p>
              </div>
              <Activity size={32} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Routes Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Routing Rules</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prefix</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gateway</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {routes.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{route.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{route.prefix}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{route.gateway}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{route.priority}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        route.successRate >= 98 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {route.successRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {route.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-primary hover:text-primary-dark mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Disable</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
