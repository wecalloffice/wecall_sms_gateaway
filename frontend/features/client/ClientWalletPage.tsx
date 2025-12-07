'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/platform/DashboardHeader';
import { StatCard } from '@/components/platform/StatCard';
import { mockBilling } from '@/mocks/adapters/mockBilling';
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight } from 'lucide-react';

const CLIENT_SID = 'AC_CLIENT_2001';

export function ClientWalletPage() {
  const { data: wallet } = useQuery({
    queryKey: ['wallet', CLIENT_SID],
    queryFn: () => mockBilling.wallet(CLIENT_SID),
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', CLIENT_SID],
    queryFn: () => mockBilling.transactions(CLIENT_SID),
  });

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Wallet & Billing"
        subtitle="Manage your account balance and topups"
        showAddButton={false}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Current Balance"
          value={`$${wallet?.balance?.toFixed(2) || '0.00'}`}
          icon={<DollarSign className="w-5 h-5" />}
          color="text-emerald-600"
        />
        <StatCard
          title="Credit Limit"
          value={`$${wallet?.credit_limit || '0'}`}
          icon={<CreditCard className="w-5 h-5" />}
          color="text-blue-600"
        />
        <StatCard
          title="Recent Topups"
          value={transactions.filter((t: any) => t.type === 'TOPUP').length}
          icon={<ArrowUpRight className="w-5 h-5" />}
          color="text-purple-600"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-2">
          {transactions.slice(0, 5).map((t: any) => (
            <div key={t.sid} className="flex justify-between text-sm border-b pb-2">
              <span>{t.type}</span>
              <span className={t.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                {t.amount > 0 ? '+' : ''}{t.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
