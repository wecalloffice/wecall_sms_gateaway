'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Users, MessageSquare, Wallet, TrendingUp } from 'lucide-react';
import { mockAccounts } from '@/mocks/adapters/mockAccounts';

function StatCard({
  icon,
  label,
  value,
  change,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
}) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-xs mt-2 text-green-600">
              {change}
            </p>
          )}
        </div>
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: 'var(--primary-accent)' }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function ResellerDashboard() {
  const router = useRouter();
  const [reseller, setReseller] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock reseller data
        const mockResellerData = {
          name: 'KCB Bank',
          account_sid: 'RS12345678',
          status: 'active',
          clients: [
            { id: '1', name: 'Client 1', status: 'active' },
            { id: '2', name: 'Client 2', status: 'active' },
          ],
        };
        setReseller(mockResellerData);
        setClients(mockResellerData.clients || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reseller data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <MainLayout
        role="RESELLER_ADMIN"
        businessName="KCB Bank"
        userName="John Kariuki"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-600">Loading dashboard data...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      role="RESELLER_ADMIN"
      businessName={reseller?.name || 'KCB Bank'}
      userName="John Kariuki"
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reseller Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your clients and SMS campaigns</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Users size={24} style={{ color: 'var(--primary)' }} />}
            label="Active Clients"
            value={clients.filter(c => c.status === 'active').length}
            change="+2 this month"
          />
          <StatCard
            icon={<MessageSquare size={24} style={{ color: 'var(--primary)' }} />}
            label="Messages Sent"
            value={(reseller?.sms_usage?.this_month_outbound || 0).toLocaleString()}
            change="+18% from last week"
          />
          <StatCard
            icon={<Wallet size={24} style={{ color: 'var(--primary)' }} />}
            label="Wallet Balance"
            value={`$${reseller?.billing?.wallet_balance?.toFixed(2) || '0.00'}`}
            change="Last topup: 2 days ago"
          />
          <StatCard
            icon={<TrendingUp size={24} style={{ color: 'var(--primary)' }} />}
            label="Success Rate"
            value={`${((reseller?.sms_usage?.success_rate || 0) * 100).toFixed(1)}%`}
            change="+0.5% from yesterday"
          />
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Clients */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Top Clients
            </h2>
            <div className="space-y-3">
              {clients.length > 0 ? (
                clients.slice(0, 5).map((client, i) => (
                  <div
                    key={client.account_sid || i}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">
                        {(client.sms_usage?.this_month_outbound || 0).toLocaleString()} messages sent
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      client.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No clients found</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <button 
                onClick={() => router.push('/reseller/clients')}
                className="btn-primary w-full text-left px-4 py-3 hover:shadow-lg transition-shadow"
              >
                Add Client
              </button>
              <button 
                onClick={() => router.push('/reseller/wallet')}
                className="btn-primary w-full text-left px-4 py-3 hover:shadow-lg transition-shadow"
              >
                Top Up Wallet
              </button>
              <button 
                onClick={() => router.push('/reseller/dlr')}
                className="btn-primary w-full text-left px-4 py-3 hover:shadow-lg transition-shadow"
              >
                View SMS Logs
              </button>
              <button 
                onClick={() => router.push('/reseller/billing')}
                className="btn-primary w-full text-left px-4 py-3 hover:shadow-lg transition-shadow"
              >
                Billing Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
