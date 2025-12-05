"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface TopupModalProps {
  businessId: string;
  currentBalance: number;
  onSuccess?: () => void;
}

export default function WalletTopupForm({ businessId, currentBalance, onSuccess }: TopupModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleTopup() {
    if (!amount || amount <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/billing/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          amount,
          description: description || `Top-up of $${amount}`,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Top-up failed");
      }

      const result = await res.json();
      setMessage({ type: "success", text: `Top-up successful! New balance: $${result.balance}` });
      setAmount(0);
      setDescription("");
      onSuccess?.();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  const presets = [10, 25, 50, 100, 250, 500];

  return (
    <Card className="p-6 max-w-md">
      <h3 className="text-lg font-bold mb-4">Add Funds to Wallet</h3>

      <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
        <p className="text-sm text-gray-600">Current Balance</p>
        <p className="text-2xl font-bold text-blue-600">${currentBalance.toFixed(2)}</p>
      </div>

      {message && (
        <div
          className={`p-3 rounded mb-4 text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {/* Amount Input */}
        <div>
          <Label htmlFor="topup-amount" className="text-sm font-medium">
            Amount (USD)
          </Label>
          <Input
            id="topup-amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="Enter amount"
            value={amount || ""}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            disabled={loading}
            className="mt-1"
          />
        </div>

        {/* Quick Presets */}
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">Quick amounts:</p>
          <div className="grid grid-cols-3 gap-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setAmount(p)}
                disabled={loading}
                className="px-3 py-2 border rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ${p}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="topup-description" className="text-sm font-medium">
            Description (optional)
          </Label>
          <Input
            id="topup-description"
            type="text"
            placeholder="e.g., Monthly credit purchase"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            className="mt-1"
          />
        </div>

        {/* Summary */}
        {amount > 0 && (
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <p className="text-sm text-gray-600">New balance after top-up:</p>
            <p className="text-lg font-bold text-gray-800">${(currentBalance + amount).toFixed(2)}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleTopup}
          disabled={loading || amount <= 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {loading ? "Processing..." : `Top Up $${amount.toFixed(2)}`}
        </Button>
      </div>
    </Card>
  );
}
