"use client";

import React from "react";
import type { UsageMetrics } from "../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type UsageAnalyticsProps = {
  metrics: UsageMetrics | null;
  loading?: boolean;
};

export const UsageAnalytics: React.FC<UsageAnalyticsProps> = ({
  metrics,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg bg-gray-200"
          />
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-500">No usage data available</p>
      </Card>
    );
  }

  // KPI cards
  const safeNum = (n: any, fallback = 0) => {
    const parsed = typeof n === "number" && !Number.isNaN(n) ? n : Number(n);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const kpis = [
    {
      label: "Messages Sent",
      value: safeNum(metrics.total_messages_sent).toLocaleString(),
      color: "blue",
    },
    {
      label: "Delivered",
      value: safeNum(metrics.total_messages_delivered).toLocaleString(),
      color: "green",
    },
    {
      label: "Failed",
      value: safeNum(metrics.total_messages_failed).toLocaleString(),
      color: "red",
    },
    {
      label: "Success Rate",
      value: `${(safeNum(metrics.success_rate) * 100).toFixed(2)}%`,
      color: "purple",
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
    purple: "text-purple-600 bg-purple-50",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Usage Analytics</h2>
        <p className="text-sm text-gray-600">
          Period: {metrics.period.replace(/_/g, " ")}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{kpi.label}</p>
              <p className={`text-2xl font-bold ${colorClasses[kpi.color]}`}>
                {kpi.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Cost Summary */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Cost Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Cost:</span>
            <span className="font-bold text-gray-900">
              ${safeNum(metrics.total_cost).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Average per SMS:</span>
            <span className="font-bold text-gray-900">
              ${safeNum(metrics.average_cost_per_message).toFixed(6)}
            </span>
          </div>
        </div>
      </Card>

      {/* Top Countries */}
      {metrics.top_countries && metrics.top_countries.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Top Countries
          </h3>
          <div className="space-y-3">
            {metrics.top_countries.map((country) => (
              <div key={country.country_code} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">
                    {country.country_name} ({country.country_code})
                  </span>
                  <span className="text-gray-600">
                    {safeNum(country.messages_sent).toLocaleString()} messages
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Cost:</span>
                  <span className="font-semibold text-gray-900">
                    ${safeNum(country.cost).toFixed(2)}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${Math.min(
                        metrics.total_cost
                          ? (safeNum(country.cost) / safeNum(metrics.total_cost)) * 100
                          : 0,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Top Operators */}
      {metrics.top_operators && metrics.top_operators.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Top Operators
          </h3>
          <div className="space-y-3">
            {metrics.top_operators.map((op) => (
              <div key={`${op.operator}-${op.country}`} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">
                    {op.operator} ({op.country})
                  </span>
                  <span className="text-gray-600">
                    {safeNum(op.messages_sent).toLocaleString()} messages
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Cost:</span>
                  <span className="font-semibold text-gray-900">
                    ${safeNum(op.cost).toFixed(2)}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-green-600"
                    style={{
                      width: `${Math.min(
                        metrics.total_cost
                          ? (safeNum(op.cost) / safeNum(metrics.total_cost)) * 100
                          : 0,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
