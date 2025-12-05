'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { BarChart3, Users, MessageSquare, Wallet, Building2 } from 'lucide-react';
import { mockAccounts } from '@/mocks/adapters/mockAccounts';
import { mockSms } from '@/mocks/adapters/mockSms';
import { mockBilling } from '@/mocks/adapters/mockBilling';
import { mockObservability } from '@/mocks/adapters/mockObservability';

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
              +{change} from last month
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

export default function PlatformDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    activeResellers: 0,
    totalClients: 0,
    messagesToday: 0,
    revenueThisMonth: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resellers = await mockAccounts.listResellers();
        const messages = await mockSms.list();
        const events = await mockObservability.listEvents();
        
        // Calculate total clients across all resellers
        const totalClients = resellers.reduce((acc: number, r: any) => acc + (r.clients?.length || 0), 0);
        
        // Calculate messages today
        const today = new Date().toISOString().split('T')[0];
        const messagesToday = messages.filter(m => m.created_at?.startsWith(today)).length;
        
        setStats({
          activeResellers: resellers.filter((r: any) => r.status === 'active').length,
          totalClients,
          messagesToday,
          revenueThisMonth: 45230, // Mock value
        });
        
        setRecentActivity(events.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <MainLayout
        role="PLATFORM_ADMIN"
        businessName="WeCall Platform"
        userName="Admin User"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-600">Loading dashboard data...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      role="PLATFORM_ADMIN"
      businessName="WeCall Platform"
      userName="Admin User"
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back to your platform control center</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Building2 size={24} style={{ color: 'var(--primary)' }} />}
            label="Active Resellers"
            value={stats.activeResellers}
            change="2"
          />
          <StatCard
            icon={<Users size={24} style={{ color: 'var(--primary)' }} />}
            label="Total Clients"
            value={stats.totalClients}
            change="125"
          />
          <StatCard
            icon={<MessageSquare size={24} style={{ color: 'var(--primary)' }} />}
            label="Messages Today"
            value={stats.messagesToday.toLocaleString()}
            change="15%"
          />
          <StatCard
            icon={<Wallet size={24} style={{ color: 'var(--primary)' }} />}
            label="Revenue This Month"
            value={`$${stats.revenueThisMonth.toLocaleString()}`}
            change="18%"
          />
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((event, i) => (
                  <div
                    key={event.sid || i}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <p className="text-sm text-gray-700">
                      {event.description || event.message || 'Activity event'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent activity</p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <button 
                onClick={() => router.push('/platform/resellers')}
                className="btn-primary w-full text-left px-4 py-3 hover:shadow-lg transition-shadow"
              >
                Add New Reseller
              </button>
              <button 
                onClick={() => router.push('/platform/billing')}
                className="btn-primary w-full text-left px-4 py-3 hover:shadow-lg transition-shadow"
              >
                View Billing Reports
              </button>
              <button 
                onClick={() => router.push('/platform/logs')}
                className="btn-primary w-full text-left px-4 py-3 hover:shadow-lg transition-shadow"
              >
                Check System Health
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
