"use client";

import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/StatCard";
import DashboardHeader from "@/components/DashboardHeader";
import RecentMessagesList from "@/components/RecentMessagesList";
import QuickActions from "@/components/QuickActions";
import { MessageSquare, Wallet, Activity, Clock } from "lucide-react";
import { mockSms } from "@/mocks/adapters/mockSms";

export default function ClientDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["client-dashboard"],
    queryFn: async () => {
      const client = {
        name: "Acme Corp",
        account_sid: "AC12345",
        sms_usage: {
          today_outbound: 120,
          success_rate: 0.94,
          this_month_outbound: 3200,
        },
        billing: {
          wallet_balance: 1250.5,
          credit_limit: 5000,
        },
      };

      const messages = await mockSms.list({ business_sid: client.account_sid });

      return { client, messages: messages.slice(0, 5) };
    },
  });

  if (isLoading) {
    return (
      <MainLayout role="CLIENT_ADMIN" businessName="Loading..." userName="...">
        <div className="flex justify-center items-center h-full">
          <p>Loading dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  const { client, messages } = data || {};

  return (
    <MainLayout
      role="CLIENT_ADMIN"
      businessName={client?.name || "Client"}
      userName="Alice"
    >
      <div className="space-y-6">
        <DashboardHeader title="Client Dashboard" subtitle="Send SMS & manage your account" />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<MessageSquare size={24} />}
            label="Messages Sent Today"
            value={client?.sms_usage.today_outbound ?? 0}
            change="+500 from yesterday"
          />
          <StatCard
            icon={<Activity size={24} />}
            label="Success Rate"
            value={`${((client?.sms_usage.success_rate ?? 0) * 100).toFixed(1)}%`}
            change="Last 24 hours"
          />
          <StatCard
            icon={<Wallet size={24} />}
            label="Account Balance"
            value={`$${(client?.billing.wallet_balance ?? 0).toFixed(2)}`}
            change={`Credit limit: $${client?.billing.credit_limit ?? 0}`}
          />
          <StatCard
            icon={<Clock size={24} />}
            label="Messages This Month"
            value={client?.sms_usage.this_month_outbound ?? 0}
            change="+5K from last month"
          />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentMessagesList messages={messages ?? []} />
          </div>

          <QuickActions />
        </div>
      </div>
    </MainLayout>
  );
}
