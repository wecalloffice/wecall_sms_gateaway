"use client";

import React, { useState, useMemo } from "react";
import { useWallet, useTransactions, useBillingAlerts } from "../hooks";
import { WalletCard } from "./wallet-card";
import { TransactionTable } from "./transaction-table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ResellerBillingDashboardProps = {
  businessSid: string;
};

// Mock client data for reseller
const mockClients = [
  {
    account_sid: "AC_CLIENT_2001",
    name: "Rwanda Development Board",
    status: "active",
    balance: 350.75,
    credit_limit: 500,
    monthly_volume: 48000,
    monthly_cost: 432.0,
    margin_percentage: 25,
  },
  {
    account_sid: "AC_CLIENT_2002",
    name: "I&M Holdings",
    status: "active",
    balance: 90.0,
    credit_limit: 200,
    monthly_volume: 15000,
    monthly_cost: 135.0,
    margin_percentage: 30,
  },
  {
    account_sid: "",
    name: "Tech Startup Ltd",
    status: "suspended",
    balance: 0,
    credit_limit: 100,
    monthly_volume: 5000,
    monthly_cost: 45.0,
    margin_percentage: 25,
  },
];

export const ResellerBillingDashboard: React.FC<ResellerBillingDashboardProps> = ({
  businessSid,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "clients" | "margin">("overview");
  const [topupAmount, setTopupAmount] = useState<string>("");

  // Reseller wallet
  const {
    wallet,
    loading: walletLoading,
    error: walletError,
    refresh: refreshWallet,
  } = useWallet(businessSid);

  // Reseller transactions
  const {
    transactions,
    loading: txLoading,
    error: txError,
    refresh: refreshTx,
  } = useTransactions(businessSid, 30);

  // Reseller alerts
  const {
    alerts,
  } = useBillingAlerts(businessSid);

  // Calculate reseller metrics
  const metrics = useMemo(() => {
    const totalClientBalance = mockClients.reduce((sum, c) => sum + c.balance, 0);
    const totalMonthlyVolume = mockClients.reduce((sum, c) => sum + c.monthly_volume, 0);
    const totalMonthlyClientCost = mockClients.reduce((sum, c) => sum + c.monthly_cost, 0);
    const totalMarginIncome = mockClients.reduce((sum, c) => {
      const marginPercentage = c.margin_percentage / 100;
      return sum + c.monthly_cost * marginPercentage;
    }, 0);
    const activeClients = mockClients.filter((c) => c.status === "active").length;

    return {
      totalClientBalance,
      totalMonthlyVolume,
      totalMonthlyClientCost,
      totalMarginIncome,
      activeClients,
      totalClients: mockClients.length,
    };
  }, []);

  const [topupSuccess, setTopupSuccess] = useState<string | null>(null);

  const handleTopUp = async () => {
    const amount = parseFloat(topupAmount);
    if (isNaN(amount) || amount <= 0) return;

    setTopupSuccess(`Successfully topped up by $${amount.toFixed(2)}`);
    setTopupAmount("");
    refreshWallet();
    refreshTx();
  };

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: "📊" },
    { id: "clients" as const, label: "Clients", icon: "👥" },
    { id: "margin" as const, label: "Margins & Pricing", icon: "💹" },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reseller Dashboard</h1>
        <p className="text-gray-600">Manage your clients, balance, and margins</p>
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

      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4 sm:gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Account Balance</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${wallet?.balance.toFixed(2) ?? "0.00"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Credit limit: ${wallet?.credit_limit?.toFixed(2) ?? "0.00"}
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Active Clients</p>
                  <p className="text-3xl font-bold text-gray-900">{metrics.activeClients}</p>
                  <p className="text-xs text-gray-500">
                    Total: {metrics.totalClients} clients
                  </p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {metrics.totalMonthlyVolume.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">messages sent</p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Client Cost</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${metrics.totalMonthlyClientCost.toFixed(2)}
                  </p>
                  <p className="text-xs text-green-600">average per client</p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Margin Income</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${metrics.totalMarginIncome.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">this month</p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Total Client Balance</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${metrics.totalClientBalance.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">across all clients</p>
                </div>
              </Card>
            </div>

            {/* Wallet + Recent transactions */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <WalletCard
                  wallet={wallet}
                  loading={walletLoading}
                  onTopUp={handleTopUp}
                  topUpLoading={false}
                  onAmountChange={(amount) => setTopupAmount(amount)}
                  topupAmount={topupAmount}
                />
              </div>
              <div className="lg:col-span-2">
                <TransactionTable
                  transactions={transactions}
                  loading={txLoading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === "clients" && (
          <Card className="overflow-hidden">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Your Clients</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Business Name
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-900">
                        Balance
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-900">
                        Monthly Volume
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-900">
                        Cost
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockClients.map((client) => (
                      <tr key={client.account_sid} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{client.name}</p>
                          <p className="text-xs text-gray-500">{client.account_sid}</p>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <p className="font-semibold text-gray-900">
                            ${client.balance.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Limit: ${client.credit_limit}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {client.monthly_volume.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                          ${client.monthly_cost.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            className={
                              client.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {client.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        )}

        {/* Margin & Pricing Tab */}
        {activeTab === "margin" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Margin Management</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        Client
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-900">
                        Cost/SMS
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-900">
                        Margin %
                      </th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-900">
                        Monthly Income
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockClients.map((client) => {
                      const costPerSms = client.monthly_volume > 0 ? client.monthly_cost / client.monthly_volume : 0;
                      const marginIncome = (client.margin_percentage / 100) * client.monthly_cost;

                      return (
                        <tr key={client.account_sid} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{client.name}</td>
                          <td className="px-4 py-3 text-right text-gray-600">
                            ${costPerSms.toFixed(6)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-semibold text-blue-600">
                              {client.margin_percentage}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-green-600">
                            ${marginIncome.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              Edit Margin
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Margin Summary */}
            <Card className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Margin Summary</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Total Client Cost</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${metrics.totalMonthlyClientCost.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Your Margin Income</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${metrics.totalMarginIncome.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
