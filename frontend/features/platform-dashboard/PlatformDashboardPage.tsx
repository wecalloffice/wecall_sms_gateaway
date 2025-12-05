"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/StatCard";
import { Building2, Users, MessageSquare, Wallet } from "lucide-react";
import { mockAccounts } from "@/mocks/adapters/mockAccounts";
import { mockSms } from "@/mocks/adapters/mockSms";
import { mockObservability } from "@/mocks/adapters/mockObservability";

// Placeholder component for RecentActivity
const RecentActivity = () => <div className="bg-white rounded-lg p-6">Recent Activity</div>;

// Placeholder component for QuickActions
const QuickActions = () => <div className="bg-white rounded-lg p-6">Quick Actions</div>;

export default function PlatformDashboardPage() {
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

        const totalClients = resellers.reduce((acc: number, r: any) => acc + (r.clients?.length || 0), 0);
        const today = new Date().toISOString().split('T')[0];
        const messagesToday = messages.filter((m) => m.created_at?.startsWith(today)).length;

        setStats({
          activeResellers: resellers.filter((r: any) => r.status === "active").length,
          totalClients,
          messagesToday,
          revenueThisMonth: 45230,
        });

        setRecentActivity(events.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <MainLayout role="PLATFORM_ADMIN" businessName="WeCall Platform" userName="Admin User">
    <div className="flex items-center justify-center h-full text-gray-600">Loading dashboard data...</div>
  </MainLayout>;

  return (
    <MainLayout role="PLATFORM_ADMIN" businessName="WeCall Platform" userName="Admin User">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back to your platform control center</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Building2 size={24} style={{ color: 'var(--primary)' }} />} label="Active Resellers" value={stats.activeResellers} change="2" />
          <StatCard icon={<Users size={24} style={{ color: 'var(--primary)' }} />} label="Total Clients" value={stats.totalClients} change="125" />
          <StatCard icon={<MessageSquare size={24} style={{ color: 'var(--primary)' }} />} label="Messages Today" value={stats.messagesToday.toLocaleString()} change="15%" />
          <StatCard icon={<Wallet size={24} style={{ color: 'var(--primary)' }} />} label="Revenue This Month" value={`$${stats.revenueThisMonth.toLocaleString()}`} change="18%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-2">
              {recentActivity.map((event: any, idx: number) => (
                <div key={idx} className="text-sm text-gray-600 border-b pb-2">
                  {event.event_type} - {new Date(event.created_at).toLocaleString()}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a href="/platform/resellers" className="block px-4 py-2 bg-primary text-white rounded hover:opacity-90">Add New Reseller</a>
              <a href="/platform/billing" className="block px-4 py-2 bg-primary text-white rounded hover:opacity-90">View Billing Reports</a>
              <a href="/platform/logs" className="block px-4 py-2 bg-primary text-white rounded hover:opacity-90">Check System Health</a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
