'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/platform/DashboardHeader';
import { StatCard } from '@/components/platform/StatCard';
import { RecentMessagesList } from '@/components/platform/RecentMessagesList';
import { QuickActions } from '@/components/platform/QuickActions';
import { mockAccounts } from '@/mocks/adapters/mockAccounts';
import { mockSms } from '@/mocks/adapters/mockSms';
import { mockBilling } from '@/mocks/adapters/mockBilling';
import { wecallMockData } from '@/mocks/data/wecallMockData';
import { Users, MessageSquare, DollarSign, TrendingUp } from 'lucide-react';

const RESELLER_SID = 'AC_RESELLER_1001';

export function PlatformDashboardPageRefactored() {
  const { data: resellers = [] } = useQuery({
    queryKey: ['resellers'],
    queryFn: () => mockAccounts.getResellers(),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients', resellers],
    queryFn: async () => resellers.flatMap((r: any) => r.clients || []),
    enabled: resellers.length > 0,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', RESELLER_SID],
    queryFn: () => mockSms.list(wecallMockData.resellers[0]?.clients[0]?.account_sid),
  });

  const { data: wallet } = useQuery({
    queryKey: ['wallet', RESELLER_SID],
    queryFn: () => mockBilling.wallet(RESELLER_SID),
  });

  const totalMessages = messages.length;
  const deliveredMessages = messages.filter((m: any) => m.status === 'delivered').length;
  const successRate = totalMessages > 0 ? ((deliveredMessages / totalMessages) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Platform Dashboard"
        subtitle="Monitor all resellers and clients activity"
        showAddButton={false}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Clients"
          value={clients.length}
          icon={<Users className="w-5 h-5" />}
          color="text-blue-600"
        />
        <StatCard
          title="Messages Sent"
          value={totalMessages}
          icon={<MessageSquare className="w-5 h-5" />}
          color="text-purple-600"
        />
        <StatCard
          title="Success Rate"
          value={successRate}
          unit="%"
          icon={<TrendingUp className="w-5 h-5" />}
          color="text-green-600"
        />
        <StatCard
          title="Wallet Balance"
          value={`$${wallet?.balance?.toFixed(2) || '0.00'}`}
          icon={<DollarSign className="w-5 h-5" />}
          color="text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentMessagesList messages={messages} isLoading={messagesLoading} />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
