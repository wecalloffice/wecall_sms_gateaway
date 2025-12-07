'use client';

import { DashboardHeader } from '@/components/platform/DashboardHeader';
import { StatCard } from '@/components/platform/StatCard';
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight } from 'lucide-react';

export function ResellerBillingPage() {
  const monthlyRevenue = 5430.50;
  const totalEarnings = 28450.00;
  const pendingPayouts = 3200.00;
  const commissionRate = '15%';

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Revenue & Billing"
        subtitle="Track your earnings and payouts"
        showAddButton={false}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Revenue"
          value={`$${monthlyRevenue}`}
          icon={<DollarSign className="w-5 h-5" />}
          color="text-emerald-600"
        />
        <StatCard
          title="Total Earnings"
          value={`$${totalEarnings}`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="text-blue-600"
        />
        <StatCard
          title="Pending Payouts"
          value={`$${pendingPayouts}`}
          icon={<ArrowUpRight className="w-5 h-5" />}
          color="text-purple-600"
        />
        <StatCard
          title="Commission Rate"
          value={commissionRate}
          icon={<CreditCard className="w-5 h-5" />}
          color="text-orange-600"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <p className="text-gray-500">Transaction history coming soon</p>
      </div>
    </div>
  );
}
