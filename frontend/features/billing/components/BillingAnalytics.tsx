"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Transaction } from "../types";

interface BillingAnalyticsProps {
  businessId: string;
}

export default function BillingAnalytics({ businessId }: BillingAnalyticsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/billing/transactions/${businessId}?limit=200`);
        if (!res.ok) throw new Error("Failed to load transactions");
        const data = await res.json();
        setTransactions(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [businessId]);

  if (loading) return <p className="text-gray-600">Loading analytics...</p>;

  // Prepare data for charts
  const dailyData = transactions.reduce(
    (acc, tx) => {
      const date = new Date(tx.createdAt).toLocaleDateString();
      const existing = acc.find((d) => d.date === date);
      if (existing) {
        if (tx.type === "TOP_UP") existing.topup += parseFloat(tx.amount);
        else if (tx.type === "SMS_DEBIT") existing.debit += Math.abs(parseFloat(tx.amount));
      } else {
        acc.push({
          date,
          topup: tx.type === "TOP_UP" ? parseFloat(tx.amount) : 0,
          debit: tx.type === "SMS_DEBIT" ? Math.abs(parseFloat(tx.amount)) : 0,
        });
      }
      return acc;
    },
    [] as Array<{ date: string; topup: number; debit: number }>
  );

  const typeBreakdown = [
    {
      name: "Top-ups",
      value: transactions
        .filter((t) => t.type === "TOP_UP")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0),
    },
    {
      name: "SMS Debits",
      value: transactions
        .filter((t) => t.type === "SMS_DEBIT")
        .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0),
    },
  ];

  const totalTopup = typeBreakdown[0].value;
  const totalDebit = typeBreakdown[1].value;
  const netBalance = totalTopup - totalDebit;

  const COLORS = ["#10b981", "#ef4444"];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <h3 className="text-sm font-medium text-gray-700">Total Top-ups</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">${totalTopup.toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-1">{transactions.filter((t) => t.type === "TOP_UP").length} transactions</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <h3 className="text-sm font-medium text-gray-700">Total SMS Debits</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">${totalDebit.toFixed(2)}</p>
          <p className="text-xs text-gray-600 mt-1">{transactions.filter((t) => t.type === "SMS_DEBIT").length} transactions</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <h3 className="text-sm font-medium text-gray-700">Net Balance Impact</h3>
          <p className={`text-3xl font-bold mt-2 ${netBalance >= 0 ? "text-blue-600" : "text-red-600"}`}>
            ${netBalance.toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 mt-1">Period balance</p>
        </Card>
      </div>

      {/* Daily Trend */}
      {dailyData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Daily Transaction Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="topup" stroke="#10b981" name="Top-ups" />
              <Line type="monotone" dataKey="debit" stroke="#ef4444" name="SMS Debits" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Transaction Type Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Transaction Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={typeBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: $${value.toFixed(2)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Transaction Count by Type */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Transaction Count</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                { type: "Top-ups", count: transactions.filter((t) => t.type === "TOP_UP").length },
                { type: "SMS Debits", count: transactions.filter((t) => t.type === "SMS_DEBIT").length },
                { type: "Adjustments", count: transactions.filter((t) => t.type === "ADJUSTMENT").length },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Transaction Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-800">{transactions.length}</p>
          </div>
          <div>
            <p className="text-gray-600">Avg Top-up Amount</p>
            <p className="text-2xl font-bold text-green-600">
              ${(
                transactions
                  .filter((t) => t.type === "TOP_UP")
                  .reduce((sum, t) => sum + parseFloat(t.amount), 0) /
                (transactions.filter((t) => t.type === "TOP_UP").length || 1)
              ).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Avg SMS Debit</p>
            <p className="text-2xl font-bold text-red-600">
              ${(
                transactions
                  .filter((t) => t.type === "SMS_DEBIT")
                  .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0) /
                (transactions.filter((t) => t.type === "SMS_DEBIT").length || 1)
              ).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">SMS to Top-up Ratio</p>
            <p className="text-2xl font-bold text-blue-600">{(totalDebit / (totalTopup || 1)).toFixed(2)}x</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
