"use client";

import { Wallet, DollarSign, TrendingDown, ArrowUpRight } from "lucide-react";

interface Props {
  balance: number;
  transactions: any[];
}

export function WalletStats({ balance, transactions }: Props) {
  const items = [
    { label: "Current Balance", value: `$${balance.toFixed(2)}`, icon: <Wallet size={32} className="text-primary" /> },
    { label: "Total Spent", value: "$234.50", icon: <TrendingDown size={32} className="text-red-600" /> },
    { label: "This Month", value: "$89.00", icon: <DollarSign size={32} className="text-blue-600" /> },
    { label: "Transactions", value: transactions.length, icon: <ArrowUpRight size={32} className="text-green-600" /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {items.map(item => (
        <div key={item.label} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow border border-gray-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
            </div>
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
