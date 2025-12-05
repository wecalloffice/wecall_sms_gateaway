"use client";

import React, { useState, useCallback } from "react";
import { useWallet, useTransactions, useTopUpWallet } from "../hooks";
import { WalletCard } from "./wallet-card";
import { TransactionTable } from "./transaction-table";

type Props = {
  resellerSid: string;       // e.g. AC_RESELLER_1001
  targetClientSid: string;   // selected client under reseller
};

export const BillingPanelReseller: React.FC<Props> = ({
  resellerSid,
  targetClientSid,
}) => {
  const resellerWallet = useWallet(resellerSid);
  const resellerTx = useTransactions(resellerSid);

  const clientWallet = useWallet(targetClientSid);
  const clientTx = useTransactions(targetClientSid);
  const topUpClient = useTopUpWallet(targetClientSid);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleTopUpClient = useCallback(
    async (amount: number) => {
      const updated = await topUpClient.topUp(amount, "RESELLER_TOPUP");
      if (updated) {
        setSuccessMsg(
          `Client topped up by ${amount.toFixed(2)} ${updated.currency}`
        );
        clientWallet.refresh();
        clientTx.refresh();
      }
    },
    [topUpClient, clientWallet, clientTx]
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Reseller Billing Dashboard</h2>

      {successMsg && (
        <div className="rounded bg-green-100 border border-green-400 text-green-700 px-4 py-2">
          {successMsg}
        </div>
      )}

      {/* Reseller Wallet */}
      <WalletCard
        wallet={resellerWallet.wallet}
        loading={resellerWallet.loading}
        onTopUp={() => {}}
        topUpLoading={false}
      />

      <h3 className="text-lg font-semibold">Manage Client</h3>

      {/* Client Wallet */}
      <WalletCard
        wallet={clientWallet.wallet}
        loading={clientWallet.loading}
        onTopUp={handleTopUpClient}
        topUpLoading={topUpClient.loading}
      />

      <TransactionTable
        transactions={clientTx.transactions}
        loading={clientTx.loading}
        smsStats={{
          totalCost:
            clientTx.transactions
              ?.filter((t) => t.type === "SMS_DEBIT")
              .reduce((s, t) => s + Math.abs(t.amount), 0) ?? 0,
          totalMessages:
            clientTx.transactions
              ?.filter((t) => t.type === "SMS_DEBIT")
              .length ?? 0,
        }}
      />
    </div>
  );
};
