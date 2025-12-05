'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Building2, Plus, Search, DollarSign, Users } from 'lucide-react';
import { mockAccounts } from '@/mocks/adapters/mockAccounts';

export default function ResellersPage() {
  const [resellers, setResellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResellers = async () => {
      try {
        const data = await mockAccounts.listResellers();
        setResellers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching resellers:', error);
        setLoading(false);
      }
    };
    
    fetchResellers();
  }, []);

  return (
    <MainLayout role="PLATFORM_ADMIN" businessName="WeCall Platform" userName="Admin User">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resellers</h1>
            <p className="text-gray-600 mt-1">Manage all resellers on the platform</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Add Reseller
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Resellers</p>
                <p className="text-2xl font-bold text-gray-900">{resellers.length}</p>
              </div>
              <Building2 size={32} className="text-primary" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Resellers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {resellers.filter(r => r.status === 'active').length}
                </p>
              </div>
              <Building2 size={32} className="text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {resellers.reduce((acc, r) => acc + (r.clients?.length || 0), 0)}
                </p>
              </div>
              <Users size={32} className="text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$45,230</p>
              </div>
              <DollarSign size={32} className="text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Resellers Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search resellers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Messages</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : (
                resellers.map((reseller) => (
                  <tr key={reseller.account_sid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{reseller.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{reseller.business_username}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{reseller.clients?.length || 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ${reseller.billing?.wallet_balance?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {(reseller.sms_usage?.this_month_outbound || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        reseller.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {reseller.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-primary hover:underline">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
