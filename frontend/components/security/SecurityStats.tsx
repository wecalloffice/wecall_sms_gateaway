"use client";

import { Shield, Lock, Key } from "lucide-react";

export function SecurityStats() {
  const stats = [
    { label: "Active Sessions", value: 2, icon: <Shield size={32} className="text-primary" /> },
    { label: "2FA Enabled", value: "No", icon: <Lock size={32} className="text-red-600" /> },
    { label: "API Keys", value: 1, icon: <Key size={32} className="text-blue-600" /> },
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
