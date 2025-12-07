"use client";

import { CheckCircle, AlertCircle, Clock, MessageSquare } from "lucide-react";

interface Props {
  messages: any[];
}

export function SmsStats({ messages }: Props) {
  const stats = {
    total: messages.length,
    delivered: messages.filter((m) => m.status === "delivered").length,
    failed: messages.filter((m) => m.status === "failed").length,
    queued: messages.filter((m) => m.status === "queued" || m.status === "sent").length,
  };

  const items = [
    { label: "Total Sent", value: stats.total, icon: <MessageSquare size={32} className="text-primary" /> },
    { label: "Delivered", value: stats.delivered, icon: <CheckCircle size={32} className="text-green-600" /> },
    { label: "Failed", value: stats.failed, icon: <AlertCircle size={32} className="text-red-600" /> },
    { label: "Pending", value: stats.queued, icon: <Clock size={32} className="text-yellow-600" /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {items.map((item) => (
        <div key={item.label} className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
