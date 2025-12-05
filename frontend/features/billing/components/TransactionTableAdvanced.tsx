"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Transaction } from "../types";

interface TransactionTableProps {
  businessId: string;
}

export default function TransactionTable({ businessId }: TransactionTableProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [searchAmount, setSearchAmount] = useState<string>("");

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await fetch(`/api/billing/transactions/${businessId}?limit=100`);
        if (!res.ok) throw new Error("Failed to load transactions");
        const data = await res.json();
        setTransactions(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, [businessId]);

  // Apply filters
  const filteredTransactions = transactions.filter((t) => {
    if (typeFilter !== "ALL" && t.type !== typeFilter) return false;
    if (dateFrom && new Date(t.createdAt) < new Date(dateFrom)) return false;
    if (dateTo && new Date(t.createdAt) > new Date(dateTo)) return false;
    if (searchAmount && !t.amount.includes(searchAmount)) return false;
    return true;
  });

  function exportToCSV() {
    const headers = ["Date", "Type", "Amount", "Balance After", "Description"];
    const rows = filteredTransactions.map((t) => [
      new Date(t.createdAt).toLocaleString(),
      t.type,
      t.amount,
      t.balanceAfter,
      t.description || "",
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${businessId}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <p className="text-gray-600">Loading transactions...</p>;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Transaction History</h2>
        <Button
          onClick={exportToCSV}
          variant="outline"
          className="text-xs"
          disabled={filteredTransactions.length === 0}
        >
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded border border-gray-200">
        {/* Type Filter */}
        <div>
          <Label className="text-xs font-medium">Type</Label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm mt-1"
          >
            <option value="ALL">All Types</option>
            <option value="TOP_UP">Top Up</option>
            <option value="SMS_DEBIT">SMS Debit</option>
            <option value="ADJUSTMENT">Adjustment</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <Label className="text-xs font-medium">From Date</Label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="text-sm mt-1"
          />
        </div>

        {/* Date To */}
        <div>
          <Label className="text-xs font-medium">To Date</Label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="text-sm mt-1"
          />
        </div>

        {/* Amount Search */}
        <div>
          <Label className="text-xs font-medium">Amount (contains)</Label>
          <Input
            type="text"
            placeholder="e.g., 50.25"
            value={searchAmount}
            onChange={(e) => setSearchAmount(e.target.value)}
            className="text-sm mt-1"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No transactions found</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left p-3 font-medium">Date & Time</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-right p-3 font-medium">Amount</th>
                <th className="text-right p-3 font-medium">Balance After</th>
                <th className="text-left p-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-xs text-gray-600">
                    {new Date(t.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        t.type === "TOP_UP"
                          ? "bg-green-100 text-green-800"
                          : t.type === "SMS_DEBIT"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="p-3 text-right font-semibold">{t.amount}</td>
                  <td className="p-3 text-right font-semibold">{t.balanceAfter}</td>
                  <td className="p-3 text-gray-600">{t.description || "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t text-xs text-gray-600">
        <p>Showing {filteredTransactions.length} of {transactions.length} transactions</p>
      </div>
    </Card>
  );
}
