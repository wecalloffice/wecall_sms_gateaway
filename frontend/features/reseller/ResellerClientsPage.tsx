'use client';

import { DashboardHeader } from '@/components/platform/DashboardHeader';
import { StatCard } from '@/components/platform/StatCard';
import { Users, Building2, TrendingUp, AlertCircle } from 'lucide-react';

export function ResellerClientsPage() {
  const totalClients = 42;
  const activeClients = 38;
  const pendingReviews = 4;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Manage Clients"
        subtitle="View and manage all your clients"
        showAddButton={true}
        onAddClick={() => console.log('Add client')}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Clients"
          value={totalClients}
          icon={<Users className="w-5 h-5" />}
          color="text-blue-600"
        />
        <StatCard
          title="Active"
          value={activeClients}
          icon={<TrendingUp className="w-5 h-5" />}
          color="text-green-600"
        />
        <StatCard
          title="Pending Review"
          value={pendingReviews}
          icon={<AlertCircle className="w-5 h-5" />}
          color="text-yellow-600"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Client List</h2>
        <p className="text-gray-500">Client management table coming soon</p>
      </div>
    </div>
  );
}
