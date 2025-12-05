"use client";

import { Tag, Check } from "lucide-react";

interface Props {
  senderIds: { id: number; name: string; status: string }[];
}

export function SenderIdsStats({ senderIds }: Props) {
  const approvedCount = senderIds.filter(s => s.status === "approved").length;
  const pendingCount = senderIds.filter(s => s.status === "pending").length;

  const stats = [
    { label: "Total Sender IDs", value: senderIds.length, icon: <Tag size={32} className="text-primary" /> },
    { label: "Approved", value: approvedCount, icon: <Check size={32} className="text-green-600" /> },
    { label: "Pending", value: pendingCount, icon: <Tag size={32} className="text-yellow-600" /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
