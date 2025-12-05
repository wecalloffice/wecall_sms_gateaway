// features/billing/components/wallet-card.tsx
"use client";

import React, { useState, FormEvent } from "react";
import type { Wallet } from "../types";

type WalletCardProps = {
  wallet: Wallet | null;
  loading: boolean;
  onTopUp: (amount: number, reference?: string) => Promise<Wallet | null>;
  topUpLoading: boolean;
  onAmountChange?: (amount: string) => void;
  topupAmount?: string;
};

export const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  loading,
  onTopUp,
  topUpLoading,
  onAmountChange,
  topupAmount = "",
}) => {
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const numeric = parseFloat(topupAmount);
    if (isNaN(numeric) || numeric <= 0) return;

    const result = await onTopUp(numeric);
    if (result) {
      setLocalSuccess(`Top-up of $${numeric.toFixed(2)} successful!`);
      onAmountChange?.("");
      setTimeout(() => setLocalSuccess(null), 3000);
    }
  };

  // Quick topup presets
  const presets = [10, 25, 50, 100, 250, 500];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Wallet Balance
      </h3>

      {loading && <p className="text-sm text-gray-500">Loading wallet...</p>}

      {!loading && !wallet && (
        <p className="text-sm text-gray-500">
          No wallet found. Create one by topping up.
        </p>
      )}

      {!loading && wallet && (
        <div className="mb-6 space-y-1">
          <p className="text-4xl font-bold text-gray-900">
            {wallet.balance.toFixed(2)}{" "}
            <span className="text-base font-normal text-gray-500">
              {wallet.currency}
            </span>
          </p>
          {typeof wallet.credit_limit === "number" && (
            <p className="text-xs text-gray-500">
              Credit limit: {wallet.credit_limit.toFixed(2)} {wallet.currency}
            </p>
          )}
          <p className="text-xs text-gray-400">
            Wallet ID: <span className="font-mono text-xs">{wallet.sid}</span>
          </p>
        </div>
      )}

      {/* Success message */}
      {localSuccess && (
        <div className="mb-4 rounded-md border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-800">
          {localSuccess}
        </div>
      )}

      {/* Top-up form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            value={topupAmount}
            onChange={(e) => onAmountChange?.(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter amount"
          />
          <button
            type="submit"
            disabled={topUpLoading || !topupAmount}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
          >
            {topUpLoading ? "Processing..." : "Top up"}
          </button>
        </div>

        {/* Quick preset buttons */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-600">Quick amounts:</p>
          <div className="grid grid-cols-3 gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onAmountChange?.(String(preset))}
                className="rounded border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
