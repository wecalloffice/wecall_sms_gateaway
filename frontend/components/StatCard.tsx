"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: number;
  bgColor?: string;
  iconColor?: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  bgColor = "bg-blue-100",
  iconColor = "text-blue-600",
}: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
              {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`${iconColor} w-6 h-6`} />
        </div>
      </div>
    </div>
  );
}
