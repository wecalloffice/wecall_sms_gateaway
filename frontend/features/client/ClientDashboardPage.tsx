'use client';

import { useQuery } from '@tanstack/react-query';
import { RoleBasedLayout } from '@/components/platform/RoleBasedLayout';
import { RoleStatCard } from '@/components/platform/RoleStatCard';
import { RoleActions } from '@/components/platform/RoleActions';
import { RecentMessagesList } from '@/components/platform/RecentMessagesList';
import { mockSms } from '@/mocks/adapters/mockSms';
import { mockBilling } from '@/mocks/adapters/mockBilling';
import { MessageSquare, DollarSign, TrendingUp, Wallet } from 'lucide-react';

const CLIENT_SID = 'AC_CLIENT_2001';
const ROLE = 'CLIENT' as const;

export function ClientDashboardPage() {
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', CLIENT_SID],
    queryFn: () => mockSms.list(CLIENT_SID),
  });

  const { data: wallet } = useQuery({
    queryKey: ['wallet', CLIENT_SID],
    queryFn: () => mockBilling.wallet(CLIENT_SID),
  });

  const totalMessages = messages.length;
  const deliveredMessages = messages.filter((m: any) => m.status === 'delivered').length;
  const failedMessages = messages.filter((m: any) => m.status === 'failed').length;
  const successRate = totalMessages > 0 ? ((deliveredMessages / totalMessages) * 100).toFixed(1) : '0';

  const statsSection = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <RoleStatCard
        title="Messages Sent"
        value={totalMessages}
        icon={<MessageSquare className="w-5 h-5" />}
        color="text-blue-600"
        role={ROLE}
      />
      <RoleStatCard
        title="Delivered"
        value={deliveredMessages}
        icon={<TrendingUp className="w-5 h-5" />}
        color="text-green-600"
        role={ROLE}
      />
      <RoleStatCard
        title="Failed"
        value={failedMessages}
        icon={<MessageSquare className="w-5 h-5" />}
        color="text-red-600"
        role={ROLE}
      />
      <RoleStatCard
        title="Wallet Balance"
        value={`$${wallet?.balance?.toFixed(2) || '0.00'}`}
        icon={<Wallet className="w-5 h-5" />}
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
      title="Dashboard"
      subtitle="Welcome back! Here's your SMS overview"
      role={ROLE}
      topSection={statsSection}
      bottomSection={bottomSection}
    />
  );
}
