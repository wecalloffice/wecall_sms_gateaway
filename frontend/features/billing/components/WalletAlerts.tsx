"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import type { Wallet } from "../types";

interface WalletAlertsProps {
  businessId: string;
  wallet: Wallet | null;
  lowBalanceThreshold?: number;
}

export default function WalletAlerts({ businessId, wallet, lowBalanceThreshold = 50 }: WalletAlertsProps) {
  const [alerts, setAlerts] = useState<Array<{ id: string; type: "warning" | "info" | "critical"; message: string }>>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newAlerts: typeof alerts = [];

    if (!wallet) {
      newAlerts.push({
        id: "no-wallet",
        type: "warning",
        message: "No wallet found. Click 'Create Wallet' to get started.",
      });
    } else {
      const balance = parseFloat(wallet.balance || "0");

      // Critical alert: near zero
      if (balance < 10) {
        newAlerts.push({
          id: "critical-balance",
          type: "critical",
          message: `Critical: Wallet balance is critically low ($${balance.toFixed(2)}). Top up immediately to avoid service interruption.`,
        });
      }
      // Warning alert: below threshold
      else if (balance < lowBalanceThreshold) {
        newAlerts.push({
          id: "low-balance",
          type: "warning",
          message: `Warning: Wallet balance is low ($${balance.toFixed(2)}). Consider topping up to continue SMS operations.`,
        });
      }
      // Info: healthy balance
      else {
        newAlerts.push({
          id: "healthy-balance",
          type: "info",
          message: `✓ Wallet is healthy with $${balance.toFixed(2)} available balance.`,
        });
      }
    }

    setAlerts(newAlerts);
  }, [wallet, lowBalanceThreshold]);

  const visibleAlerts = alerts.filter((a) => !dismissedAlerts.has(a.id));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {visibleAlerts.map((alert) => {
        const bgColor =
          alert.type === "critical"
            ? "bg-red-50 border-red-300"
            : alert.type === "warning"
            ? "bg-yellow-50 border-yellow-300"
            : "bg-green-50 border-green-300";

        const textColor =
          alert.type === "critical"
            ? "text-red-800"
            : alert.type === "warning"
            ? "text-yellow-800"
            : "text-green-800";

        const iconBg =
          alert.type === "critical"
            ? "bg-red-200"
            : alert.type === "warning"
            ? "bg-yellow-200"
            : "bg-green-200";

        return (
          <Card key={alert.id} className={`p-4 border-l-4 ${bgColor} ${textColor}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`${iconBg} rounded-full p-2 text-lg flex-shrink-0 mt-0.5`}
                >
                  {alert.type === "critical" ? "⚠️" : alert.type === "warning" ? "⚡" : "✓"}
                </div>
                <div>
                  <p className="font-medium text-sm">{alert.message}</p>
                </div>
              </div>
              <button
                onClick={() => setDismissedAlerts(new Set([...dismissedAlerts, alert.id]))}
                className="text-gray-500 hover:text-gray-700 text-lg flex-shrink-0"
              >
                ✕
              </button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
