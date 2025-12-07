'use client';

import { DashboardHeader } from '@/components/platform/DashboardHeader';
import { StatCard } from '@/components/platform/StatCard';
import { Shield, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export function ClientSecurityPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Security Settings"
        subtitle="Manage your account security"
        showAddButton={false}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="2FA Status"
          value="Enabled"
          icon={<Shield className="w-5 h-5" />}
          color="text-green-600"
        />
        <StatCard
          title="Active Sessions"
          value="1"
          icon={<Lock className="w-5 h-5" />}
          color="text-blue-600"
        />
        <StatCard
          title="Login Alerts"
          value="On"
          icon={<CheckCircle className="w-5 h-5" />}
          color="text-emerald-600"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500">No suspicious activity detected</p>
      </div>
    </div>
  );
}
