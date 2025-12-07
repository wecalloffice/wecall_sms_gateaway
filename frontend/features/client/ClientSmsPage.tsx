'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/platform/DashboardHeader';
import { StatCard } from '@/components/platform/StatCard';
import { RecentMessagesList } from '@/components/platform/RecentMessagesList';
import { mockSms } from '@/mocks/adapters/mockSms';
import { mockBilling } from '@/mocks/adapters/mockBilling';
import { MessageSquare, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

const CLIENT_SID = 'AC_CLIENT_2001';

export function ClientSmsPage() {
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', CLIENT_SID],
    queryFn: () => mockSms.list(CLIENT_SID),
  });

  const { data: wallet } = useQuery({
    queryKey: ['wallet', CLIENT_SID],
    queryFn: () => mockBilling.wallet(CLIENT_SID),
  });

  const totalSent = messages.length;
  const delivered = messages.filter((m: any) => m.status === 'delivered').length;
  const failed = messages.filter((m: any) => m.status === 'failed').length;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="SMS Management"
        subtitle="Send and manage your SMS messages"
        showAddButton={false}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Sent"
          value={totalSent}
          icon={<MessageSquare className="w-5 h-5" />}
          color="text-blue-600"
        />
        <StatCard
          title="Delivered"
          value={delivered}
          icon={<TrendingUp className="w-5 h-5" />}
          color="text-green-600"
        />
        <StatCard
          title="Failed"
          value={failed}
          icon={<AlertCircle className="w-5 h-5" />}
          color="text-red-600"
        />
        <StatCard
          title="Balance"
          value={`$${wallet?.balance?.toFixed(2) || '0.00'}`}
          icon={<DollarSign className="w-5 h-5" />}
          color="text-emerald-600"
        />
      </div>

      <RecentMessagesList messages={messages} isLoading={isLoading} />
    </div>
  );
}
