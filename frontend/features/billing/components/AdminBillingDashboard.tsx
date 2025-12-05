"use client";

import React, { useState } from "react";
import { useWallet, usePricingPlans, useRateCards } from "../hooks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PricingDisplay } from "./PricingDisplay";
import { RateCardsDisplay } from "./RateCardsDisplay";

type AdminBillingDashboardProps = {
  businessSid?: string; // For platform-level admin
};

export const AdminBillingDashboard: React.FC<AdminBillingDashboardProps> = ({
  businessSid,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "pricing" | "rates">("overview");
  const [showPricingForm, setShowPricingForm] = useState(false);
  const [showRateForm, setShowRateForm] = useState(false);

  // Get pricing and rate cards
  const { plans, loading: plansLoading, error: plansError } = usePricingPlans();
  const { rateCards, loading: rateLoading, error: rateError } = useRateCards();

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: "📊" },
    { id: "pricing" as const, label: "Pricing Plans", icon: "💰" },
    { id: "rates" as const, label: "Rate Cards", icon: "📍" },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing Administration</h1>
        <p className="text-gray-600">Manage pricing plans, rate cards, and billing settings</p>
      </div>

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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Total Revenue Card */}
            <Card className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Total Revenue (Monthly)</p>
                <p className="text-3xl font-bold text-gray-900">$24,500</p>
                <p className="text-xs text-green-600">↑ 12% from last month</p>
              </div>
            </Card>

            {/* Active Clients Card */}
            <Card className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-3xl font-bold text-gray-900">1,247</p>
                <p className="text-xs text-green-600">↑ 45 new this month</p>
              </div>
            </Card>

            {/* Average Account Value Card */}
            <Card className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Average Account Value</p>
                <p className="text-3xl font-bold text-gray-900">$19.65</p>
                <p className="text-xs text-gray-500">per client/month</p>
              </div>
            </Card>

            {/* Messages Sent Card */}
            <Card className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Messages Sent (Monthly)</p>
                <p className="text-3xl font-bold text-gray-900">8.2M</p>
                <p className="text-xs text-green-600">↑ 23% from last month</p>
              </div>
            </Card>

            {/* Delivery Rate Card */}
            <Card className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
                <p className="text-3xl font-bold text-gray-900">97.2%</p>
                <p className="text-xs text-green-600">↑ 0.5% from last month</p>
              </div>
            </Card>

            {/* Outstanding Invoices Card */}
            <Card className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Outstanding Invoices</p>
                <p className="text-3xl font-bold text-gray-900">$5,200</p>
                <p className="text-xs text-yellow-600">28 overdue invoices</p>
              </div>
            </Card>
          </div>
        )}

        {/* Pricing Plans Tab */}
        {activeTab === "pricing" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Pricing Plans</h2>
                <p className="text-sm text-gray-600">Manage SMS pricing tiers and volume discounts</p>
              </div>
              <button
                onClick={() => setShowPricingForm(!showPricingForm)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + New Plan
              </button>
            </div>

            {/* New pricing form (collapsed) */}
            {showPricingForm && (
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Create Pricing Plan</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Plan Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Premium Plus"
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Base Price per SMS</label>
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="0.005"
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                      <option>PAY_AS_YOU_GO</option>
                      <option>MONTHLY_SUBSCRIPTION</option>
                      <option>VOLUME_DISCOUNT</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                    Create
                  </button>
                  <button
                    onClick={() => setShowPricingForm(false)}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </Card>
            )}

            {/* Display pricing plans */}
            <PricingDisplay plans={plans} loading={plansLoading} />
          </div>
        )}

        {/* Rate Cards Tab */}
        {activeTab === "rates" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Rate Cards</h2>
                <p className="text-sm text-gray-600">Manage SMS rates by country and operator</p>
              </div>
              <button
                onClick={() => setShowRateForm(!showRateForm)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + New Rate
              </button>
            </div>

            {/* New rate form (collapsed) */}
            {showRateForm && (
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Create Rate Card</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                      type="text"
                      placeholder="RW"
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Operator</label>
                    <input
                      type="text"
                      placeholder="MTN"
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price per SMS</label>
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="0.009"
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                    Create
                  </button>
                  <button
                    onClick={() => setShowRateForm(false)}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </Card>
            )}

            {/* Display rate cards */}
            <RateCardsDisplay rateCards={rateCards} loading={rateLoading} />
          </div>
        )}
      </div>
    </div>
  );
};
