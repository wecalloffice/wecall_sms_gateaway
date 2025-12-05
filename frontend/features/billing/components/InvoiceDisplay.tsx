"use client";

import React from "react";
import type { Invoice } from "../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type InvoiceDisplayProps = {
  invoice: Invoice | null;
  loading?: boolean;
};

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  SENT: "bg-blue-100 text-blue-800",
  PAID: "bg-green-100 text-green-800",
  OVERDUE: "bg-red-100 text-red-800",
  CANCELLED: "bg-yellow-100 text-yellow-800",
};

export const InvoiceDisplay: React.FC<InvoiceDisplayProps> = ({
  invoice,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No invoice found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Invoice</h2>
            <p className="text-sm text-gray-600">{invoice.invoice_number}</p>
          </div>
          <Badge className={`px-4 py-2 ${statusColors[invoice.status]}`}>
            {invoice.status}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Dates */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Period</p>
            <p className="text-gray-900">
              {new Date(invoice.period_start).toLocaleDateString()} -{" "}
              {new Date(invoice.period_end).toLocaleDateString()}
            </p>
          </div>

          {/* Due date */}
          {invoice.due_date && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Due Date</p>
              <p className="text-gray-900">
                {new Date(invoice.due_date).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Paid date */}
          {invoice.paid_date && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Paid Date</p>
              <p className="text-gray-900">
                {new Date(invoice.paid_date).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Created */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Created</p>
            <p className="text-gray-900">
              {new Date(invoice.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Line Items */}
      <Card className="overflow-hidden">
        <div className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Line Items
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-900">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.line_items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">
                          {item.description}
                        </p>
                        <Badge className="w-fit bg-gray-100 text-gray-800">
                          {item.category}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {item.quantity.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      ${item.unit_price.toFixed(6)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">
                      ${item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="mt-6 flex justify-end">
            <div className="w-full space-y-2 sm:w-64">
              <div className="flex justify-between border-t-2 border-gray-900 pt-4">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${invoice.total_amount.toFixed(2)} {invoice.currency}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Download PDF
        </button>
        <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Email Invoice
        </button>
      </div>
    </div>
  );
};
