"use client";

import React from 'react';
import { TrendingUp, TrendingDown, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { SmsLogStats } from '../types/logs';

interface SmsLogsStatsProps {
  stats: SmsLogStats;
}

export function SmsLogsStats({ stats }: SmsLogsStatsProps) {
  const statCards = [
    {
      title: 'Total Messages',
      value: stats.total.toLocaleString(),
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Delivered',
      value: stats.delivered.toLocaleString(),
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      subtitle: `${stats.deliveryRate.toFixed(1)}% rate`,
    },
    {
      title: 'Failed',
      value: stats.failed.toLocaleString(),
      icon: <XCircle className="w-6 h-6" />,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      subtitle: `${((stats.failed / stats.total) * 100).toFixed(1)}% rate`,
    },
    {
      title: 'Pending',
      value: stats.pending.toLocaleString(),
      icon: <Clock className="w-6 h-6" />,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Total Cost',
      value: `$${stats.totalCost.toFixed(2)}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      subtitle: `$${(stats.totalCost / stats.total).toFixed(4)} avg`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center ${card.textColor}`}>
              {card.icon}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{card.title}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            {card.subtitle && (
              <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
