'use client';

import { useQuery } from '@tanstack/react-query';
import { RoleBasedLayout } from '@/components/platform/RoleBasedLayout';
import { RoleStatCard } from '@/components/platform/RoleStatCard';
import { RoleActions } from '@/components/platform/RoleActions';
import { RecentMessagesList } from '@/components/platform/RecentMessagesList';
import { mockAccounts } from '@/mocks/adapters/mockAccounts';
import { mockSms } from '@/mocks/adapters/mockSms';
import { mockBilling } from '@/mocks/adapters/mockBilling';
import { wecallMockData } from '@/mocks/data/wecallMockData';
import { Users, MessageSquare, DollarSign, TrendingUp } from 'lucide-react';

const ROLE = 'PLATFORM' as const;

export default function PlatformDashboardPage() {
  const { data: resellers = [] } = useQuery({
    queryKey: ['resellers'],
    queryFn: () => mockAccounts.getResellers(),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients', resellers],
    queryFn: async () => {
      const allClients = resellers.flatMap((r: any) => r.clients || []);
      return allClients;
    },
    enabled: resellers.length > 0,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: () => mockSms.list(wecallMockData.resellers[0]?.clients[0]?.account_sid),
  });

  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => mockBilling.wallet('AC_RESELLER_1001'),
  });

  const totalMessages = messages.length;
  const deliveredMessages = messages.filter((m: any) => m.status === 'delivered').length;
  const successRate = totalMessages > 0 ? ((deliveredMessages / totalMessages) * 100).toFixed(1) : '0';

  const statsSection = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <RoleStatCard
        title="Total Clients"
        value={clients.length}
        icon={<Users className="w-5 h-5" />}
        color="text-blue-600"
        role={ROLE}
      />
      <RoleStatCard
        title="Messages Sent"
        value={totalMessages}
        icon={<MessageSquare className="w-5 h-5" />}
        color="text-purple-600"
        role={ROLE}
      />
      <RoleStatCard
        title="Success Rate"
        value={successRate}
        unit="%"
        icon={<TrendingUp className="w-5 h-5" />}
        color="text-green-600"
        role={ROLE}
      />
      <RoleStatCard
        title="Platform Balance"
        value={`$${wallet?.balance?.toFixed(2) || '0.00'}`}
        icon={<DollarSign className="w-5 h-5" />}
        color="text-emerald-600"
        role={ROLE}
      />
    </div>
  );

  const bottomSection = (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <RecentMessagesList messages={messages} isLoading={messagesLoading} />
      </div>
      <RoleActions role={ROLE} />
    </div>
  );

  return (
    <RoleBasedLayout
      title="Platform Dashboard"
      subtitle="Monitor all resellers and clients activity"
      role={ROLE}
      topSection={statsSection}
      bottomSection={bottomSection}
    />
  );
}
