"use client";

import React, { useState, useMemo } from "react";
import { useWallet, useTransactions, useTopUpWallet, useUsageMetrics, usePricingPlans, useBillingAlerts } from "../hooks";
import { WalletCard } from "./wallet-card";
import { TransactionTable } from "./transaction-table";
import { UsageAnalytics } from "./UsageAnalytics";
import { PricingDisplay } from "./PricingDisplay";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ClientBillingDashboardProps = {
  businessSid: string;
};

export const ClientBillingDashboard: React.FC<ClientBillingDashboardProps> = ({
  businessSid,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<"TODAY" | "THIS_WEEK" | "THIS_MONTH">("THIS_MONTH");
  const [topupAmount, setTopupAmount] = useState<string>("");

  // Wallet
  const {
    wallet,
    loading: walletLoading,
    error: walletError,
    refresh: refreshWallet,
  } = useWallet(businessSid);

  // Transactions
  const {
    transactions,
    loading: txLoading,
    error: txError,
    refresh: refreshTx,
  } = useTransactions(businessSid, 30);

  // Top up
  const {
    mutate: topUp,
    loading: topUpLoading,
    error: topUpError,
  } = useTopUpWallet(businessSid);

  // Usage metrics
  const {
    metrics,
    loading: metricsLoading,
    error: metricsError,
  } = useUsageMetrics(businessSid, selectedPeriod);

  // Pricing plans
  const {
    plans,
    loading: plansLoading,
    error: plansError,
  } = usePricingPlans();

  // Billing alerts
  const {
    alerts,
    loading: alertsLoading,
  } = useBillingAlerts(businessSid);

  const [topupSuccess, setTopupSuccess] = useState<string | null>(null);

  const handleTopUp = async () => {
    const amount = parseFloat(topupAmount);
    if (isNaN(amount) || amount <= 0) return;

    setTopupSuccess(null);
    const updated = await topUp(amount, "CLIENT_TOPUP");
    if (updated) {
      setTopupSuccess(`Successfully topped up by $${amount.toFixed(2)}`);
      setTopupAmount("");
      refreshWallet();
      refreshTx();
    }
  };

  const hasErrors = walletError || txError || topUpError || metricsError || plansError;

  return (
    <div className="space-y-6 pb-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing & Usage</h1>
        <p className="text-gray-600">Manage your account balance and monitor SMS usage</p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.sid}
              className={`rounded-lg border px-4 py-3 text-sm ${
                alert.severity === "CRITICAL"
                  ? "border-red-300 bg-red-50 text-red-800"
                  : "border-yellow-300 bg-yellow-50 text-yellow-800"
              }`}
            >
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* Global error */}
      {hasErrors && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {walletError || txError || topUpError || metricsError || plansError}
        </div>
      )}

      {/* Success message */}
      {topupSuccess && (
        <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
          {topupSuccess}
        </div>
      )}

      {/* Main grid: Wallet + Recent transactions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Wallet card */}
        <div className="lg:col-span-1">
          <WalletCard
            wallet={wallet}
            loading={walletLoading}
            onTopUp={handleTopUp}
            topUpLoading={topUpLoading}
            onAmountChange={(amount) => setTopupAmount(amount)}
            topupAmount={topupAmount}
          />

          {/* Quick info */}
          {wallet && (
            <Card className="mt-4 p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Account Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Auto Recharge:</span>
                  <Badge
                    className={wallet.auto_recharge_enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {wallet.auto_recharge_enabled ? "ON" : "OFF"}
                  </Badge>
                </div>
                {wallet.auto_recharge_enabled && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Threshold:</span>
                      <span className="text-gray-900">
                        ${wallet.auto_recharge_threshold?.toFixed(2) ?? "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="text-gray-900">
                        ${wallet.auto_recharge_amount?.toFixed(2) ?? "0.00"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Right: Transactions */}
        <div className="lg:col-span-2">
          <TransactionTable
            transactions={transactions}
            loading={txLoading}
          />
        </div>
      </div>

      {/* Usage Analytics Section */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Usage Analytics</h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="TODAY">Today</option>
            <option value="THIS_WEEK">This Week</option>
            <option value="THIS_MONTH">This Month</option>
          </select>
        </div>
        <UsageAnalytics metrics={metrics} loading={metricsLoading} />
      </Card>

      {/* Pricing Plans */}
      <Card className="p-6">
        <PricingDisplay plans={plans} loading={plansLoading} />
      </Card>
    </div>
  );
};
