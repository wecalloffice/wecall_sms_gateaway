"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, CheckCircle, XCircle, Clock } from "lucide-react";

export function DlrStats({ stats }: any) {
  const statItems = [
    {
      label: "Total Messages",
      value: stats.total,
      icon: <MessageSquare size={32} className="text-primary" />,
    },
    {
      label: "Delivered",
      value: stats.delivered,
      color: "text-green-600",
      percent: stats.total ? ((stats.delivered / stats.total) * 100).toFixed(1) : 0,
      icon: <CheckCircle size={32} className="text-green-600" />,
    },
    {
      label: "Failed",
      value: stats.failed,
      color: "text-red-600",
      percent: stats.total ? ((stats.failed / stats.total) * 100).toFixed(1) : 0,
      icon: <XCircle size={32} className="text-red-600" />,
    },
    {
      label: "Pending",
      value: stats.queued,
      color: "text-yellow-600",
      percent: stats.total ? ((stats.queued / stats.total) * 100).toFixed(1) : 0,
      icon: <Clock size={32} className="text-yellow-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statItems.map((item, i) => (
        <Card key={i}>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                {item.percent && (
                  <p className="text-xs text-gray-500 mt-1">{item.percent}%</p>
                )}
              </div>
              {item.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
