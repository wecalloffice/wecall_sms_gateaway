'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/platform/DashboardHeader';
import { StatCard } from '@/components/platform/StatCard';
import { RecentMessagesList } from '@/components/platform/RecentMessagesList';
import { QuickActions } from '@/components/platform/QuickActions';
import { mockSms } from '@/mocks/adapters/mockSms';
import { mockBilling } from '@/mocks/adapters/mockBilling';
import { MessageSquare, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

const CLIENT_SID = 'AC_CLIENT_2001';

export function ClientContactsPage() {
  const { data: messages = [] } = useQuery({
    queryKey: ['messages', CLIENT_SID],
    queryFn: () => mockSms.list(CLIENT_SID),
  });

  const totalContacts = 245;
  const activeGroups = 12;

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Contacts & Groups"
        subtitle="Manage your contact list and groups"
        showAddButton={true}
        onAddClick={() => console.log('Add contact')}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Contacts"
          value={totalContacts}
          icon={<MessageSquare className="w-5 h-5" />}
          color="text-blue-600"
        />
        <StatCard
          title="Active Groups"
          value={activeGroups}
          icon={<TrendingUp className="w-5 h-5" />}
          color="text-purple-600"
        />
        <StatCard
          title="Last Updated"
          value="Today"
          icon={<AlertCircle className="w-5 h-5" />}
          color="text-green-600"
        />
      </div>

      <RecentMessagesList messages={messages} />
    </div>
  );
}
