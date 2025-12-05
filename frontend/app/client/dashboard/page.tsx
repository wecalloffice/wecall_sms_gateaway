'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { MessageSquare, Wallet, Activity, Clock } from 'lucide-react';
import { mockAccounts } from '@/mocks/adapters/mockAccounts';
import { mockSms } from '@/mocks/adapters/mockSms';

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
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700 shadow-sm transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className="text-xs mt-2 text-green-600 dark:text-green-400">
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

export default function ClientDashboard() {
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get mock client data
        const mockClientData = {
          name: 'Acme Corp',
          account_sid: 'AC12345678',
          status: 'active',
          balance: 1250.50,
          monthly_limit: 5000,
        };
        setClient(mockClientData);
        
        // Get recent messages
        const allMessages = await mockSms.list({ business_sid: mockClientData.account_sid });
        setMessages(allMessages.slice(0, 5));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching client data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <MainLayout
        role="CLIENT_ADMIN"
        businessName="Rwanda Development Board"
        userName="Alice Mukamana"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-600">Loading dashboard data...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      role="CLIENT_ADMIN"
      businessName={client?.name || 'Rwanda Development Board'}
      userName="Alice Mukamana"
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600 mt-1">Send SMS and manage your account</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<MessageSquare size={24} style={{ color: 'var(--primary)' }} />}
            label="Messages Sent Today"
            value={(client?.sms_usage?.today_outbound || 0).toLocaleString()}
            change="+500 from yesterday"
          />
          <StatCard
            icon={<Activity size={24} style={{ color: 'var(--primary)' }} />}
            label="Success Rate"
            value={`${((client?.sms_usage?.success_rate || 0) * 100).toFixed(1)}%`}
            change="Last 24 hours"
          />
          <StatCard
            icon={<Wallet size={24} style={{ color: 'var(--primary)' }} />}
            label="Account Balance"
            value={`$${client?.billing?.wallet_balance?.toFixed(2) || '0.00'}`}
            change={`Credit limit: $${client?.billing?.credit_limit || 0}`}
          />
          <StatCard
            icon={<Clock size={24} style={{ color: 'var(--primary)' }} />}
            label="Messages This Month"
            value={(client?.sms_usage?.this_month_outbound || 0).toLocaleString()}
            change="+5K from last month"
          />
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Messages */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Messages
            </h2>
            <div className="space-y-3">
              {messages.length > 0 ? (
                messages.map((msg, i) => (
                  <div
                    key={msg.sid || i}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{msg.to || 'N/A'}</p>
                      <p className="text-xs text-gray-500">
                        {msg.created_at ? new Date(msg.created_at).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        msg.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : msg.status === 'queued' || msg.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : msg.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent messages</p>
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
                onClick={() => router.push('/client/sms')}
                className="btn-primary w-full text-left px-4 py-3 hover:shadow-lg transition-shadow"
              >
                Send SMS
              </button>
              <button 
                onClick={() => router.push('/client/sms-logs')}
                className="btn-primary w-full text-left px-4 py-3 hover:shadow-lg transition-shadow"
              >
                View SMS Logs
              </button>
              <button 
                onClick={() => router.push('/client/wallet')}
                className="btn-primary w-full text-left px-4 py-3 hover:shadow-lg transition-shadow"
              >
                Top Up Account
              </button>
              <button 
                onClick={() => router.push('/client/settings')}
                className="btn-primary w-full text-left px-4 py-3 hover:shadow-lg transition-shadow"
              >
                Manage Staff
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
