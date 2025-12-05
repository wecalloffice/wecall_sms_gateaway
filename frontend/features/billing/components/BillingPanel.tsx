// features/billing/components/BillingPanel.tsx
"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useWallet, useTransactions, useTopUpWallet } from "../hooks";
import type { BillingTransaction } from "../types";
import { WalletCard } from "./wallet-card";
import { TransactionTable } from "./transaction-table";

type BillingPanelProps = {
  businessSid: string; // e.g. "AC_CLIENT_2001"
};

export const BillingPanel: React.FC<BillingPanelProps> = ({ businessSid }) => {
  const {
    wallet,
    loading: walletLoading,
    error: walletError,
    refresh: refreshWallet,
  } = useWallet(businessSid);

  const {
    transactions,
    loading: txLoading,
    error: txError,
    refresh: refreshTx,
  } = useTransactions(businessSid);

  const {
    topUp,
    loading: topUpLoading,
    error: topUpError,
  } = useTopUpWallet(businessSid);

  const [topupSuccess, setTopupSuccess] = useState<string | null>(null);

  const handleTopUp = useCallback(
    async (amount: number) => {
      setTopupSuccess(null);
      const updated = await topUp(amount, "UI_TOPUP");
      if (updated) {
        setTopupSuccess(`Wallet topped up by ${amount.toFixed(2)}.`);
        await Promise.all([refreshWallet(), refreshTx()]);
      }
    },
    [topUp, refreshWallet, refreshTx]
  );

  // Derive SMS stats from transactions
  const smsStats = useMemo(() => {
    const smsDebits = (transactions ?? []).filter(
      (t: BillingTransaction) => t.type === "SMS_DEBIT"
    );

    const totalCost = smsDebits.reduce(
      (sum, tx) => sum + Math.abs(tx.amount),
      0
    );

    const totalMessages = smsDebits.reduce((sum, tx) => {
      // default 1 message if not provided
      const count = typeof tx.details?.messages === "number" ? tx.details.messages : 1;
      return sum + count;
    }, 0);

    return {
      totalCost,
      totalMessages,
    };
  }, [transactions]);

  const lowBalance =
    wallet && typeof wallet.balance === "number" && wallet.balance < 10; // threshold

  return (
    <section className="space-y-4">
      {/* Global errors / alerts */}
      {(walletError || txError || topUpError) && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {walletError || txError || topUpError}
        </div>
      )}

      {topupSuccess && (
        <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
          {topupSuccess}
        </div>
      )}

      {lowBalance && (
        <div className="rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
          Balance is low. Please top up to avoid SMS delivery interruptions.
        </div>
      )}

      {/* Two-column layout: wallet + recent transactions */}
      <div className="grid gap-4 md:grid-cols-2">
        <WalletCard
          wallet={wallet}
          loading={walletLoading}
          onTopUp={handleTopUp}
          topUpLoading={topUpLoading}
        />

        <TransactionTable
          transactions={transactions}
          loading={txLoading}
          smsStats={smsStats}
        />
      </div>
    </section>
  );
};

