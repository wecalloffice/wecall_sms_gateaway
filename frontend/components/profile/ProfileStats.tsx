"use client";

import { Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Props {
  profile: any;
  stats: any;
}

export function ProfileStats({ profile, stats }: Props) {
  const Stat = ({ label, value, extra, icon }: any) => (
    <Card className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {extra && <p className="text-sm text-gray-500 mt-1">{extra}</p>}
        </div>
        {icon}
      </div>
    </Card>
  );

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Stat
        label="Account Status"
        value={profile.account_status}
        extra={`Member since ${new Date(profile.created_at).toLocaleDateString()}`}
        icon={<Shield size={28} className="text-green-600" />}
      />
      <Stat
        label="Total SMS Sent"
        value={stats?.total_sms_sent.toLocaleString()}
        extra={`Total cost: $${stats?.total_cost.toFixed(2)}`}
        icon={<Shield size={28} className="text-blue-600" />}
      />
      <Stat
        label="Account Balance"
        value={`$${stats?.account_balance.toFixed(2)}`}
        extra="Available balance"
        icon={<Shield size={28} className="text-green-600" />}
      />
    </div>
  );
}
