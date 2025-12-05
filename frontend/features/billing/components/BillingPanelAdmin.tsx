"use client";

import React, { useState, useCallback } from "react";
import { useWallet, useTransactions, useTopUpWallet } from "../hooks";
import { WalletCard } from "./wallet-card";
import { TransactionTable } from "./transaction-table";

type Props = {
  businessSid: string; // Admin wallet SID (e.g. AC_PLATFORM_0001)
  targetResellerSid: string; // Which reseller admin wants to manage
};

export const BillingPanelAdmin: React.FC<Props> = ({
  businessSid,
  targetResellerSid,
}) => {
  // Admin’s own wallet
  const adminWallet = useWallet(businessSid);

  // Reseller wallet (selected from dropdown)
  const resellerWallet = useWallet(targetResellerSid);
  const resellerTx = useTransactions(targetResellerSid);
  const topUpReseller = useTopUpWallet(targetResellerSid);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleTopUpReseller = useCallback(
    async (amount: number) => {
      const updated = await topUpReseller.topUp(amount, "ADMIN_TOPUP");
      if (updated) {
        setSuccessMsg(
          `Reseller topped up by ${amount.toFixed(2)} ${updated.currency}`
        );
        resellerWallet.refresh();
        resellerTx.refresh();
      }
    },
    [topUpReseller, resellerWallet, resellerTx]
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Admin Billing Dashboard</h2>

      {successMsg && (
        <div className="rounded bg-green-100 border border-green-400 text-green-700 px-4 py-2">
          {successMsg}
        </div>
      )}

      {/* Admin's own wallet */}
      <WalletCard
        wallet={adminWallet.wallet}
        loading={adminWallet.loading}
        onTopUp={() => {}}
        topUpLoading={false}
      />

      <h3 className="text-lg font-semibold">Manage Reseller</h3>

      {/* Reseller Wallet */}
      <WalletCard
        wallet={resellerWallet.wallet}
        loading={resellerWallet.loading}
        onTopUp={handleTopUpReseller}
        topUpLoading={topUpReseller.loading}
      />

      {/* Reseller transactions */}
      <TransactionTable
        transactions={resellerTx.transactions}
        loading={resellerTx.loading}
        smsStats={{
          totalCost:
            resellerTx.transactions
              ?.filter((t) => t.type === "SMS_DEBIT")
              .reduce((s, t) => s + Math.abs(t.amount), 0) ?? 0,
          totalMessages:
            resellerTx.transactions
              ?.filter((t) => t.type === "SMS_DEBIT")
              .length ?? 0,
        }}
      />
    </div>
  );
};
