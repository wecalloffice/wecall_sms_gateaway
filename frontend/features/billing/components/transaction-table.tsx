<<<<<<< HEAD
'use client';

// Transaction table component
export default function TransactionTable() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Add transaction table here */}
    </div>
  );
}
=======
// features/billing/components/transaction-table.tsx
"use client";

import React from "react";
import type { BillingTransaction } from "../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type TransactionTableProps = {
  transactions: BillingTransaction[] | null;
  loading: boolean;
  smsStats?: { totalMessages: number; totalCost: number };
};

const typeColors: Record<string, string> = {
  TOPUP: "bg-green-100 text-green-800",
  SMS_DEBIT: "bg-red-100 text-red-800",
  INVOICE_PAYMENT: "bg-blue-100 text-blue-800",
  CREDIT_ADJUSTMENT: "bg-purple-100 text-purple-800",
  REFUND: "bg-yellow-100 text-yellow-800",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  loading,
  smsStats,
}) => {
  return (
    <Card className="p-6">
      <div className="mb-4 space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Transactions
        </h3>
        {smsStats && (
          <p className="text-xs text-gray-500">
            {smsStats.totalMessages.toLocaleString()} messages | $
            {smsStats.totalCost.toFixed(2)} this month
          </p>
        )}
      </div>

      {loading && (
        <p className="text-sm text-gray-500">Loading transactions...</p>
      )}

      {!loading && (!transactions || transactions.length === 0) && (
        <p className="text-sm text-gray-500">No transactions yet.</p>
      )}

      {!loading && transactions && transactions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Type
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-900">
                  Amount
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">
                  Details
                </th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 20).map((tx) => (
                <tr key={tx.sid} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(tx.created_at).toLocaleDateString()}{" "}
                    <span className="text-gray-400">
                      {new Date(tx.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={typeColors[tx.type] || "bg-gray-100 text-gray-800"}>
                      {tx.type.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    <span className={tx.amount < 0 ? "text-red-600" : "text-green-600"}>
                      {tx.amount < 0 ? "-" : "+"}$
                      {Math.abs(tx.amount).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="space-y-1">
                      {tx.type === "SMS_DEBIT" && tx.details?.messages && (
                        <div>
                          <p className="font-medium text-gray-900">
                            {tx.details.messages.toLocaleString()} SMS
                          </p>
                          {tx.details.price_per_sms && (
                            <p className="text-xs text-gray-500">
                              @ ${tx.details.price_per_sms.toFixed(6)}/SMS
                            </p>
                          )}
                        </div>
                      )}
                      {tx.type === "TOPUP" && tx.reference && (
                        <p>{tx.reference}</p>
                      )}
                      {tx.reference && tx.type !== "TOPUP" && (
                        <p className="text-xs text-gray-500">{tx.reference}</p>
                      )}
                      {!tx.details && !tx.reference && (
                        <p className="text-gray-400">—</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      className={
                        statusColors[tx.status || "COMPLETED"] ||
                        "bg-gray-100 text-gray-800"
                      }
                    >
                      {tx.status || "COMPLETED"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transactions.length > 20 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing 20 of {transactions.length} transactions
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
>>>>>>> 32926c17412e5c66b621e64be523f88c89ad76e7
