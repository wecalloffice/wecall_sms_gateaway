"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

type Pricing = {
  basePrice: number;
  resellerMargin: number;
  clientMargin: number;
};

export default function PricingSettings() {
  const [pricing, setPricing] = useState<Pricing>({
    basePrice: 0.05,
    resellerMargin: 0.1,
    clientMargin: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await fetch("/api/billing/pricing");
        if (!res.ok) throw new Error("Failed to load pricing");
        const data = await res.json();
        setPricing(data);
      } catch (err: any) {
        setMessage({ type: "error", text: err.message });
      } finally {
        setLoading(false);
      }
    }
    loadPricing();
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/billing/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pricing),
      });
      if (!res.ok) throw new Error("Failed to save pricing");
      const data = await res.json();
      setPricing(data);
      setMessage({ type: "success", text: "Pricing updated successfully" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-gray-600">Loading pricing...</p>;

  return (
    <Card className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">SMS Pricing Settings</h2>

      {message && (
        <div
          className={`p-3 rounded mb-4 ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {/* Base Price */}
        <div>
          <Label htmlFor="basePrice" className="text-sm font-medium">
            Base Price per SMS (USD)
          </Label>
          <Input
            id="basePrice"
            type="number"
            step="0.001"
            min="0"
            value={pricing.basePrice}
            onChange={(e) => setPricing({ ...pricing, basePrice: parseFloat(e.target.value) || 0 })}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">e.g., 0.05 for $0.05 per SMS</p>
        </div>

        {/* Reseller Margin */}
        <div>
          <Label htmlFor="resellerMargin" className="text-sm font-medium">
            Reseller Margin (%)
          </Label>
          <Input
            id="resellerMargin"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={pricing.resellerMargin * 100}
            onChange={(e) => setPricing({ ...pricing, resellerMargin: (parseFloat(e.target.value) || 0) / 100 })}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">e.g., 10 for 10% margin</p>
        </div>

        {/* Client Margin */}
        <div>
          <Label htmlFor="clientMargin" className="text-sm font-medium">
            Client Margin (%)
          </Label>
          <Input
            id="clientMargin"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={pricing.clientMargin * 100}
            onChange={(e) => setPricing({ ...pricing, clientMargin: (parseFloat(e.target.value) || 0) / 100 })}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">e.g., 0 for no client margin</p>
        </div>

        {/* Price Calculation Example */}
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <p className="font-medium text-sm mb-2">Example: Cost per SMS to Client</p>
          <p className="text-sm text-gray-700">
            ${(
              pricing.basePrice *
              (1 + pricing.resellerMargin + pricing.clientMargin)
            ).toFixed(4)} per SMS
          </p>
        </div>

        {/* Save Button */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving ? "Saving..." : "Save Pricing"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
